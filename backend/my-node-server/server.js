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
    const reports = await Report.find().sort({ erstellt_am: -1 }).lean();
    res.json(reports);
  } catch (error) {
    console.error("Fehler beim Abrufen der Meldungen:", error);
    res.status(500).json({ message: "Interner Serverfehler beim Abrufen der Meldungen." });
  }
});

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
