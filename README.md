# ⛽ Station Service — Frontend

Application web Angular pour la gestion de stations-service, construite avec Angular 21, NgRx et TailwindCSS.

## 🏗️ Stack Technologique

| Technologie | Version | Rôle |
|---|---|---|
| Angular | 21 | Framework frontend |
| NgRx | 21 | State management |
| TailwindCSS | 4 | Styling |
| FontAwesome | 7 | Icônes |
| Leaflet | 1.9 | Carte géographique |
| SweetAlert2 | 11 | Alertes et confirmations |

## 📋 Pré-requis

- Node.js 20+
- npm 11+
- Backend Spring Boot en cours d'exécution sur `http://localhost:8080`

## 🚀 Installation & Démarrage

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd station-service

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
# → http://localhost:4200
```

## 🏗️ Build de Production

```bash
npm run build
# Les fichiers seront générés dans dist/station-service/browser/
```

## 🐳 Docker

```bash
# Construire l'image Docker
docker build -t station-service-front .

# Lancer le conteneur
docker run -p 80:80 station-service-front
# → http://localhost
```

## 📁 Structure du Projet

```
src/app/
├── core/
│   ├── guards/        # authGuard, loginRedirectGuard
│   ├── services/      # Services HTTP (API calls)
│   └── interceptors/  # JWT token interceptor
├── features/
│   ├── admin/         # Pages admin (dashboard, stations, pompes...)
│   ├── employe/       # Pages employé
│   ├── client/        # Pages client
│   └── auth/          # Login / Register
└── shared/
    └── components/    # Composants partagés (navbar, sidebar, layout)
```

## 🔐 Accès par Rôle

| Rôle | Chemin | Description |
|---|---|---|
| `ROLE_ADMIN` | `/admin/**` | Gestion complète |
| `ROLE_EMPLOYE` | `/employe/**` | Ventes et pompes de sa station |
| `ROLE_CLIENT` | `/client/**` | Historique et profil personnel |

## 📡 Configuration de l'API

Le fichier de configuration de l'API se trouve dans `src/app/core/services/`. L'URL de base du backend est configurée dans les services Angular.

## 🗺️ Pages Principales

### Admin
- `/admin/dashboard` — Statistiques et métriques globales
- `/admin/stations` — Gestion des stations
- `/admin/pompes` — Gestion des pompes
- `/admin/clients` — Gestion des clients
- `/admin/employes` — Gestion des employés
- `/admin/ventes` — Historique des ventes
- `/admin/approvisionnements` — Historique des approvisionnements
- `/admin/journal-audit` — Journal d'audit

### Employé
- `/employe/station` — Détails de sa station
- `/employe/ventes` — Ventes de sa station
- `/employe/badge-sell` — Vente via badge RFID

### Client
- `/client` — Tableau de bord (solde)
- `/client/historique` — Historique des achats
- `/client/profil` — Profil et badge RFID
