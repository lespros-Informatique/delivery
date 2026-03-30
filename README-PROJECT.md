# 🚀 Guide Complet du Projet Delivery - Pour Débutant

## 🎯 Introduction

Ce projet est une **application de livraison de nourriture** (comme Uber Eats ou Deliveroo) qui comprend deux parties:

1. **Frontend** (React) - Ce que l'utilisateur voit sur son écran
2. **Backend** (Node.js/Fastify) - La cuisine où on traite les données

---

## 🏗️ Architecture Globale

```
┌─────────────────────────────────────────────────────────────────┐
│                        VOTRE NAVIGATEUR                          │
│                    (Chrome, Firefox, Safari)                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Pages      │  │  Composants  │  │  API Client  │          │
│  │  (écrans)    │  │ (boutons...) │  │ (téléphone)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                │ HTTP (requête)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js + Fastify)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Routes     │  │  Middleware  │  │   Services   │          │
│  │  (guichet)   │  │ (vigile)     │  │ (travailleur)│          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                                        │              │
│         └────────────────┬───────────────────────┘              │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              BASE DE DONNÉES (MySQL + Prisma)             │   │
│  │                    (grosse armoire)                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Structure des Dossiers

```
delivery/
├── src/                          📦 Frontend (React)
│   ├── lib/api/                  📞 Services API (communication avec le backend)
│   │   ├── client.ts             Le téléphone qui appelle le backend
│   │   ├── users.ts              Fonction pour les utilisateurs
│   │   ├── restaurants.ts        Fonction pour les restaurants
│   │   ├── clients.ts            Fonction pour les clients
│   │   ├── livreurs.ts           Fonction pour les livreurs
│   │   └── mapper.ts             Traducteur (snake_case → camelCase)
│   │
│   ├── pages/                    📱 Les écrans de l'application
│   │   ├── dashboard.tsx         Page d'accueil (tableau de bord)
│   │   ├── users.tsx             Page liste des utilisateurs
│   │   ├── restaurants.tsx        Page liste des restaurants
│   │   ├── orders.tsx            Page liste des commandes
│   │   └── ...                   plein d'autres pages
│   │
│   ├── components/               🧩 Petits éléments réutilisables
│   │   ├── forms/                Formulaires (créer/modifier)
│   │   ├── data-table/           Tableau de données
│   │   ├── modal/                Fenêtres popup
│   │   └── ...
│   │
│   ├── layouts/                  🎨 Structure des pages
│   │   └── dashboard/            Layout avec menu et en-tête
│   │
│   ├── hooks/                    ⚓ Fonctions spéciales React
│   │   └── useAuth.tsx           Gestion de la connexion
│   │
│   ├── theme/                    🎨 Couleurs et styles
│   │
│   ├── routes.tsx               🗺️ Cartographie des URLs
│   └── main.tsx                 🚀 Point d'entrée
│
├── backend/                      ⚙️ Backend (Node.js)
│   ├── src/
│   │   ├── presentation/
│   │   │   ├── routes/           🚪 Les guichets (endpoints API)
│   │   │   │   ├── auth.routes.ts       Connexion/inscription
│   │   │   │   ├── user.routes.ts       Utilisateurs
│   │   │   │   ├── restaurant.routes.ts Restaurants
│   │   │   │   ├── client.routes.ts     Clients
│   │   │   │   ├── livreur.routes.ts   Livreurs
│   │   │   │   ├── commande.routes.ts  Commandes
│   │   │   │   └── ... autres routes
│   │   │   │
│   │   │   └── middleware/       👮 Vérifications de sécurité
│   │   │       ├── authenticate.middleware.ts  Vérifie le token
│   │   │       └── error-handler.ts     Gestion des erreurs
│   │   │
│   │   ├── infrastructure/
│   │   │   └── database/
│   │   │       └── prisma.service.ts  Connexion à la DB
│   │   │
│   │   ├── shared/
│   │   │   ├── constants/        📋 Constantes et configurations
│   │   │   │   ├── tables.ts     Noms des tables/colonnes
│   │   │   │   └── validation-schemas.ts  Règles de validation
│   │   │   │
│   │   │   ├── services/         🛠️ Services génériques
│   │   │   │   └── base-crud.service.ts  CRUD de base
│   │   │   │
│   │   │   └── utils/            🔧 Utilitaires
│   │   │       └── code-generator.util.ts Générateur de codes
│   │   │
│   │   ├── app.ts               ⚙️ Configuration Fastify
│   │   └── index.ts             🚀 Point d'entrée
│   │
│   ├── prisma/
│   │   └── schema.prisma         📐 Plan de la base de données
│   │
│   └── package.json              📦 Dépendances backend
│
└── package.json                  📦 Dépendances frontend
```

---

## 🔄 Comment les Données Circulent

### Exemple: Créer un utilisateur

```
1. L'utilisateurremplit le formulaire sur la page
         │
         ▼
