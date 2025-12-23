import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js'; // Die Express-App importieren

let mongoServer;
const Report = mongoose.model("Report");

// --- Test-Suite für die API-Endpunkte ---
describe('API Endpoints', () => {

  // Vor allen Tests: In-Memory-MongoDB starten und verbinden
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  // Nach allen Tests: Verbindung trennen und In-Memory-DB stoppen
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Vor jedem Test: Alle Daten aus der Test-DB löschen
  beforeEach(async () => {
    await Report.deleteMany({});
  });

  /**
   * Test für GET /api/reports
   * - Stellt sicher, dass der Endpunkt erreichbar ist.
   * - Prüft, ob die Antwortstruktur korrekt ist.
   */
  it('sollte alle Meldungen abrufen und Status 200 zurückgeben', async () => {
    // Zuerst eine Testmeldung erstellen, damit die DB nicht leer ist
    await new Report({
        uuid: "test-uuid-123",
        raum: "Test-Raum A01",
        beschreibung: "Licht flackert",
        email: "test@dev.com"
    }).save();
    
    const res = await request(app).get('/api/reports');
    
    // 1. Statuscode-Prüfung
    expect(res.statusCode).toEqual(200);
    
    // 2. Struktur-Prüfung des Antwort-Bodys
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('meta');

    // 'data' sollte ein Array sein
    expect(Array.isArray(res.body.data)).toBe(true);

    // 3. Inhaltsprüfung (optional, aber gut für die Konsistenz)
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].raum).toBe("Test-Raum A01");
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

    // 3. Prüfen, ob die Meldung wirklich in der DB gespeichert wurde
    const reportInDb = await Report.findOne({ uuid: res.body.uuid });
    expect(reportInDb).not.toBeNull();
    expect(reportInDb.beschreibung).toBe(newReport.beschreibung);
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