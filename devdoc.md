## Verbindung herstellen
1. Installation von mongodb für vscode
2. Host ist: Localhost:27017
3. Authentifizierung username und pw angeben

## Compose ausführen
Das Docker compose hat bereits alle schritte zum korrekten starten des DB container. Ausgeführt werden kann es durch:
1. Navigiere in das verzeichnis in dem docker-compose.yml liegt
2. ausführen: docker compose up -d

Mongodb läuft nun als im container software engineering als lokale datenbank. 

## Manuelles Container Aufsetzen
>Voraussetzungen: Docker desktop installiert

1. öffnen einer neuen Bash comando zeile

2. folgendne command ausführen:
 docker run -d --name mongo-ticket-local  -e MONGO_INITDB_ROOT_USERNAME=mongoadmin  -e MONGO_INITDB_ROOT_PASSWORD=Franki  -p 27017:27017 -v mongoticket:/data/db  mongo:7.0

Docker Container names: mongo-ticket
name: mongoadmin
pw: Franki
volumen (lokaler speicher für die Daten): mongoticket unter path data/db

> Falls was schief geht einfach Container löschen und von vorne angagen

## Quelle
https://gist.github.com/ScriptBytes/2c0b8658fe6e16467f697f76be06f7bd