2. Le composant (UserForm) appelle usersService.create()
         │
         ▼
3. Le client API (client.ts) envoie la requête HTTP
   POST /api/v1/users avec les données JSON
         │
         ▼
4. Le serveur reçoit la requête dans user.routes.ts
         │
         ▼
5. Le middleware authenticate vérifie le token
         │
         ▼
6. La route user.routes.ts traite la requête:
   - Valide les données avec Zod
   - Génère un code utilisateur
   - Crée l'utilisateur dans la DB via Prisma
         │
         ▼
7. Le serveur répond avec le nouvel utilisateur
         │
         ▼
8. Le frontend reçoit la réponse et met à jour l'écran
```

---

## 📖 Détails des Principaux Fichiers

### 🖥️ FRONTEND

#### 1. `src/lib/api/client.ts` - Le Téléphone 📞

```typescript
// Ce fichier est comme un téléphone qui appelle le backend
// Il configue comment envoyer et recevoir des données

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api/v1',  // Adresse du backend
  withCredentials: true,  // Permet d'envoyer les cookies
});

// Intercepteur - Avant chaque requête
apiClient.interceptors.request.use((config) => {
  // Ajoute le token si disponible
  const token = localStorage.getItem('woli_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur - Après chaque réponse
apiClient.interceptors.response.use(
  (response) => response,  // OK, on continue
  async (error) => {
    // Si erreur 401 (pas connecté), on essaie de rafraîchir le token
    if (error.response?.status === 401) {
      // ... logique pour rafraîchir le token
    }
    return Promise.reject(error);
  }
);
```

**Rôle**: Gérer toutes les communications HTTP avec le backend

---

#### 2. `src/lib/api/users.ts` - Service Utilisateur 👤

```typescript
// Ce fichier contient toutes les fonctions pour manipuler les utilisateurs

export const usersService = {
  // Récupérer tous les utilisateurs avec pagination
  async getAll(params?: PaginationParams) {
    const response = await apiClient.get(`/users?page=${params?.page}`);
    return response.data;
  },

  // Récupérer un utilisateur par son code
  async getByCode(code: string) {
    const response = await apiClient.get(`/users/${code}`);
    return response.data;
  },

  // Créer un nouvel utilisateur
  async create(data: CreateUserRequest) {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  // Modifier un utilisateur
  async update(codeUser: string, data: UpdateUserRequest) {
    const response = await apiClient.put(`/users/${codeUser}`, data);
    return response.data;
  },

  // Supprimer un utilisateur
  async delete(codeUser: string) {
    const response = await apiClient.delete(`/users/${codeUser}`);
    return response.data;
  },
};
```

**Rôle**: Fournir une interface simple pour les opérations CRUD sur les utilisateurs

---

#### 3. `src/pages/users.tsx` - Page Liste Utilisateurs 📋

```typescript
// Cette page affiche la liste des utilisateurs

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les utilisateurs au démarrage
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const response = await usersService.getAll({ page: 1, limit: 10 });
    setUsers(response.data.data);  // Stocker les données
    setLoading(false);
  };

  // Afficher la page
  return (
    <PageContainer>
      <PageHeader title="Utilisateurs" />

      {/* Tableau des utilisateurs */}
      <DataTable
        data={users}
        columns={columns}
        loading={loading}
        onEdit={(user) => navigate(`/users/${user.codeUser}`)}
        onDelete={(user) => handleDelete(user.codeUser)}
      />

      {/* Bouton pour créer un nouvel utilisateur */}
      <Button onClick={() => navigate('/users/new')}>
        Ajouter un utilisateur
      </Button>
    </PageContainer>
  );
}
```

**Rôle**: Afficher et gérer la liste des utilisateurs

---

#### 4. `src/components/forms/user-form.tsx` - Formulaire Utilisateur 📝

```typescript
// Formulaire pour créer ou modifier un utilisateur

interface UserFormProps {
  initialData?: User;  // Pour la modification
  onSubmit: (data: CreateUserRequest) => void;
}

export default function UserForm({ initialData, onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState({
    nomUser: initialData?.nomUser || '',
    emailUser: initialData?.emailUser || '',
    telephoneUser: initialData?.telephoneUser || '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);  // Envoyer les données
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Nom"
        value={formData.nomUser}
        onChange={(e) => setFormData({...formData, nomUser: e.target.value})}
      />

      <TextField
        label="Email"
        type="email"
        value={formData.emailUser}
        onChange={(e) => setFormData({...formData, emailUser: e.target.value})}
      />

      <TextField
        label="Téléphone"
        value={formData.telephoneUser}
        onChange={(e) => setFormData({...formData, telephoneUser: e.target.value})}
      />

      <Button type="submit">Enregistrer</Button>
    </form>
  );
}
```

**Rôle**: Formulaire pour saisir les informations d'un utilisateur

---

#### 5. `src/routes.tsx` - Cartographie des URLs 🗺️

```typescript
// Ce fichier définit toutes les routes (URLs) de l'application

export const routes: RouteObject[] = [
  // Page de connexion (sans protection)
  {
    path: 'login',
    element: <LoginPage />
  },

  // Pages protégées (avec authentification)
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <PageWrapper />
        </DashboardLayout>
      </ProtectedRoute>
    ),
    children: [
      // Page d'accueil
      { index: true, element: <DashboardPage /> },

      // Pages utilisateurs
      { path: 'users', element: <UsersPage /> },
      { path: 'users/:code', element: <UserDetailPage /> },

      // Pages restaurants
      { path: 'restaurants', element: <RestaurantsPage /> },
      { path: 'restaurants/:code', element: <RestaurantDetailPage /> },

      // ... autres routes
    ]
  },

  // Page 404 (page non trouvée)
  { path: '*', element: <NotFoundPage /> }
];
```

**Rôle**: Définir quelle page afficher pour chaque URL

---

### ⚙️ BACKEND

#### 1. `backend/src/presentation/routes/user.routes.ts` - Route Utilisateur 🚪

```typescript
// Ce fichier définit les endpoints API pour les utilisateurs

export const userRoutes = async (app: FastifyInstance): Promise<void> => {
  
  // GET /api/v1/users - Liste des utilisateurs avec pagination
  app.get('/', { preHandler: [authenticate] }, async (request, reply) => {
    const page = parseInt(request.query.page || '1', 10);
    const limit = parseInt(request.query.limit || '10', 10);
    const search = request.query.search || '';

    // Construire la condition de recherche
    const searchCondition = search
      ? {
          OR: [
            { nom_user: { contains: search } },
            { email_user: { contains: search } },
          ],
        }
      : undefined;

    // Compter le nombre total
    const total = await prisma.users.count({ where: searchCondition });

    // Récupérer les utilisateurs paginés
    const users = await prisma.users.findMany({
      where: searchCondition,
      skip: (page - 1) * limit,
      take: limit,
      select: {  // Sélectionner seulement certains champs
        id_user: true,
        code_user: true,
        nom_user: true,
        email_user: true,
      },
    });

    return reply.send({
      success: true,
      data: {
        users,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      }
    });
  });

  // GET /api/v1/users/:codeUser - Un utilisateur spécifique
  app.get('/:codeUser', { preHandler: [authenticate] }, async (request, reply) => {
    const { codeUser } = request.params as { codeUser: string };
    
    const user = await prisma.users.findUnique({
      where: { code_user: codeUser },
      include: { user_roles: { include: { roles: true } } },
    });

    if (!user) {
      return reply.status(404).send({ success: false, message: 'User not found' });
    }

    return reply.send({ success: true, data: user });
  });

  // POST /api/v1/users - Créer un utilisateur
  app.post('/', { preHandler: [authenticate] }, async (request, reply) => {
    // Valider les données avec Zod
    const data = createUserSchema.parse(request.body);

    // Vérifier si l'email existe déjà
    const existing = await prisma.users.findUnique({
      where: { email_user: data.emailUser },
    });

    if (existing) {
      return reply.status(400).send({
        success: false,
        message: 'Email already exists',
      });
    }

    // Générer le code utilisateur
    const count = await prisma.users.count();
    const codeUser = `USER_${(count + 1).toString().padStart(4, '0')}`;

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(data.motDePasse, 12);

    // Créer l'utilisateur
    const user = await prisma.users.create({
      data: {
        code_user: codeUser,
        email_user: data.emailUser,
        nom_user: data.nomUser,
        telephone_user: data.telephoneUser || null,
        mot_de_passe: hashedPassword,
      },
    });

    return reply.status(201).send({ success: true, data: user });
  });

  // PUT /api/v1/users/:codeUser - Modifier un utilisateur
  app.put('/:codeUser', { preHandler: [authenticate] }, async (request, reply) => {
    const { codeUser } = request.params as { codeUser: string };
    const data = updateUserSchema.parse(request.body);

    const updateData: Record<string, unknown> = {};
    if (data.nomUser) updateData.nom_user = data.nomUser;
    if (data.telephoneUser) updateData.telephone_user = data.telephoneUser;
    if (data.etatUsers !== undefined) updateData.etat_users = data.etatUsers ? 1 : 0;

    const user = await prisma.users.update({
      where: { code_user: codeUser },
      data: updateData,
    });

    return reply.send({ success: true, data: user });
  });

  // DELETE /api/v1/users/:codeUser - Supprimer un utilisateur
  app.delete('/:codeUser', { preHandler: [authenticate] }, async (request, reply) => {
    const { codeUser } = request.params as { codeUser: string };

    await prisma.users.delete({
      where: { code_user: codeUser },
    });

    return reply.send({ success: true, message: 'User deleted' });
  });
};
```

**Rôle**: Définir les endpoints API pour les opérations CRUD sur les utilisateurs

---

#### 2. `backend/src/presentation/middleware/authenticate.middleware.ts` - Le Vigile 👮

```typescript
// Ce middleware vérifie si l'utilisateur est connecté

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    // Extraire le token des cookies ou du header Authorization
    const cookieToken = request.headers.cookie?.match(/access_token=([^;]+)/)?.[1];
    const authHeader = request.headers.authorization;
    
    let token = cookieToken;
    if (!token && authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Si pas de token, refuse l'accès
    if (!token) {
      return reply.status(401).send({
        success: false,
        message: 'Token d\'authentification manquant',
      });
    }

    // Vérifier le token JWT
    await request.jwtVerify<JwtPayload>();
    
  } catch (error) {
    return reply.status(401).send({
      success: false,
      message: 'Token invalide ou expiré',
    });
  }
};

// Middleware optionnel (ne bloque pas si pas de token)
export const optionalAuth = async (request: FastifyRequest): Promise<void> => {
  try {
    const token = extractToken(request);
    if (token) {
      setAuthHeader(request, token);
      await request.jwtVerify<JwtPayload>();
    }
  } catch {
    // Ignore les erreurs pour l'auth optionnelle
  }
};

// Middleware pour vérifier un rôle spécifique
export const requireRole = (requiredRole: string) => {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user as JwtPayload;
    
    if (!user.roles.includes(requiredRole)) {
      return reply.status(403).send({
        success: false,
        message: 'Accès refusé - Rôle requis',
      });
    }
  };
};
```

**Rôle**: Vérifier l'identité de l'utilisateur avant d'accéder aux routes protégées

---

#### 3. `backend/src/infrastructure/database/prisma.service.ts` - Le Livreur de Données 📦

```typescript
// Ce fichier gère la connexion à la base de données

