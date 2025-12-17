/**
 * @file server.js
 * @description Haupt-Serverdatei für das Schadensmeldungs-Backend.
 * Initialisiert den Express-Server, stellt die Verbindung zur MongoDB her
 * und definiert die API-Endpunkte.
 */

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

// --- Konfiguration ---
// PORT wird aus der Umgebungsvariable geladen, mit einem Standardwert von 3000
const PORT = process.env.PORT || 3000;
// MONGO_URL wird aus der Umgebungsvariable geladen
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("FATAL ERROR: MONGO_URL ist nicht in der Umgebung definiert.");
  process.exit(1);
}

// --- Express-App initialisieren ---
const app = express();

// --- Middleware ---
app.use(cors());
// Erhöhtes Limit erlaubt Base64-kodierte Bilder im JSON-Body
app.use(express.json({ limit: "5mb" }));

/**
 * Mongoose-Schema für eine Schadensmeldung.
 */
const reportSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  raum: { type: String, required: true },
  beschreibung: { type: String, required: true },
  email: { type: String, required: true },
  bild: { type: String }, // Base64 oder Data-URL
  status: {
    type: String,
    enum: ['offen', 'in_bearbeitung', 'erledigt'],
    default: 'offen',
  },
  archived: { type: Boolean, default: false },
  erstellt_am: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", reportSchema, "reports");

// --- Hilfsfunktionen ---
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidImagePayload = (bild) => {
  if (!bild) return true; // optional
  if (typeof bild !== "string") return false;
  return bild.startsWith("data:image/");
};

// --- API-Routen ---

/**
 * Liefert alle Schadensmeldungen, neueste zuerst.
 */
app.get("/api/reports", async (_req, res) => {
  try {
    const { uuid, raum, q, status, from, to, page = 1, limit = 20, sort, archived = false } = _req.query;

    const filter = {};

    // Parse archived parameter - handle string values from query
    const archivedValue = archived === 'true' ? true : archived === 'false' ? false : Boolean(archived);
    filter.archived = archivedValue;

    if (uuid) filter.uuid = uuid;
    if (raum) filter.raum = { $regex: new RegExp(escapeRegex(raum), 'i') };
    if (status) filter.status = status;
    if (q) {
      const qRegex = new RegExp(escapeRegex(q), 'i');
      filter.$or = [{ beschreibung: qRegex }, { email: qRegex }, { raum: qRegex }];
    }
    if (from || to) {
      filter.erstellt_am = {};
      if (from) {
        const fromDate = new Date(from);
        if (!isNaN(fromDate)) filter.erstellt_am.$gte = fromDate;
      }
      if (to) {
        const toDate = new Date(to);
        if (!isNaN(toDate)) filter.erstellt_am.$lte = toDate;
      }
      // Remove empty date filter
      if (Object.keys(filter.erstellt_am).length === 0) delete filter.erstellt_am;
    }

    // Pagination & sorting
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    let sortObj = { erstellt_am: -1 };
    if (sort) {
      // expected format: field:dir e.g. erstellt_am:desc or raum:asc
      const [field, dir] = sort.split(':');
      sortObj = { [field]: dir === 'asc' ? 1 : -1 };
    }

    const [data, total] = await Promise.all([
      Report.find(filter).sort(sortObj).skip(skip).limit(limitNum).lean(),
      Report.countDocuments(filter),
    ]);

    res.json({ data, meta: { total, page: pageNum, perPage: limitNum } });
  } catch (error) {
    console.error("Fehler beim Abrufen der Meldungen:", error);
    res.status(500).json({ message: "Interner Serverfehler beim Abrufen der Meldungen." });
  }
});

// Utility: escape user input for regex
function escapeRegex(string) {
  return String(string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Erstellt eine neue Schadensmeldung.
 * @route POST /api/reports
 * @param {express.Request} req - Enthält { raum, beschreibung, email, bild } im Body.
 */
app.post("/api/reports", async (req, res) => {
  try {
    const { raum, beschreibung, email, bild } = req.body;

    if (!raum || !beschreibung || !email) {
      return res.status(400).json({ message: "Raum, Beschreibung und E-Mail sind erforderlich." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Ungültige E-Mail-Adresse." });
    }

    if (!isValidImagePayload(bild)) {
      return res.status(400).json({ message: "Ungültiges Bildformat. Erwartet wird data:image/..." });
    }

    const newReport = new Report({
      uuid: uuidv4(),
      raum,
      beschreibung,
      email,
      bild,
    });

    await newReport.save();
    console.log("Neue Schadensmeldung gespeichert:", newReport.uuid);
    res.status(201).json(newReport);
  } catch (error) {
    console.error("Fehler beim Speichern der Meldung:", error);
    res.status(500).json({ message: "Interner Serverfehler beim Speichern der Meldung." });
  }
});

/**
 * Aktualisiert den Status einer Meldung.
 * PATCH /api/reports/:uuid/status
 * Body: { status: 'offen'|'in_bearbeitung'|'erledigt' }
 */
app.patch('/api/reports/:uuid/status', async (req, res) => {
  try {
    const { uuid } = req.params;
    const { status } = req.body;

    const allowed = ['offen', 'in_bearbeitung', 'erledigt'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Ungültiger Status' });
    }

    const updated = await Report.findOneAndUpdate({ uuid }, { $set: { status } }, { new: true }).lean();
    if (!updated) {
      return res.status(404).json({ message: 'Meldung nicht gefunden' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Status:', error);
    res.status(500).json({ message: 'Interner Serverfehler beim Aktualisieren des Status.' });
  }
});

/**
 * Archiviert oder entarchiviert eine Meldung.
 * PATCH /api/reports/:uuid/archive
 * Body: { archived: true|false }
 */
app.patch('/api/reports/:uuid/archive', async (req, res) => {
  try {
    const { uuid } = req.params;
    const { archived } = req.body;

    if (typeof archived !== 'boolean') {
      return res.status(400).json({ message: 'Ungültiger Archiv-Status (muss true oder false sein)' });
    }

    const updated = await Report.findOneAndUpdate({ uuid }, { $set: { archived } }, { new: true }).lean();
    if (!updated) {
      return res.status(404).json({ message: 'Meldung nicht gefunden' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Archiv-Status:', error);
    res.status(500).json({ message: 'Interner Serverfehler beim Aktualisieren des Archiv-Status.' });
  }
});

/**
 * Stellt die Verbindung zur MongoDB her und startet den Express-Server.
 */
async function startServer() {
  console.log("Versuche, eine Verbindung zur MongoDB herzustellen...");
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Erfolgreich mit MongoDB verbunden!");

    app.listen(PORT, () => {
      console.log(`Server läuft auf http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Fehler beim Starten des Servers oder der DB-Verbindung:", error);
    process.exit(1);
  }
}

// --- Serverstart ---
startServer();
