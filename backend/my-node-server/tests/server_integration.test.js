import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js'; // Unsere Express-App

// Die MONGO_URL wird durch das Importieren von server.js via dotenv geladen
const MONGO_URL = process.env.MONGO_URL;

// --- Test-Suite für die API-Endpunkte ---

describe('API Endpoints', () => {

  // Vor allen Tests: Verbindung zur Test-Datenbank herstellen
  beforeAll(async () => {
    if (!MONGO_URL) {
      throw new Error('MONGO_URL not defined. Make sure you have a .env file.');
    }
    // Wir verwenden die echte Datenbank für diesen Integrationstest,
    // aber in einem echten Projekt würde man eine separate Test-DB nehmen.
    await mongoose.connect(MONGO_URL);
  });

  // Nach allen Tests: Verbindung trennen, damit Jest sauber beenden kann
  afterAll(async () => {
    await mongoose.connection.close();
  });

  /**
   * Test für GET /api/reports
   * - Stellt sicher, dass der Endpunkt erreichbar ist.
   * - Prüft, ob die Antwortstruktur korrekt ist.
   */
  it('sollte alle Meldungen abrufen und Status 200 zurückgeben', async () => {
    const res = await request(app).get('/api/reports');
    
    // 1. Statuscode-Prüfung
    expect(res.statusCode).toEqual(200);
    
    // 2. Struktur-Prüfung des Antwort-Bodys
    // Die Antwort sollte ein Objekt sein, das 'data' und 'meta' enthält.
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('meta');

    // 'data' sollte ein Array sein
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  /**
   * Test für POST /api/reports
   * - Testet das Erstellen einer neuen Meldung mit validen Daten.
   */
  it('sollte eine neue Meldung erstellen und Status 201 zurückgeben', async () => {
    const newReport = {
      raum: 'Test-Raum B42',
      beschreibung: 'Die Kaffeemaschine ist explodiert.',
      email: 'test@example.com',
    };

    const res = await request(app)
      .post('/api/reports')
      .send(newReport);

    // 1. Statuscode-Prüfung
    expect(res.statusCode).toEqual(201);

    // 2. Prüfung der zurückgegebenen Daten
    expect(res.body).toHaveProperty('uuid');
    expect(res.body.raum).toBe(newReport.raum);
    expect(res.body.status).toBe('offen');
  });

  /**
   * Test für POST /api/reports mit fehlenden Daten
   * - Stellt sicher, dass die Validierung fehlschlägt.
   */
  it('sollte bei fehlenden Daten einen Fehler 400 zurückgeben', async () => {
    const incompleteReport = {
      raum: 'Test-Raum C13',
    };

    const res = await request(app)
      .post('/api/reports')
      .send(incompleteReport);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Raum, Beschreibung und E-Mail sind erforderlich.');
  });
});
