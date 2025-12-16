# Dockerfile für die React-Anwendung (Vite)

# Phase 1: Build-Stage
# Wir verwenden ein Node.js-Image, um die React-Anwendung zu bauen.
# 'alpine' sorgt für ein möglichst kleines Image.
FROM node:18-alpine AS builder

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere package.json und package-lock.json, um Abhängigkeiten zu installieren.
# Dieser Schritt wird nur dann erneut ausgeführt, wenn sich diese Dateien ändern,
# was den Docker-Cache optimal nutzt.
COPY package*.json ./

# Installiere die Projekt-Abhängigkeiten
RUN npm install

# Kopiere den gesamten restlichen Quellcode in das Arbeitsverzeichnis
COPY . .

# Erstelle die statischen Dateien für die Produktion im /app/dist-Ordner
RUN npm run build

# ---

# Phase 2: Produktions-Laufzeit-Stage
# Wir verwenden ein superleichtes Nginx-Image, um die statischen Dateien zu servieren.
FROM nginx:alpine

# Kopiere die vorbereitete Nginx-Konfiguration. Diese Konfiguration
# ist für Single-Page-Applications (SPA) optimiert und leitet alle Anfragen
# auf die index.html um, damit das client-seitige Routing funktioniert.
# Sie ist bereits so eingestellt, dass sie auf Port 5173 lauscht.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiere die gebuildeten, statischen Dateien aus der 'builder'-Phase (aus dem /app/dist Ordner)
# in das Standard-Webverzeichnis von Nginx.
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponiere den Port, auf dem Nginx lauschen wird (gemäß nginx.conf).
# Dies ist der Port, den der Container nach außen verfügbar macht.
EXPOSE 5173

# Der Standardbefehl des nginx:alpine-Images startet den Server im Vordergrund.
# CMD ["nginx", "-g", "daemon off;"]
# Dieser Befehl muss nicht explizit angegeben werden, da er bereits die Standardeinstellung ist.
