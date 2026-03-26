# IOT Dashboard — Aire de repos de Chaumont-sur-Loire

Plateforme IoT de monitoring et de découverte pour l'aire de repos de Chaumont-sur-Loire.  
Développée dans le cadre du projet chef-d'œuvre DWWM — La Fabrique Numérique 41.

---

## Stack technique

- **Front** : React, Vite, TailwindCSS, shadcn/ui
- **Back** : Node.js, Express
- **Base de données** : MongoDB / Mongoose
- **Protocole capteurs** : MQTT
- **Auth** : JWT + bcrypt
- **Conteneurisation** : Docker / Docker Compose

---

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) et Docker Compose (pour le déploiement conteneurisé)
- [Git](https://git-scm.com/)

---

## Installation manuelle (sans Docker)

```bash
# 1. Cloner le dépôt
git clone https://github.com/itzcxms/IOT-Dashboard
cd dashboard-iot

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement
cp .env.example .env
# Puis renseigner les valeurs (voir section suivante)

# 4. Lancer le projet
npm run dev
```

---

## Déploiement avec Docker

```bash
# 1. Cloner le dépôt
git clone https://github.com/itzcxms/IOT-Dashboard
cd dashboard-iot

# 2. Copier le fichier d'environnement
cp .env.example .env
# Puis renseigner les valeurs (voir section suivante)

# 3. Construire et lancer les conteneurs
docker compose up --build

# Pour lancer en arrière-plan
docker compose up --build -d

# Pour arrêter les conteneurs
docker compose down
```

Une fois lancé :

| Service    | URL                          |
|------------|------------------------------|
| Frontend   | http://localhost:5173        |
| Backend    | http://localhost:3000        |
| MongoDB    | mongodb://localhost:27017    |

---

## Variables d'environnement

Copier `.env.example` en `.env` et renseigner les valeurs suivantes :

```env
# Base de données
MONGO_URI=mongodb://localhost:27017/iot-dashboard

# Authentification
JWT_SECRET=votre_clé_secrète
TOKEN_EXPIRY=15m

# API (utilisé par le front)
VITE_API_URL=http://localhost:3000
```

> ⚠️ Le fichier `.env` ne doit jamais être versionné. Il est listé dans le `.gitignore`.  
> Le fichier `.env.example` sert de référence et est versionné sans valeurs sensibles.

---

## Structure du projet

```
dashboard-iot/
├── frontend/          # Application React (Vite)
├── backend/           # API REST Node.js / Express
├── docker-compose.yml # Orchestration des services
├── .env.example       # Modèle de configuration
└── README.md
```

---

## Services Docker

Le fichier `docker-compose.yml` orchestre 3 services :

| Service    | Image           | Port exposé |
|------------|-----------------|-------------|
| frontend   | node:18 + Vite  | 5173        |
| backend    | node:18         | 3000        |
| mongodb    | mongo:7         | 27017       |

---

## Équipe

| Membre  | Rôle     |
|---------|----------|
| Cameron | Front-end |
| Sacha   | Back-end  |
| Steven  | API       |

---

*Projet réalisé dans le cadre de la formation DWWM Niveau 5 — La Fabrique Numérique 41 / CCI Campus Centre — Mars 2026*
