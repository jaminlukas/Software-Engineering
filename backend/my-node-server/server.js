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
import dotenv from "dotenv";

// Umgebungsvariablen aus .env-Datei laden
dotenv.config();

// --- Konfiguration ---
// PORT wird aus der .env-Datei geladen, mit einem Standardwert von 3000
const PORT = process.env.PORT || 3000;
// MONGO_URL wird aus der .env-Datei geladen
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("FATAL ERROR: MONGO_URL ist nicht in der Umgebung definiert.");
  process.exit(1);
}

// --- Express-App initialisieren ---
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

/**
 * @description Mongoose-Schema für eine Schadensmeldung.
 * @property {string} uuid - Eine eindeutige ID für die Meldung.
 * @property {string} raum - Der Raum oder Ort des Schadens.
 * @property {string} beschreibung - Eine detaillierte Beschreibung des Schadens.
 * @property {Date} erstellt_am - Das Datum, an dem die Meldung erstellt wurde.
 */
const reportSchema = new mongoose.Schema({
    uuid: { type: String, required: true, unique: true },
    raum: { type: String, required: true },
    beschreibung: { type: String, required: true },
    erstellt_am: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", reportSchema, "reports");

// --- API-Routen ---

/**
 * Erstellt eine neue Schadensmeldung.
 * @route POST /api/reports
 * @param {express.Request} req - Das Request-Objekt, enthält { raum, beschreibung } im Body.
 * @param {express.Response} res - Das Response-Objekt.
 */
app.post("/api/reports", async (req, res) => {
    try {
        const { raum, beschreibung } = req.body;

        if (!raum || !beschreibung) {
            return res.status(400).json({ message: "Raum und Beschreibung sind erforderlich." });
        }

        const newReport = new Report({
            uuid: uuidv4(),
            raum,
            beschreibung,
        });

        await newReport.save();
        console.log("📝 Neue Schadensmeldung gespeichert:", newReport);
        res.status(201).json(newReport);

    } catch (error) {
        console.error("❌ Fehler beim Speichern der Meldung:", error);
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
        console.log("✅ Erfolgreich mit MongoDB verbunden!");

        app.listen(PORT, () => {
            console.log(`✅ Server läuft auf http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Fehler beim Starten des Servers oder der DB-Verbindung:", error);
        process.exit(1);
    }
}

// --- Serverstart ---
startServer();