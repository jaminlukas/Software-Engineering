

# MERN-Stack: Lokale Automatisch Start-Anleitung

> **Vorrausetzungen:** Docker Desktop ist instaliert und gestartet.
 
## Ausführen der Anwendung
Das Docker compose hat bereits alle schritte zum korrekten starten des DB container. Ausgeführt werden kann es durch:
1. Navigiere in einer Komandozeile in das Root-Verzeichnis in dem docker-compose.yml liegt
2. Bei erstmaliger Aufruf der Anwendung:
    ```bash
    docker compose up --build -d 
    ```
    in der Komandozeile ausführen.  
    Ansonsten verwenden von
    ```bash
    docker compose up -d
    ```

<!-- ## Manuelles Aufsetzen des MongoDB container

>Voraussetzungen: Docker desktop installiert

1. öffnen einer neuen Bash comando zeile

2. folgendne command ausführen:
 docker run -d --name mongo-ticket-local  -e MONGO_INITDB_ROOT_USERNAME=mongoadmin  -e MONGO_INITDB_ROOT_PASSWORD=Franki  -p 27017:27017 -v mongoticket:/data/db  mongo:7.0

Docker Container names: mongo-ticket
name: mongoadmin
pw: Franki
volumen (lokaler speicher für die Daten): mongoticket unter path data/db

> Falls was schief geht einfach Container löschen und von vorne angagen
-->

# MERN-Stack: Lokale Manuelle Start-Anleitung

Anleitung für den Start des Stacks mit containerisierter MongoDB und lokal laufendem Backend (Express) und Frontend (React/Vite).

Der Start erfordert **drei separate Terminals**.

---

## 1. Terminal: Datenbank (MongoDB)

Startet den MongoDB-Container im Hintergrund.

* **Verzeichnis:** Projekt-Root
* **Befehl:**
    ```bash
    docker-compose up -d
    ```

---

## 2. Terminal: Backend (Express)

Startet den Express-Server. Dieser muss nach der Datenbank gestartet werden, um die Verbindung herstellen zu können.

* **Verzeichnis:** `./backend/my-node-server`
* **Befehl:**
    ```bash
    npm start
    ```
    *(Falls `nodemon` konfiguriert ist, stattdessen `npm run dev` verwenden.)*

**Wichtiger Hinweis:** Der Mongoose-Connection-String in der Express-Konfiguration muss auf den gemappten Host-Port zeigen (z. B. `mongodb://127.0.0.1:27017/deineDatenbank`), *nicht* auf den internen Docker-Service-Namen.

---

## 3. Terminal: Frontend (React + Vite)

Startet den Vite-Entwicklungsserver für das React-Frontend.

* **Verzeichnis:** `./frontend/my-react-app`
* **Befehl:**
    ```bash
    npm run dev
    ```

Der Server ist unter unter `http://localhost:5173` erreichbar.

## Quelle
https://gist.github.com/ScriptBytes/2c0b8658fe6e16467f697f76be06f7bd