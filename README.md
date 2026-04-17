# TankCheck

**Finde die guenstigste Tankstelle in deiner Naehe -- in Echtzeit.**

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D20-green)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)

---

## Features

- **Tankstellensuche** -- Tankstellen im Umkreis nach Standort finden
- **Preisvergleich** -- Aktuelle Spritpreise (E5, E10, Diesel) auf einen Blick
- **Kartenansicht** -- Interaktive Karte mit allen Tankstellen in der Naehe
- **Favoriten** -- Lieblings-Tankstellen speichern und schnell abrufen
- **Preisalarme** -- Benachrichtigungen bei Preisaenderungen konfigurieren
- **PWA / Offline** -- Als App installierbar, funktioniert auch ohne Netz
- **DSGVO-konform** -- Keine Cookies, kein Tracking, Standort nur mit Einwilligung

---

## Tech Stack

| Frontend | Backend | Karten | Caching | Container |
|---|---|---|---|---|
| Next.js 14 | NestJS 10 | Leaflet / react-leaflet | Redis 7 | Docker / Podman |
| React 18 | Axios | OpenStreetMap | cache-manager | docker-compose |
| TailwindCSS 3 | class-validator | | cache-manager-redis-yet | |
| TypeScript 5 | ConfigService | | | |
| Playwright (E2E) | Jest (Unit) | | | |

---

## Schnellstart

### Voraussetzungen

- **Node.js 20+** und **npm**
- **Optional:** Podman oder Docker + Redis (fuer produktionsnahes Caching)

### 1. Repository klonen

```bash
git clone <repo-url>
cd tankcheck
```

### 2. Umgebungsvariablen einrichten

```bash
cp .env.example .env
```

