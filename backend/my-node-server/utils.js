/**
 * @file utils.js
 * @description Dieses Modul enthält wiederverwendbare Hilfsfunktionen und Logik,
 * die unabhängig von der Kern-Server-Initialisierung oder spezifischen API-Routen sind.
 * Es dient dazu, "pure" Funktionen (deren Ergebnis ausschließlich von ihren Eingaben abhängt
 * und keine Seiteneffekte hat) zu isolieren, um sie leichter testbar zu machen und
 * die Codebasis modularer zu gestalten.
 *
 * **Wann Funktionen hierher gehören:**
 * - Validierungsfunktionen (z.B. E-Mail-Format, Bild-Payload).
 * - Daten-Transformationsfunktionen.
 * - Hilfsfunktionen, die keine direkten Zugriffe auf die Express-App,
 *   die Datenbank (Mongoose-Modelle) oder globale Server-Zustände benötigen.
 *
 * **Wann Funktionen in server.js bleiben (oder in spezielle Controller/Services gehören):**
 * - Definitionen von API-Endpunkten (`app.get`, `app.post`, etc.).
 * - Middleware-Funktionen.
 * - Logik, die direkt mit der Datenbank interagiert (z.B. Mongoose-Modell-Abfragen).
 * - Server-Initialisierung und -Start (`app.listen`, `mongoose.connect`).
 */

/**
 * Prüft, ob ein String eine valide E-Mail-Adresse ist.
 * @param {string} email - Die zu prüfende E-Mail.
 * @returns {boolean}
 */
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Prüft, ob der Payload für ein Bild das korrekte Data-URL-Format hat.
 * Ein Bild ist optional (null/undefined gilt als gültig).
 * @param {string | null | undefined} bild - Der Base64-kodierte String oder null/undefined.
 * @returns {boolean}
 */
export const isValidImagePayload = (bild) => {
  if (!bild) return true; // Bild ist optional
  if (typeof bild !== 'string') return false;
  return bild.startsWith('data:image/');
};

/**
 * Escaped einen String, damit er sicher in einem regulären Ausdruck verwendet werden kann.
 * Dies verhindert, dass spezielle Regex-Zeichen als Teil des Musters interpretiert werden.
 * @param {string} string - Der zu escapende String.
 * @returns {string}
 */
export const escapeRegex = (string) => {
  // Stellt sicher, dass der Input ein String ist, bevor replace aufgerufen wird
  return String(string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