import { PrismaClient } from '@prisma/client';

// Créer une seule instance de Prisma (singleton)
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],  // Logs des requêtes
});

// Se connecter à la base de données au démarrage
prisma.$connect()
  .then(() => {
    console.log('✅ Connecté à la base de données MySQL');
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion:', error);
  });

// Se déconnecter à l'arrêt
prisma.$on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
```

**Rôle**: Gérer la connexion à la base de données MySQL

---

#### 4. `backend/prisma/schema.prisma` - Le Plan de la Maison 🏠

```prisma
// Ce fichier définit la structure de la base de données

// Modèle pour les utilisateurs
model users {
  id_user         Int       @id @default(autoincrement())
  code_user       String    @unique  // Code unique (USER_0001)
  nom_user        String    // Nom de l'utilisateur
  email_user      String    @unique  // Email unique
  mot_de_passe    String    // Mot de passe hashé
  etat_users      Int?      @default(1)  // 1 = actif, 0 = inactif
  created_at_user DateTime? @default(now())
  
  // Relations
  user_roles      user_roles[]
  restaurants     restaurants[]
  notifications   notifications[]
}

// Modèle pour les restaurants
model restaurants {
  id_restaurant          Int      @id @default(autoincrement())
  code_restaurant        String   @unique
  libelle_restaurant     String   // Nom du restaurant
  description_restaurant String?
  etat_restaurant        Int?     @default(1)
  created_at_restaurant  DateTime?
  
  // Relations avec autres tables
  categories    categories[]
  clients      clients[]
  commandes    commandes[]
  produits     produits[]
  // ...
}

