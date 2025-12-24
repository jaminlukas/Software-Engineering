# **📲 CampusApp – Ticketsystem für Schäden**

Die CampusApp ist ein digitales Ticketsystem zur schnellen und unkomplizierten Meldung von Schäden an der Hochschule. Studierende sowie Mitarbeitende können Defekte, Ausfälle oder andere Probleme direkt über die App erfassen und mit einer Beschreibung, Fotos sowie einer Standortangabe versehen. Jede Meldung wird als Ticket gespeichert und erhält einen Status, um den Bearbeitungsfortschritt transparent nachvollziehen zu können. Verantwortliche Hausmeister oder Techniker sehen alle Tickets in einer Verwaltungsoberfläche und können diese priorisieren, zuweisen und abschließen. Die Anwendung soll übersichtlich, barrierefrei und benutzerfreundlich gestaltet sein, wobei der Fokus auf einem modernen, minimalistischen Design liegt. Technisch basiert die CampusApp auf React für das Frontend, Node.js für das Backend und MongoDB als Datenbank. Diese Auswahl des Tech-Stacks ist auch als MERN-Stack bekannt. Die Kommunikation zwischen den Komponenten erfolgt über eine API, um eine klare Trennung und einfache Erweiterbarkeit zu gewährleisten. Das Projekt entsteht im Rahmen eines Hochschulkurses und wird als MVP bzw. Proof of Concept umgesetzt. Der Einsatz mit echten Nutzerinnen und Nutzern ist in dieser Phase nicht vorgesehen, da der Schwerpunkt auf der Funktionalität und der technischen Umsetzung liegt. Nach Abschluss des MVP kann die App iterativ um zusätzliche Features erweitert werden.

## 👥 Team
Dieses Projekt wird im Rahmen der Hochschule von folgenden Personen entwickelt:

- Lukas Becker
- Jamin  Allmendinger
- Felix Weiner
- Luka Lasovic

# Gedanken zur Entwicklung

## 1) Anforderungen

### ✨ Funktionale Anforderungen: 
- 📝 **Schadensmeldung:** Nutzer können Schäden (z. B. defekte Geräte, kaputte Möbel, technische Probleme) bequem melden.
- 📸 **Foto-Upload:** Zum besseren Verständnis können Bilder des Schadens hochgeladen werden.
- 📍 **Standortangabe:** Schäden lassen sich durch eine Raum- oder Standortangabe präzisieren.
- 🎫 **Ticket-System:** Jede Meldung wird als Ticket erfasst und erhält einen Status (offen, in Bearbeitung, behoben).
- 🔔 **Benachrichtigungen:** Nutzer werden über den Fortschritt ihres Tickets informiert.
- 👩‍🔧 **Verwaltung für Hausmeister & Technik-Team:** Verantwortliche sehen alle gemeldeten Tickets und können diese priorisieren, zuweisen und abschließen.

### ✨ Nicht-funktionale Anforderungen:  
- Vermeidung von Spam, beispielsweise durch Eingabefilter.
- Barrierefreiheit (Accessibility) der Eingabeoberfläche für Meldungen.
- Modernes, minimalistisches Design.

## 2) Datenmodell 
- **Wie sind die Daten aufgebaut?**  
    Einzelne Ticketeinträge mit: E-Mail, Text, Bildern, Datum, Raumnummer (z. B. "R.3.10").
- **Wie werden diese Daten erhoben?**  
    Durch ein Formular auf einer Weboberfläche.
- **Wie werden die Daten verwendet/abgerufen?**  
    Abruf der Tickets, gefiltert nach Datum, Raumnummer und Status.
- **Wie interagieren die Daten untereinander?**  
     Einzelne Tickets können priorisiert und einem Team zugewiesen werden. Die Tickets an sich interagieren nicht miteinander.

## 3) MVP Idee
Das MVP besteht aus allen User Storys, die mit „Must-have“ priorisiert sind. Sie stellen die Kernfunktionen der Applikation dar.
- Formular zum Melden der Schäden
- Raumangabe auf dem Formular, um den Ort zu bestimmen
- Möglichkeit, Bilder hochzuladen
- Eine Admin-Ansicht für alle eingereichten Tickets

