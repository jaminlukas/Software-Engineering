// 🚀 server.js

import express from "express";

import cors from "cors"; // 🚀 erlaubt Zugriff von deiner React-App

const app = express();

const PORT = 3000;

// 🚀 Middleware

app.use(cors()); // erlaubt React (Port 5173), Anfragen zu senden

app.use(express.json()); // ermöglicht JSON-Parsing im Body

// 🚀 Basisroute

app.get("/", (req, res) => {

    res.send("👋 Willkommen auf deinem Node.js Server 🚀");

});

// 🚀 API-Route für React

app.get("/api/info", (req, res) => {

    res.json({

        message: "Hallo aus deinem Node.js-Backend 🚀",

        time: new Date().toLocaleTimeString(),

    });

});

// 🚀 Beispiel-POST-Route (optional)

app.post("/api/echo", (req, res) => {

    const data = req.body;

    console.log("📦 Empfangen:", data);

    res.json({

        received: data,

        status: "✅ Erfolgreich empfangen 🚀",

    });

});

// 🚀 Server starten

app.listen(PORT, () => {

    console.log(`✅ Server läuft auf http://localhost:${PORT} 🚀`);

});