// Modèle pour les commandes
model commandes {
  id_commande         Int                      @id @default(autoincrement())
  code_commande       String                   @unique
  restaurant_code     String
  client_code         String
  total_commande      Decimal                  @db.Decimal(10, 2)
  statut_commande     commandes_statut_commande @default(en_attente)
  
  // Relations
  clients     clients     @relation(...)
  restaurants restaurants @relation(...)
  ligne_commandes ligne_commandes[]
}

// Enum pour les statuts des commandes
enum commandes_statut_commande {
  en_attente
  payee
  en_preparation
  livree
  annulee
}
```

**Rôle**: Définir la structure de la base de données et les relations entre tables

---

#### 5. `backend/src/shared/constants/tables.ts` - Le Dictionnaires 📖

```typescript
// Ce fichier contient les noms de tables et colonnes constants
// pour éviter les fautes de frappe

export const TABLES = {
  USERS: 'users',
  ROLES: 'roles',
  RESTAURANTS: 'restaurants',
  CLIENTS: 'clients',
  COMMANDES: 'commandes',
  PRODUITS: 'produits',
  // ...
} as const;

export const COLUMNS = {
  // Codes
  CODE_USER: 'code_user',
  CODE_CLIENT: 'code_client',
  CODE_RESTAURANT: 'code_restaurant',
  
  // Noms
  NOM_USER: 'nom_user',
  NOM_CLIENT: 'nom_client',
  
  // Emails
  EMAIL_USER: 'email_user',
  EMAIL_CLIENT: 'email_client',
  
  // ...
};