Trage deinen **Tankerkoenig-API-Key** in die `.env`-Datei ein.
Einen kostenlosen API-Key erhaeltst du unter:
[https://creativecommons.tankerkoenig.de](https://creativecommons.tankerkoenig.de)

### 3. Abhaengigkeiten installieren

```bash
npm install
```

Das Root-Projekt nutzt npm Workspaces -- alle Abhaengigkeiten (Frontend, Backend, Shared) werden automatisch installiert.

### 4. Redis starten

**Via Podman/Docker (empfohlen):**

```bash
podman run -d -p 6379:6379 redis:7-alpine
```

Oder mit Docker:

```bash
docker run -d -p 6379:6379 redis:7-alpine
```

**Alternativ:** Redis lokal installieren und starten.

### 5. Backend starten

```bash
npm run dev:backend
```

Das Backend laeuft auf [http://localhost:3001](http://localhost:3001).

### 6. Frontend starten

```bash
npm run dev:frontend
```

### 7. App oeffnen

Oeffne [http://localhost:3000](http://localhost:3000) im Browser.

---

## Mit Docker/Podman starten

Fuer einen vollstaendigen Start aller Services mit einem Befehl:

```bash
cp .env.example .env
# API-Key in .env eintragen
```

**Mit Docker Compose:**

```bash
docker compose up --build
```

**Mit Podman Compose:**

```bash
podman-compose up --build
```

### Services

| Service | Port | Beschreibung |
|---|---|---|
| Frontend | `3000` | Next.js-App (UI) |
| Backend | `3001` | NestJS-API |
| Redis | `6379` | Caching (LRU, max 128 MB) |

---

## Projektstruktur

```
tankcheck/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── main.ts                 # Einstiegspunkt
│       ├── app.module.ts           # Root-Modul
│       ├── common/                 # Filter, Guards, Pipes
│       ├── config/                 # Konfiguration (env)
│       ├── health/                 # Health-Check-Endpunkt
│       ├── prices/                 # Preis-Modul
│       ├── stations/               # Tankstellen-Modul
│       └── tankerkoenig/           # Tankerkoenig-API-Client
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app/                    # Next.js App Router (Seiten)
│       │   ├── page.tsx            # Startseite (Suche)
│       │   ├── station/[id]/       # Tankstellen-Detail
│       │   ├── favorites/          # Favoriten-Seite
│       │   ├── alerts/             # Preisalarme-Seite
│       │   └── settings/           # Einstellungen
│       ├── components/             # React-Komponenten
│       │   ├── alerts/             # Alarm-Komponenten
│       │   ├── consent/            # DSGVO-Einwilligung
│       │   ├── favorites/          # Favoriten-Komponenten
│       │   ├── layout/             # Navigation (BottomNav)
│       │   ├── map/                # Kartenansicht (Leaflet)
│       │   ├── pwa/                # PWA-Installationsprompt
│       │   ├── stations/           # Tankstellen-Listen/Karten
│       │   └── ui/                 # Basis-UI-Komponenten
│       ├── hooks/                  # Custom React Hooks
│       └── lib/                    # Hilfsfunktionen, API-Client
├── packages/
│   └── shared/                     # Geteilte Types & Konstanten
│       └── src/
│           ├── types/              # Station, Alert, Search, API
│           └── constants/          # Kraftstoffarten, Sortierung
├── docker-compose.yml
├── package.json                    # Root (npm Workspaces)
├── tsconfig.base.json
├── .env.example
└── .gitignore
```

---

## API Endpoints

Alle Endpunkte sind unter dem Prefix `/api` erreichbar.

| Methode | Pfad | Parameter | Beschreibung |
|---|---|---|---|
| `GET` | `/api/stations/search` | `lat`, `lng`, `rad`, `type`, `sort` | Tankstellen im Umkreis suchen |
| `GET` | `/api/stations/:id` | `:id` (Stations-UUID) | Detail einer Tankstelle |
| `GET` | `/api/prices` | `ids` (kommagetrennte UUIDs) | Preise fuer mehrere Stationen |
| `GET` | `/api/health` | -- | Health-Check des Backends |

### Beispiel

```bash
curl "http://localhost:3001/api/stations/search?lat=52.5200&lng=13.4050&rad=5&type=e5&sort=price"
```

---

## Entwicklung / Contributing

### Branch-Strategie

- Feature-Branches: `feature/*`
- Bugfixes: `fix/*`
- Pull Requests gegen `main`

### Tests ausfuehren

```bash
# Backend Unit Tests
npm test

# Frontend E2E
cd frontend && npx playwright test
```

### Code-Style

- **TypeScript** im `strict`-Modus
- **TailwindCSS** fuer Styling
- **Mobile-first** Design
- ESLint-Konfiguration via `next lint`

### Commit-Messages

Wir verwenden [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Tankstellen-Kartenansicht hinzugefuegt
fix: Preisanzeige bei fehlenden Daten korrigiert
test: E2E-Tests fuer Favoritenseite ergaenzt
docs: README aktualisiert
```

---

## Tests

### Backend Unit Tests

```bash
cd backend && npm test
```

Die Tests nutzen **Jest** und liegen als `*.spec.ts`-Dateien neben den Modulen in `backend/src/`.

### Frontend E2E Tests

```bash
cd frontend && npx playwright test
```

Playwright benoetigt Chromium. Falls noch nicht installiert:

```bash
npx playwright install chromium
```

---

## Umgebungsvariablen

Die Datei `.env.example` enthaelt alle konfigurierbaren Variablen:

| Variable | Pflicht | Standardwert | Beschreibung |
|---|---|---|---|
| `TANKERKOENIG_API_KEY` | Ja | -- | API-Key von [tankerkoenig.de](https://creativecommons.tankerkoenig.de) |
| `BACKEND_PORT` | Nein | `3001` | Port des Backend-Servers |
| `NODE_ENV` | Nein | `development` | Umgebung (`development` / `production`) |
| `REDIS_URL` | Nein | `redis://localhost:6379` | Redis-Verbindungs-URL |
| `NEXT_PUBLIC_API_URL` | Nein | `http://localhost:3001` | Backend-URL fuer das Frontend |

---

## DSGVO / Datenschutz

TankCheck wurde mit Datenschutz als Grundprinzip entwickelt:

- **Keine Cookies** -- Es werden keine Cookies gesetzt.
- **Kein Tracking** -- Keine Analyse-Tools, keine externen Tracker.
- **Standort nur mit Einwilligung** -- Die Geolocation-API wird erst nach expliziter Zustimmung des Nutzers verwendet (siehe `GeolocationConsent`-Komponente).
- **Daten bleiben lokal** -- Favoriten und Preisalarme werden ausschliesslich im Browser (localStorage) gespeichert. Es werden keine personenbezogenen Daten an den Server uebertragen.

---

## Lizenz und Attribution

- **Preisdaten:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) -- [tankerkoenig.de](https://creativecommons.tankerkoenig.de)
- **Kartendaten:** (c) [OpenStreetMap](https://www.openstreetmap.org/copyright)-Mitwirkende
- **Kartenbibliothek:** [Leaflet](https://leafletjs.com/)

Dieses Projekt nutzt Preisdaten der Markttransparenzstelle fuer Kraftstoffe (MTS-K),
bereitgestellt ueber die Tankerkoenig-API unter der
[Creative Commons Attribution 4.0 International Lizenz (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
