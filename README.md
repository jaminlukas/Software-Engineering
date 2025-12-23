# **📲 CampusApp – Ticketsystem für Schäden**

Die CampusApp ist ein digitales Ticketsystem zur schnellen und unkomplizierten Meldung von Schäden an der Hochschule. Studierende und Mitarbeitende können Defekte, Ausfälle oder andere Probleme direkt über die App erfassen und mit einer Beschreibung, Fotos und Standortangabe versehen. Jede Meldung wird als Ticket gespeichert und mit einem Status versehen, um den Bearbeitungsfortschritt transparent nachvollziehen zu können. Verantwortliche Hausmeister oder Techniker sehen alle Tickets in einer Verwaltungsoberfläche und können diese priorisieren, zuordnen und abschließen. Die Anwendung soll übersichtlich, barrierefrei und benutzerfreundlich gestaltet sein, mit Fokus auf modernes, minimalistisches Design. Technisch basiert die CampusApp auf React für das Frontend, Django für das Backend und MongoDB als Datenbank. Die Kommunikation zwischen den Komponenten erfolgt über eine API, um eine klare Trennung und einfache Erweiterbarkeit zu gewährleisten. Das Projekt entsteht im Rahmen eines Hochschulkurses und wird als MVP bzw. Proof of Concept umgesetzt. Echte Nutzerinnen und Nutzer sind in dieser Phase nicht vorgesehen, da der Schwerpunkt auf Funktionalität und technischer Umsetzung liegt. Nach Abschluss des MVP kann die App iterativ um zusätzliche Features erweitert werden.

## 👥 Team
Dieses Projekt wird im Rahmen der Hochschule von folgenden Personen entwickelt:

- Luka (mit s)  
- Benjamin (ohne Ben)  
- Felix (mit x)

# Gedanken zur Entwicklung

## 1) Anforderungen

### ✨ Funktionale Anforderungen: 
- 📝 **Schadensmeldung:** Nutzer können Schäden (z. B. defekte Geräte, kaputte Möbel, technische Probleme) bequem melden.
- 📸 **Foto-Upload:** Zum besseren Verständnis können Bilder des Schadens hochgeladen werden.
- 📍 **Standortangabe:** Schäden lassen sich mit Raum- oder Standortangabe präzisieren.
- 🎫 **Ticket-System:** Jede Meldung wird als Ticket erfasst und erhält einen Status (offen, in Bearbeitung, behoben).
- 🔔 **Benachrichtigungen:** Nutzer werden über den Fortschritt ihres Tickets informiert.
- 👩‍🔧 **Verwaltung für Hausmeister & Technik-Team:** Verantwortliche sehen alle gemeldeten Tickets und können diese priorisieren, zuordnen und abschließen.

### ✨ Nicht-funktionale Anforderungen:  
- Vermeidung von Spam durch bspw. Eingabefilter
- Accessibility der Meldungs-Eingabeoberfläche
- Modernes, minimalistisches Design

## 2) Datenmodell 
- **Wie sind die Daten aufgebaut?**  
    Einzelne Ticketeinträge mit: E-Mail, Text, Bildern, Datum, Raumnummer (z.B. "R.3.10").
- **Wie werden diese Daten erhoben?**  
    Durch ein Formular auf einer Weboberfläche.
- **Wie werden die Daten angewendet/abgerufen?**  
    Abruf der Tickets, gefiltert nach Datum, Raumnummer, etc.
- **Wie interagieren die Daten untereinander?**  
     Einzelne Tickets können priorisiert und einem Team zugeordnet werden. Die Tickets an sich interagieren nicht untereinander.

## 3) MVP Idee
Das MVP besteht aus allen User-Story-Features aus dem GitHub-Projects-Tab, die als "Must-have" gekennzeichnet sind.
- Formular zum Melden der Schäden
- Raumangabe auf dem Formular, um den Ort zu bestimmen
- Möglichkeit, Bilder hochzuladen
- Admin-Ansicht auf alle eingereichten Tickets

## 4) User Interaktion Design
![User_interface](/picture/Basis_oberflaeche.png)
Das Design wird "Mobile first" entwickelt, da die Skalierung eines Formulars von einer mobilen Oberfläche einfacher ist als die Komprimierung einer Desktop-Oberfläche.

## 5) Skalierung
- **Sollen echte Nutzer auf die Anwendung?**  
    Nein. Die Applikation ist als MVP bis PoC (Proof of Concept) gedacht, ohne großangelegte Nutzertests.
- **Wie lang ist der Zeithorizont für den Betrieb der Anwendung?**  
    Das Projekt findet im Rahmen des 3. Semesters statt und bezieht sich somit auf maximal 12 Wochen.

## 6) High-Level-Architektur
- **Welche generellen Komponenten hat die Anwendung (Frontend, Backend, DB, ....)?**  
    Als Komponenten wurden eine Oberfläche und eine Datenbank identifiziert. Eine dritte Komponente ist die Verbindung dieser beiden mit einer API. Das ist aus dem folgenden Ausschnitt unseres C4-Modells zu entnehmen:
    ![generelle Komponenten aus dem C4 Modell](/picture/Event%20Storming%20Ticket%20System%20-%20Container%20Ticktsystem.jpg)
    
- **Wie sieht die Kommunikation zwischen diesen Teilen aus?**  
    Die Verbindung unter den Komponenten wird mit einer API stattfinden. Durch den simplen MVP sind keine ausgefallenen technischen Lösungen nötig. Die Komponenten sind dabei in einzelnen Containern eingesetzt, um das Deployment und die Verbindung unter den Komponenten zu vereinfachen.
- **Welches sind die kritischen Bestandteile der Architektur?**  
    Durch das MVP-Design sind die hier gezeigten Komponenten die minimale Architektur, mit der die Applikation funktionieren kann. Kritisch ist dabei die persistente Datenspeicherung in der Datenbank und die Verbindung dieser zur Oberfläche durch APIs.

**Bis hierhin waren alle Überlegungen nicht-technisch.**

## 7) Stack
- **Welche Tools können für welchen Teil der Architektur verwendet werden: Frontend: React,...?**  
    Aus persönlicher Neugier entschied sich das Entwicklerteam für: React im Frontend, Django im Backend und MongoDB als Datenbank.  
    - **React:** Da es erlaubt, die Anwendung als Single-Page Application zu bauen.  
    - **Django:** Da Python eine vertraute Umgebung ist und Django es erlaubt, von jeder Komponente aus Calls abzusetzen.   
    - **MongoDB:** Da für die Entwicklung eines MVP das leichte Aufsetzen einer Dokumenten-Datenbank ein Vorteil ist. Des Weiteren sind die behandelten Daten, wie aus 2. ersichtlich, nicht sehr komplex, was eine relationale Datenbank nicht zwingend nötig macht.
- **Wie arbeiten die einzelnen Tools zusammen?**
- **Wie kann die Anwendung deployed werden?**  
    
Nach der Festlegung der Anwendungsfälle, Funktionen, Skalierung, Navigation und der generellen Struktur, die alle zur Anforderungsanalyse gehören, können nun die Tools für die Anforderungen ausgesucht werden. 

## 8) Einstieg in die Entwicklung
- Anlegen der Ordnerstruktur
- Festlegen von Entwicklungsmaximen: KISS, CSS-Formatierung, Clean Code, ...
- Aufsetzen der Datenstruktur / Zuerst die kritischsten Elemente

## 9) Iterative Weiterentwicklung
Nach der Implementierung des MVP und dessen Deployment können weitere Features aus dem Backlog hinzugefügt werden, welche in 4. gestrichen wurden.