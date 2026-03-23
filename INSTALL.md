# 🚀 Installation - Projet Woli (Delivery App)

## Prérequis
- Node.js 20.x LTS
- MySQL 8.0+ (votre WAMP64)
- Git

---

## 1. STRUCTURE DU PROJET

```
woli-delivery/
├── backend/          # API Node.js + Express
├── frontend-admin/   # Admin React + MUI
└── frontend-client/  # App client (optionnel)
```

---

## 2. BACKEND - Installation

```bash
# Créer le dossier backend
mkdir backend && cd backend

# Initialiser le projet
npm init -y

# Installer les dépendances principales
npm install express cors helmet dotenv jsonwebtoken bcryptjs mysql2 socket.io zod winston swagger-ui-express multer

# Installer les dépendances de développement
npm install -D nodemon typescript @types/node @types/express @types/cors @types/jsonwebtoken @types/bcryptjs ts-node

# Créer le fichier tsconfig.json
npx tsc --init
```

### Structure du backend :
```
backend/
├── src/
│   ├── config/         # Database, env
│   ├── controllers/    # Logique métier
│   ├── middlewares/    # Auth, RBAC, validation
│   ├── routes/         # Routes API
│   ├── services/       # Services (socket, etc.)
│   ├── utils/         # Helpers
│   └── index.ts       # Point d'entrée
├── uploads/            # Images, fichiers
├── .env               # Variables d'environnement
├── package.json
└── tsconfig.json
```

### Variables d'environnement (.env) :
```env
PORT=3000
NODE_ENV=development

# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=db_resto

# JWT
JWT_SECRET=votre_secret_super_secure_123
JWT_REFRESH_SECRET=votre_refresh_secret

# Socket.io
CORS_ORIGIN=http://localhost:5173
```

---

## 3. FRONTEND ADMIN - Installation (CARPATIN TEMPLATE)

```bash
# Copier le template Carpatin dans le projet
cp -r carpatin-dashboard-free-1.0.0 frontend-admin
cd frontend-admin

# Installer les dépendances
npm install

# Installer les libs additionnelles nécessaires
npm install axios zustand react-hook-form @hookform/resolvers zod sonner socket.io-client jwt-decode

# Installer MUI X DataGrid pour les tableaux avancés
npm install @mui/x-data-grid

# Lancer le serveur de développement
npm run dev
```

> **Note** : Le template Carpatin utilise déjà MUI 5, ApexCharts, Formik, Yup, React Router 6.

---

## 4. DÉPENDANCES PRINCIPALES (Résumé)

### Backend
| Package | Version | Usage |
|---------|---------|-------|
| express | ^4.18 | Framework API |
| mysql2 | ^3.x | Connexion MySQL |
| jsonwebtoken | ^9.x | Auth JWT |
| bcryptjs | ^2.x | Hash mots de passe |
| socket.io | ^4.x | Temps réel |
| zod | ^3.x | Validation |
| helmet | ^7.x | Sécurité headers |
| cors | ^2.x | Cross-origin |
| winston | ^3.x | Logs |

### Frontend (Carpatin Template)
| Package | Version | Usage |
|---------|---------|-------|
| react | 18.2 | Framework UI |
| @mui/material | 5.14 | Composants UI (inclus) |
| @mui/lab | 5.0 | Composants labo MUI |
| apexcharts | 3.44 | Graphiques (inclus) |
| react-apexcharts | 1.4 | Wrapper ApexCharts |
| formik | 2.4 | Formulaires (inclus) |
| yup | 1.3 | Validation (inclus) |
| @heroicons/react | 2.0 | Icônes (inclus) |
| react-router-dom | 6.20 | Routing (inclus) |
| **axios** | - | À ajouter pour API |
| **zustand** | - | State management |
| **socket.io-client** | - | Temps réel |

---

## 5. COMMANDES UTILES

```bash
# Backend
cd backend
npm run dev          # Démarrer en mode développement (nodemon)
npm run build        # Compiler TypeScript

# Frontend
cd frontend-admin
npm run dev          # Démarrer Vite (http://localhost:5173)
npm run build        # Build production
npm run preview      # Preview build
```

---

## 6. SÉCURITÉ - Checklist

- [ ] Changer les secrets JWT dans .env
- [ ] Configurer CORS pour votre domaine
- [ ] Activer HTTPS en production
- [ ] Rate limiting activé
- [ ] Validation Zod sur toutes les entrées
- [ ] Passwords hashés avec bcrypt
- [ ] Tokens avec expiration courte (15min)

---

## 7. PROCHAINES ÉTAPES

1. Créer la structure du backend
2. Configurer la connexion MySQL avec mysql2
3. Créer les routes API principales
4. Implémenter l'authentification JWT
5. Créer le frontend React avec MUI
6. Connecter frontend ↔ backend
7. Ajouter Socket.io pour le temps réel

---

## 8. PERSONNALISATION CARPATIN POUR WOLI

Le template Carpatin contient déjà :
- ✅ Dashboard avec graphiques
- ✅ Orders (commandes)
- ✅ Settings (paramètres)
- ✅ Layout avec sidebar, header
- ✅ Theme MUI complet

### Pages à ajouter pour Woli :

| Page | Fichier à créer | Description |
|------|-----------------|-------------|
| Restaurants | `pages/restaurants.jsx` | Liste des restaurants |
| Products | `pages/products.jsx` | Gestion produits |
| Categories | `pages/categories.jsx` | Catégories menu |
| Deliveries | `pages/deliveries.jsx` | Suivi livraisons |
| Drivers | `pages/drivers.jsx` | Gestion livreurs |
| Wallet | `pages/wallet.jsx` | Portefeuille livreurs |
| Analytics | `pages/analytics.jsx` | Rapports stats |
| Users | `pages/users.jsx` | Gestion utilisateurs |
| Roles | `pages/roles.jsx` | Rôles & permissions |

### Intégration avec le backend :

1. Créer un dossier `src/services/`
2. Ajouter `api.js` avec Axios
3. Créer les services : `authService.js`, `restaurantService.js`, etc.

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor pour le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

### Structure finale recommandée :

```
frontend-admin/src/
├── components/      # Composants partagés
├── layouts/         # Layouts (DashboardLayout)
├── pages/           # Pages (Dashboard, Orders, Restaurants, etc.)
├── sections/        # Sections (Header, Sidebar)
├── services/        # API calls (api.js, authService.js)
├── store/           # Zustand stores
├── theme/           # Theme MUI
└── utils/          # Helpers
```

---

*Généré pour Woli - Application de livraison*
