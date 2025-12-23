import { isValidEmail, isValidImagePayload, escapeRegex } from '../utils.js';

describe('isValidEmail', () => {
  it('sollte true für eine gültige E-Mail-Adresse zurückgeben', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name+tag@sub.domain.co.uk')).toBe(true);
  });

  it('sollte false für eine ungültige E-Mail-Adresse zurückgeben', () => {
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('test@.com')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('test@example')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('isValidImagePayload', () => {
  it('sollte true für einen gültigen Data-URL-String zurückgeben', () => {
    expect(isValidImagePayload('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0EAwjgHzFNtADIACUSYcFWEAAAAASUVORK5CYII=')).toBe(true);
    expect(isValidImagePayload('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/')).toBe(true);
  });

  it('sollte true zurückgeben, wenn das Bild null oder undefined ist (optional)', () => {
    expect(isValidImagePayload(null)).toBe(true);
    expect(isValidImagePayload(undefined)).toBe(true);
  });

  it('sollte false für einen ungültigen Data-URL-String oder falschen Typ zurückgeben', () => {
    expect(isValidImagePayload('not-a-data-url')).toBe(false);
    expect(isValidImagePayload('data:text/plain;base64,SGVsbG8=')).toBe(false); // Falscher Mime-Typ
    expect(isValidImagePayload('')).toBe(false);
    expect(isValidImagePayload(123)).toBe(false);
    expect(isValidImagePayload({})).toBe(false);
  });
});

describe('escapeRegex', () => {
  it('sollte Sonderzeichen in einem String escapen', () => {
    expect(escapeRegex('test.string+?')).toBe('test\.string\+\?');
    expect(escapeRegex('^$*+?.()|[]{}')).toBe('\^\$\*\+\?\.\(\)\|\[\]\{\}');
  });

  it('sollte einen normalen String unverändert zurückgeben', () => {
    expect(escapeRegex('helloWorld123')).toBe('helloWorld123');
  });

  it('sollte mit leeren Strings umgehen können', () => {
    expect(escapeRegex('')).toBe('');
  });

  it('sollte mit Zahlen umgehen können', () => {
    expect(escapeRegex(123)).toBe('123'); // String(123) wird "123"
  });

  it('sollte mit null und undefined umgehen können', () => {
    expect(escapeRegex(null)).toBe('null');
    expect(escapeRegex(undefined)).toBe('undefined');
  });
});