export const STATUT_COMMANDE = {
  EN_ATTENTE: 'en_attente',
  PAYEE: 'payee',
  EN_PREPARATION: 'en_preparation',
  LIVREE: 'livree',
  ANNULEE: 'annulee',
} as const;
```

**Rôle**: Centraliser les noms de tables et colonnes pour éviter les erreurs

---

#### 6. `backend/src/shared/services/base-crud.service.ts` - Le Modèle de Service 🛠️

```typescript
// Service générique pour éviter de répéter le même code

export class BaseCRUDService<T> {
  private model: any;
  private codeColumn: string;
  private codePrefix: string;

  constructor(model: any, codeColumn: string, codePrefix: string) {
    this.model = model;
    this.codeColumn = codeColumn;
    this.codePrefix = codePrefix;
  }

  // Trouver tous avec pagination
  async findAll(options = {}) {
    const { page = 1, limit = 10, search, searchFields = [] } = options;
    
    // Condition de recherche
    const searchCondition = search && searchFields.length > 0
      ? { OR: searchFields.map(field => ({ [field]: { contains: search } })) }
      : {};

    const total = await this.model.count({ where: searchCondition });
    const data = await this.model.findMany({
      where: searchCondition,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  // Trouver par code
  async findByCode(code: string) {
    return this.model.findUnique({ where: { [this.codeColumn]: code } });
  }

  // Créer
  async create(data: any) {
    const count = await this.model.count();
    const code = generateSequentialCode(this.codePrefix, count);
    return this.model.create({
      data: { ...data, [this.codeColumn]: code }
    });
  }

  // Modifier
  async updateByCode(code: string, data: any) {
    return this.model.update({ where: { [this.codeColumn]: code }, data });
  }

  // Supprimer
  async deleteByCode(code: string) {
    return this.model.delete({ where: { [this.codeColumn]: code } });
  }
}

// Créer des services pré-configurés
export const userService = createCRUDService(prisma.users, 'code_user', 'USER');
export const restaurantService = createCRUDService(prisma.restaurants, 'code_restaurant', 'RESTO');
export const clientService = createCRUDService(prisma.clients, 'code_client', 'CLI');
```

**Rôle**: Réduire le code dupliqué en créant un service réutilisable

---

## 🔗 Comment Tout Communique

### Schéma de Communication

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Utilisateur    │────▶│    Frontend      │────▶│    Backend       │
│   (Navigateur)  │     │    (React)       │     │   (Fastify)      │
└──────────────────┘     └──────────────────┘     └──────────────────┘
        │                        │                        │
        │                        │                        │
        ▼                        ▼                        ▼
   Interactions           Appels API              Traitements
   visuelles              (axios)                 (routes + Prisma)
                                                        │
                                                        ▼
                                                ┌──────────────────┐
                                                │   Base de       │
                                                │   Données       │
                                                │   (MySQL)        │
                                                └──────────────────┘
```

### Cycle de Vie d'une Requête

1. **Utilisateur clique sur un bouton** → React détecte l'événement
2. **React appelle un service API** → `usersService.getAll()`
3. **API client envoie la requête** → `axios.get('/api/v1/users')`
4. **Middleware vérifie le token** → `authenticate.middleware.ts`
5. **Route traite la requête** → `user.routes.ts`
6. **Prisma interroge la DB** → `prisma.users.findMany()`
7. **MySQL retourne les données** → Tableau d'utilisateurs
8. **Route formate la réponse** → `{ success: true, data: {...} }`
9. **Frontend reçoit et affiche** → Mise à jour de l'écran

---

## 📚 Vocabulaire Important

| Terme | Signification |
|-------|---------------|
| **Frontend** | Partie visible de l'application (ce que voit l'utilisateur) |
| **Backend** | Partie invisible qui traite les données |
| **API** | Interface de communication entre frontend et backend |
| **Route** | URL qui pointe vers une fonctionnalité |
| **Middleware** | Code qui s'exécute avant le traitement principal |
| **Prisma** | Outil pour manipuler la base de données |
| **JWT** | Token d'authentification sécurisé |
| **CRUD** | Create (créer), Read (lire), Update (modifier), Delete (supprimer) |
| **Pagination** | Système pour afficher les données par pages |
| **Component** | Élément réutilisable de l'interface |
| **Hook** | Fonction spéciale React |
| **State** | Donnée qui change dans un composant |

---

## 🎓 Pour Aller Plus Loin

###顺循序渐进 learning:

1. **Commencer par comprendre le flux** → Comment une requête circule
2. **Regarder un composant simple** → `src/components/logo.tsx`
3. **Regarder une page simple** → `src/pages/404.tsx`
4. **Regarder une route backend** → `backend/src/presentation/routes/user.routes.ts`
5. **Comprendre Prisma** → Regarder `backend/prisma/schema.prisma`

### Outils utiles:

- **React DevTools** → Voir les composants React
- **Network Tab** → Voir les requêtes HTTP
- **Postman/Insomnia** → Tester les API directement

---

## 📝 Résumé pour Enfant 🧒

Imagine que ce projet est comme un **restaurant**:

1. **Tu es le client** → Tu utilises le Frontend (React)
2. **Le menu est le code** → Tu choisis ce que tu veux (pages)
3. **Le serveur est l'API** → Il apporte ta commande
4. **La cuisine est le backend** → Elle prépare tout
5. **Le livreur est Prisma** → Il va chercher les ingrédients (données)
6. **La base de données est le frigo** → Tout est rangé dedans
7. **Le vigile est le middleware** → Il vérifie que tu as le droit d'entrer

Et quand tu veux créer quelque chose (une commande, un utilisateur), c'est comme commander au restaurant:
1. Tu dis ce que tu veux (formulaire)
2. Le serveur prend la commande (API)
3. La cuisine prépare (backend traite)
4. Le livreur apporte (Prisma enregistre)
5. Tu reçois ton plat (l'écran se met à jour) 🍕

---

**Fait avec ❤️ pour les développeurs débutants**