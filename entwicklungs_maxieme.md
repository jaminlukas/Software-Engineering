# Entwicklungsmaxime für Software

In diesem Dokument werden grundlegende Prinzipien und Best Practices für die Softwareentwicklung festgehalten. Das Ziel ist es, einen sauberen, wartbaren und robusten Code zu erstellen.

---

## KISS (Keep It Simple, Stupid)

**Prinzip:** Alles sollte so einfach wie möglich gehalten werden. Komplexität sollte nur dann hinzugefügt werden, wenn sie absolut notwendig ist. Einfacher Code ist leichter zu verstehen, zu debuggen und zu warten.

**Beispiel:**

Angenommen, der Name eines Benutzers muss formatiert werden.

**Schlecht (unnötig komplex):**
```javascript
function formatUserName(firstName, lastName) {
  if (firstName && lastName) {
    return `Nachname: ${lastName}, Vorname: ${firstName}`;
  } else if (firstName) {
    return `Vorname: ${firstName}`;
  } else if (lastName) {
    return `Nachname: ${lastName}`;
  } else {
    return 'Unbekannter Benutzer';
  }
}
```

**Gut (einfach und klar):**
```javascript
function formatUserName(firstName, lastName) {
  if (!firstName && !lastName) {
    return 'Unbekannter Benutzer';
  }
  return `${firstName || ''} ${lastName || ''}`.trim();
}
```

---

## DRY (Don't Repeat Yourself)

**Prinzip:** Code-Wiederholungen sind zu vermeiden. Jedes Stück Wissen oder Logik in einem System sollte eine einzige, eindeutige und maßgebliche Repräsentation haben. Code-Duplizierung führt zu Inkonsistenzen und erschwert die Wartung.

**Beispiel:**

**Schlecht (Code-Wiederholung):**
```javascript
function calculateRectangleArea(length, width) {
  return length * width;
}

function printRectangleDetails(length, width) {
  const area = length * width; // Wiederholte Logik
  console.log(`Länge: ${length}, Breite: ${width}, Fläche: ${area}`);
}
```

**Gut (Logik wiederverwenden):**
```javascript
function calculateRectangleArea(length, width) {
  return length * width;
}

function printRectangleDetails(length, width) {
  const area = calculateRectangleArea(length, width); // Wiederverwendung
  console.log(`Länge: ${length}, Breite: ${width}, Fläche: ${area}`);
}
```

---

## YAGNI (You Ain't Gonna Need It)

**Prinzip:** Es sollte keine Funktionalität implementiert werden, von der nur angenommen wird, dass sie in Zukunft benötigt wird. Der Fokus sollte auf den aktuellen Anforderungen liegen. Dies vermeidet unnötigen Code und Komplexität.

**Beispiel:**

Ein einfacher Taschenrechner wird entwickelt.

**Schlecht (Überentwicklung):**
Ein Entwickler fügt neben den Grundrechenarten auch gleich trigonometrische und logarithmische Funktionen hinzu, "nur für den Fall, dass sie später gebraucht werden".

**Gut (Fokus auf das Notwendige):**
Es werden nur die Addition, Subtraktion, Multiplikation und Division implementiert, wie es die aktuellen Anforderungen vorsehen. Weitere Funktionen können bei Bedarf später hinzugefügt werden.

---

## Clean Code

Clean Code ist Code, der leicht zu lesen, zu verstehen und zu warten ist.

### Aussagekräftige Namen

Variablen, Funktionen und Klassen sollten Namen haben, die ihren Zweck klar beschreiben.

**Schlecht:**
```javascript
let d = 10; // was ist d?
function proc(a, b) { ... } // was macht proc?
```

**Gut:**
```javascript
let elapsedTimeInDays = 10;
function calculateSum(a, b) { ... }
```

### Funktionen

- **Eine Aufgabe pro Funktion:** Jede Funktion sollte genau eine Aufgabe erledigen.
- **Kurz halten:** Funktionen sollten so kurz wie möglich sein.
- **Wenig Argumente:** Je weniger Argumente eine Funktion hat, desto einfacher ist sie zu verwenden.

**Schlecht (macht zu viel):**
```javascript
function getUserDataAndCreateReport(userId) {
  // 1. Daten von der API abrufen
  // 2. Daten validieren
  // 3. Bericht im PDF-Format erstellen
  // 4. Bericht per E-Mail senden
}
```

**Gut (aufgeteilt in mehrere Funktionen):**
```javascript
function getUserData(userId) { ... }
function validateUserData(user) { ... }
function createPdfReport(user) { ... }
function sendEmail(report) { ... }
```

### Kommentare

- **Kommentare erklären das *Warum*, nicht das *Was***: Guter Code ist selbsterklärend. Kommentare sollten nur dann verwendet werden, wenn die Logik komplex ist und eine Erklärung benötigt, warum sie auf eine bestimmte Weise implementiert wurde.
- **Vermeide auskommentierten Code:** Auskommentierter Code sollte gelöscht werden. Versionskontrollsysteme wie Git können alte Versionen wiederherstellen.

## Responsive Design
```javascript
/* Mobile First */
.container {
  width: 100%;
  padding: 1rem;
}

/* Desktop */
@media (min-width: 768px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
}
```

### Erweiterte Responsive Features
```javascript
/* Mobile */
.grid { display: block; }

/* Tablet */
@media (min-width: 768px) {
  .grid { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .grid { 
    grid-template-columns: repeat(3, 1fr); 
  }
}

/* Large Desktop */
@media (min-width: 1440px) {
  .grid { 
    grid-template-columns: repeat(4, 1fr); 
  }
}
```
