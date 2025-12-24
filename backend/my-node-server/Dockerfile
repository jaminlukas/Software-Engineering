# Dockerfile für den Node.js-Backend-Server

# Phase 1: Basis-Setup
# Wir verwenden ein offizielles Node.js-Image. 'alpine' sorgt für eine kleine Image-Größe.
FROM node:18-alpine

# Setze das Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# Kopiere package.json und package-lock.json, um Abhängigkeiten zu installieren.
# Dieser Schritt wird nur dann erneut ausgeführt, wenn sich diese Dateien ändern,
# was den Docker-Cache optimal nutzt.
COPY package*.json ./

# Installiere NUR die Produktions-Abhängigkeiten. Dev-Dependencies wie nodemon werden übersprungen.
RUN npm install --only=production

# Kopiere den restlichen Quellcode der Anwendung
COPY . .

# Exponiere den Port, auf dem der Server lauscht (Standard: 3000)
EXPOSE 3000

# Definiere den Befehl zum Starten der Anwendung.
# Dies entspricht dem "npm start"-Skript.
CMD [ "node", "server.js" ]
