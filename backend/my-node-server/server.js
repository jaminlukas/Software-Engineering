// 🚀 server.js
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

// --- Konfiguration ---
const PORT = 3000;
const MONGO_URL = "mongodb://localhost:27017";
const DB_NAME = "my-test-db";

// --- Initialisierung ---
const app = express();
const mongoClient = new MongoClient(MONGO_URL);

// --- Middleware ---
app.use(cors()); // Erlaubt Cross-Origin-Anfragen (z.B. von einer React-App)
app.use(express.json()); // Ermöglicht das Parsen von JSON im Request-Body

// --- Datenbankverbindung ---
/**
 * Stellt eine Verbindung zur MongoDB-Datenbank her und führt einen Test-Ping aus.
 * Bei Erfolg wird der Server gestartet.
 */
async function connectToDatabase() {
    console.log("Versuche, eine Verbindung zur MongoDB herzustellen...");
    try {
        await mongoClient.connect();
        console.log("✅ Erfolgreich mit MongoDB verbunden!");

        // Testen der Verbindung mit einem Ping-Befehl
        const pingResult = await mongoClient.db(DB_NAME).command({ ping: 1 });
        console.log("✅ Datenbank-Ping erfolgreich:", pingResult);

        // Server erst starten, nachdem die DB-Verbindung steht
        app.listen(PORT, () => {
            console.log(`✅ Server läuft auf http://localhost:${PORT} 🚀`);
        });

    } catch (error) {
        console.error("❌ Fehler bei der Verbindung zur MongoDB:", error);
        process.exit(1); // Beendet den Prozess bei einem DB-Verbindungsfehler
    }
}

// --- Routen ---

/**
 * @route GET /
 * @description Basisroute, die eine Willkommensnachricht zurückgibt.
 */
app.get("/", (req, res) => {

    res.send("👋 Willkommen auf deinem Node.js Server 🚀");

});

/**
 * @route GET /api/info
 * @description Gibt eine JSON-Antwort mit einer Nachricht und der aktuellen Uhrzeit zurück.
 */
app.get("/api/info", (req, res) => {

    res.json({

        message: "Hallo aus deinem Node.js-Backend 🚀",

        time: new Date().toLocaleTimeString(),

    });

});

/**
 * @route POST /api/echo
 * @description Nimmt JSON-Daten im Body entgegen, loggt sie und sendet sie als Antwort zurück.
 * @param {object} req.body - Die empfangenen JSON-Daten.
 */
app.post("/api/echo", (req, res) => {

    const data = req.body;

    console.log("📦 Empfangen:", data);

    res.json({

        received: data,

        status: "✅ Erfolgreich empfangen 🚀",

    });

});

// --- Serverstart ---
connectToDatabase();