# Dashboard IoT — Frontend

![image.png](GUIDE_UTILISATEUR/Guide%20Utilisateur%20-%20Plateforme%20IoT%20Chaumont-sur-Lo/image%204.png)

Application web (React / Vite) servant de tableau de bord et de vitrine pour la plateforme IoT de l'aire de repos de **Chaumont-sur-Loire**.  
Elle affiche les données des capteurs, gère les utilisateurs et les permissions, et propose un questionnaire de satisfaction.

---

## Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Lancement](#lancement)
- [Build de production](#build-de-production)
- [Linting](#linting)
- [Structure du projet](#structure-du-projet)
- [Pages de l'application](#pages-de-lapplication)
- [Stack technique](#stack-technique)

---

## Prérequis

| Outil   | Version recommandée |
| ------- | ------------------- |
| Node.js | ≥ 18                |
| npm     | ≥ 9                 |

> **Note** : L'API backend (`IOT-api`) doit être lancée pour que l'application fonctionne.

---

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/itzcxms/IOT-Dashboard
cd dashboard-iot

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement
cp .env.example .env
# Puis renseigner les valeurs (voir section suivante)
```

---

## Variables d'environnement

Créer un fichier `.env` à la racine à partir de `.env.example` :

| Variable           | Description                                | Exemple                                   |
| ------------------ | ------------------------------------------ | ----------------------------------------- |
| `VITE_API_URL`     | URL de l'API backend (production)          | `https://g3-back.agitys.centreia.fr:1443` |
| `VITE_API_URL_LOC` | URL de l'API backend (développement local) | `http://localhost:3005`                   |

---

## Lancement

```bash
# Mode développement (HMR activé)
npm run dev
```

L'application sera accessible sur `http://localhost:5173` (port par défaut Vite).

---

## Build de production

```bash
# Générer le build optimisé
npm run build

# Prévisualiser le build
npm run preview
```

Les fichiers sont générés dans le dossier `dist/`.

---

## Linting

Le projet utilise **ESLint** avec les plugins React :

```bash
npm run lint
```

---

## Structure du projet

```
dashboard-iot/
├── public/                 # Assets statiques
├── src/
│   ├── assets/             # Images et ressources
│   ├── components/
│   │   ├── common/         # Composants métier (Graphs, Permissions, Sidebar…)
│   │   ├── decouverte/     # Composants de la page Découverte
│   │   ├── security/       # Composants de contrôle d'accès (ProtectedRoute, CanAccess)
│   │   ├── ui/             # Composants UI réutilisables (shadcn/ui)
│   │   └── users/          # Composants de gestion utilisateurs
│   ├── context/            # Contexts React (Auth, Permissions, Thème)
│   ├── functions/          # Utilitaires (appels API)
│   ├── hooks/              # Hooks personnalisés
│   ├── layouts/            # Layouts (Public, Dashboard)
│   ├── lib/                # Utilitaires (cn)
│   ├── pages/              # Pages de l'application
│   ├── styles/             # Feuilles de style CSS
│   ├── utils/              # Utilitaires divers
│   └── main.jsx            # Point d'entrée + routage
├── .env.example            # Template des variables d'environnement
├── eslint.config.js        # Configuration ESLint
├── vite.config.js          # Configuration Vite
├── components.json         # Configuration shadcn/ui
└── package.json
```

---

## Pages de l'application

### Pages publiques

| Route                  | Page                | Description                              |
| ---------------------- | ------------------- | ---------------------------------------- |
| `/`                    | Découverte          | Carte interactive de l'aire de repos     |
| `/connexion`           | Login               | Page de connexion                        |
| `/mot-de-passe-oublie` | Mot de passe oublié | Réinitialisation du mot de passe         |
| `/chaumont`            | Landing Page        | Page vitrine de Chaumont-sur-Loire       |
| `/satisfaction`        | Questionnaire       | Formulaire de satisfaction visiteurs     |
| `/compte-inactif`      | Compte inactif      | Page affichée si le compte est désactivé |

### Pages privées (authentification requise)

| Route                       | Page                 | Description                                 |
| --------------------------- | -------------------- | ------------------------------------------- |
| `/dashboard`                | Tableau de bord      | Vue d'ensemble (météo, capteurs, remarques) |
| `/gestion-de-l-aire`        | Gestion de l'aire    | Graphiques détaillés des capteurs           |
| `/savon`                    | Savon                | Surveillance des distributeurs de savon     |
| `/zone-inondable`           | Zone inondable       | Monitoring de la zone inondable             |
| `/compte/details`           | Détails du compte    | Profil utilisateur                          |
| `/admin/liste-utilisateurs` | Gestion utilisateurs | CRUD utilisateurs (admin)                   |
| `/admin/permissions`        | Gestion permissions  | Configuration des permissions (admin)       |
| `/analyse-satisfaction`     | Analyse satisfaction | Graphiques des résultats du questionnaire   |

---

## Stack technique

- **Build** : Vite 7
- **UI** : React 18 + React Router 7
- **Styling** : TailwindCSS 4 + shadcn/ui (Radix UI)
- **Graphiques** : Recharts
- **Formulaires** : React Hook Form + Zod
- **Auth** : JWT (jwt-decode)
- **Icônes** : Lucide React
