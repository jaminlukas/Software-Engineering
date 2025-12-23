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
   * @description Prüft, ob der GET-Endpunkt /api/reports alle Meldungen im korrekten Format zurückgibt.
   */
  it('sollte alle Meldungen abrufen und Status 200 zurückgeben', async () => {
    // Test-Setup: Eine Meldung erstellen, damit die Datenbank nicht leer ist.
    await new Report({
        uuid: "test-uuid-123",
        raum: "Test-Raum A01",
        beschreibung: "Licht flackert",
        email: "test@dev.com"
    }).save();
    
    const res = await request(app).get('/api/reports');
    
    expect(res.statusCode).toEqual(200);
    
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('meta');
    expect(Array.isArray(res.body.data)).toBe(true);

    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].raum).toBe("Test-Raum A01");
  });

  /**
   * @description Validiert das erfolgreiche Erstellen einer neuen Meldung via POST /api/reports.
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

    expect(res.statusCode).toEqual(201);

    expect(res.body).toHaveProperty('uuid');
    expect(res.body.raum).toBe(newReport.raum);
    expect(res.body.status).toBe('offen');

    // Verifizieren, dass die Meldung in der Datenbank persistiert wurde.
    const reportInDb = await Report.findOne({ uuid: res.body.uuid });
    expect(reportInDb).not.toBeNull();
    expect(reportInDb.beschreibung).toBe(newReport.beschreibung);
  });

  /**
   * @description Stellt sicher, dass die API-Validierung bei fehlenden Daten (POST /api/reports) fehlschlägt.
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