## 4) User Interaktion Design
![User_interface](/picture/Basis_oberflaeche.png)
Um ein besseres Verständnis für die Anwendung aus Benutzersicht zu erhalten, wird ein einfaches Wireframe der Oberfläche konzipiert. Dadurch werden das generelle Design, die Oberflächenkomponenten und die User Experience (UX) erkennbar.

## 5) Skalierung
- **Sollen echte Nutzer auf die Anwendung?**  
    Nein. Die Applikation ist als MVP bzw. PoC (Proof of Concept) gedacht, ohne großangelegte Nutzertests.
- **Wie lang ist der Zeithorizont für den Betrieb der Anwendung?**  
    Das Projekt findet im Rahmen des 3. Semesters statt und bezieht sich somit auf einen Zeitraum von maximal 12 Wochen.

## 6) High-Level-Architektur
- **Welche generellen Komponenten hat die Anwendung (Frontend, Backend, DB, ....)?**  
    Als Komponenten wurden eine Oberfläche und eine Datenbank identifiziert. Eine dritte Komponente ist die API, welche diese beiden verbindet. Dies ist aus dem folgenden Ausschnitt unseres C4-Modells zu entnehmen:
    ![generelle Komponenten aus dem C4 Modell](/picture/Event%20Storming%20Ticket%20System%20-%20Container%20Ticktsystem.jpg)
    
- **Wie sieht die Kommunikation zwischen diesen Teilen aus?**  
    Die Kommunikation zwischen den Komponenten erfolgt über eine API. Aufgrund des simplen MVP sind keine ausgefallenen technischen Lösungen nötig. Die Komponenten sind dabei in einzelnen Containern platziert, um das Deployment und die Verbindung untereinander zu vereinfachen.
- **Welches sind die kritischen Bestandteile der Architektur?**  
    Durch das MVP-Design stellen die hier gezeigten Komponenten die minimale Architektur dar, mit der die Applikation funktionieren kann. Kritisch sind dabei die persistente Datenspeicherung in der Datenbank und deren Anbindung an die Oberfläche mittels API.

**Bis hierhin waren alle Überlegungen nicht-technisch.**

## 7) Stack
- **Welche Tools können für welchen Teil der Architektur verwendet werden?**  
    Aus persönlicher Neugier entschied sich das Entwicklerteam für React im Frontend, Node.js im Backend und MongoDB als Datenbank.  
    - **React:** Da es den Bau einer Single-Page Application (SPA) ermöglicht.  
    - **Node.js:** Da dieses bereits in früheren Projekten zum Einsatz kam. Ein Express-Server bietet sich hier sehr gut an, um das API-Routing im Backend zu übernehmen.   
    - **MongoDB:** Da für die Entwicklung eines MVP das einfache Aufsetzen einer Dokumenten-Datenbank ein Vorteil ist. Des Weiteren sind die behandelten Daten, wie unter Punkt 2 ersichtlich, nicht sehr komplex, was den Einsatz einer relationalen Datenbank nicht zwingend erfordert.
- **Wie kann die Anwendung deployed werden?**  
    Durch die Containerisierung der Anwendung mit Docker sollte das Deployment erleichtert werden.
    Eine Möglichkeit ist das Klonen des Repositorys in ein Serververzeichnis. Von dort aus kann die Containerisierung gestartet werden. Eine Anpassung der Ports ist eventuell notwendig.

## 8) Einstieg in die Entwicklung
1. Anlegen der Ordnerstruktur
2. Festlegen von Entwicklungsmaximen: KISS, CSS-Formatierung, Clean Code, ...
3. Aufsetzen der Datenstruktur. Dabei müssen die Datenbank und das Backend-Routing zuerst aufgesetzt werden.
4. Implementierung der Features nach Scrum:
    1. Kategorisierung der „Must-have“-User-Storys nach geschätzter Größe (Epic, User Story).
    2. Auswahl der zu implementierenden Features für den nächsten Sprint. Diese Features werden in das Sprint Backlog aufgenommen.
    3. Unterteilung von Epics in einzelne User Storys.
    4. Bestimmung von Tasks zur Umsetzung jeder einzelnen User Story sowie die Definition von Akzeptanzkriterien für die Story. 

## 9) Iterative Weiterentwicklung
Nach der Implementierung des MVP und dessen Deployment können weitere Features aus dem Backlog hinzugefügt werden. Nach der MoSCoW-Priorisierung wären das die Features mit „Should-have“- und „Could-have“-Priorisierung.
