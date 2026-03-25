# Architecture Backend - Woli Delivery

## 1. Stack Techno (Choix pour 20 ans)

### Core
| Techno | Version | Pourquoi |
|--------|---------|----------|
| **Node.js** | 20 LTS | Stable, support long terme, performant |
| **TypeScript** | 5.x | Type safety, maintenance sur 20 ans |
| **Fastify** | 4.x | Plus rapide que Express, validation native, moins de vulnérabilités |
| **Prisma** | 5.x | ORM moderne, migrations, type-safety total |

### Base de données
| Techno | Utilisation |
|--------|-------------|
| **MySQL 8** | Base principale (ton db.sql est déjà en MySQL) |
| **Redis** | Cache, sessions, files d'attente |

### Auth & Security
| Techno | Utilisation |
|--------|-------------|
| **JWT** | Tokens d'authentification |
| **Bcrypt** | Hash des mots de passe |
| **Zod** | Validation des données (schema validation) |

### Outils
| Techno | Utilisation |
|--------|-------------|
| **Docker** | Conteneurisation |
| **ESLint + Prettier** | Code quality |
| **Winston** | Logging structuré |

---

## 2. Architecture - Clean Architecture (DDD)

```
src/
├── domain/                 # LOGIQUE MÉTIER (Le cœur)
│   ├── entities/          # Models (User, Restaurant, Commande...)
│   ├── repositories/      # Interfaces (pas d'implémentation)
│   └── services/          # Logique métier pure
│
├── application/           # CAS D'UTILISATION
│   ├── use-cases/        # CreateUser, CreateOrder, AssignDelivery...
│   ├── dto/              # Data Transfer Objects
│   └── interfaces/      # Ports (réposositories, services externes)
│
├── infrastructure/        # IMPLEMENTATION TECHNIQUE
│   ├── database/         # Prisma, migrations, seeders
│   ├── repositories/    # Implémentation des repositories
│   ├── services/        # Services externes (Email, SMS, Payment)
│   └── auth/            # JWT, password hashing
│
├── presentation/          # API REST
│   ├── controllers/     # Fastify routes handlers
│   ├── routes/          # Définition des routes
│   ├── middleware/      # Auth, validation, error handling
│   └── schemas/         # Zod schemas pour validation
│
└── shared/               # UTILITAIRES
    ├── utils/           # Fonctions helpers
    ├── constants/      # Enum, constantes
    ├── errors/         # Erreurs personnalisées
    └── types/          # Types TypeScript globaux
```

### Principes Clés

1. **Dépendances vers l'intérieur** : domain → application → infrastructure
2. **Pas de dépendance technique dans le domain**
3. **Une entité = un fichier** (pas de gros fichiers)
4. **Repository pattern** : abstraction de la DB

---

## 3. Structure des Tables (Domain)

D'après ton db.sql, voila les **Bounded Contexts** (Domaines métier):

### A. Authentication & Users
- `users` - Utilisateurs principaux
- `roles` - Rôles (admin, restaurant_owner, livreur, manager, client)
- `permissions` - Permissions granulaires
- `user_roles` - Relation user → roles

### B. Restaurant Management
- `restaurants` - Restaurants
- `familles` - Types de cuisine
- `categories` - Catégories de produits
- `produits` - Produits/Menus
- `restaurant_horaires` - Horaires d'ouverture
- `restaurant_fermetures` - Fermetures exceptionnelles

### C. Orders & Cart
- `panier` / `panier_lignes` - Panier client
- `commandes` / `ligne_commandes` - Commandes
- `clients` - Clients (différent de users)

### D. Delivery
- `livraisons` - Livraisons
- `livreurs` - Livreurs
- `livraison_positions` - Suivi GPS temps réel

### E. Payments & Finance
- `paiements` - Paiements
- `commissions` - Commission sur commande
- `commission_configs` - Configuration commission
- `gains` - Gains restaurant
- `wallet_livreurs` / `wallet_transactions` - Wallet livreur

### F. Marketing
- `promotions` - Promotions/Remises

### G. Reviews
- `evaluations` - Notes et commentaires

### H. Location
- `villes` - Villes de livraison
- `zones_livraison` - Zones avec frais/délais

### I. Notifications
- `notifications` - Notifications push/email

### J. Analytics
- `analytics` - Statistiques agrégées
- `logs_activite` - Logsactions utilisateurs

---

## 4. Ordre d'Implémentation (Sprint par Sprint)

### Phase 1: Fondations (Semaine 1-2)
- [ ] Setup projet Node + TypeScript + Fastify
- [ ] Setup Prisma + connexion MySQL
- [ ] Structure Clean Architecture
- [ ] Gestion des erreurs centralisée
- [ ] Logging avec Winston

### Phase 2: Auth & Users (Semaine 3-4)
- [ ] Entity User + Repository
- [ ] Inscription / Connexion JWT
- [ ] Roles & Permissions
- [ ] Middleware auth (verify token)
- [ ] Route: `/auth/*`, `/users/*`

### Phase 3: Restaurants (Semaine 5-6)
- [ ] Entity Restaurant, Famille, Ville, Zone
- [ ] CRUD Restaurants
- [ ] Gestion horaires
- [ ] Route: `/restaurants/*`, `/villes/*`, `/zones/*`

### Phase 4: Products (Semaine 7-8)
- [ ] Entity Category, Produit
- [ ] CRUD produits avec upload image
- [ ] Gestion disponibilité
- [ ] Route: `/categories/*`, `/produits/*`

### Phase 5: Orders (Semaine 9-10)
- [ ] Entity Panier, Commande, LigneCommande
- [ ] Flow: Ajouter au panier → Commander → Payer
- [ ] Statut commandes (en_attente → payee → en_preparation → livree)
- [ ] Route: `/panier/*`, `/commandes/*`

### Phase 6: Delivery (Semaine 11-12)
- [ ] Entity Livreur, Livraison
- [ ] Assignation livreur → livraison
- [ ] Suivi position (GPS)
- [ ] Route: `/livreurs/*`, `/livraisons/*`

### Phase 7: Payments & Wallet (Semaine 13-14)
- [ ] Entity Paiement, Wallet
- [ ] Intégration paiement (Mock ou реальный)
- [ ] Calcul commissions
- [ ] Route: `/paiements/*`, `/wallets/*`

### Phase 8: Reviews & Notifications (Semaine 15)
- [ ] Entity Evaluation, Notification
- [ ] Système de notation
- [ ] Notifications temps réel (WebSocket)

### Phase 9: Analytics & Reports (Semaine 16)
- [ ] Dashboards statistiques
- [ ] Rapports revenus/livraisons
- [ ] API analytics

---

## 5. Patterns à Utiliser

### Repository Pattern
```typescript
// domain/repositories/user.repository.interface.ts
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
}

// infrastructure/database/repositories/prisma-user.repository.ts
class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
```

### Use Case Pattern
```typescript
// application/use-cases/create-user.use-case.ts
class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService
  ) {}

  async execute(data: CreateUserDTO): Promise<User> {
    // Validation métier
    // Logique applicative
    // Appel repository
  }
}
```

### DTO Pattern
```typescript
// application/dto/create-user.dto.ts
interface CreateUserDTO {
  email: string;
  password: string;
  nom: string;
  // ...
}

// Validation avec Zod dans le controller
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  // ...
});
```

---

## 6. Convention de Code

### Fichiers
- `user.entity.ts` - Entité
- `user.repository.interface.ts` - Interface repository
- `user.service.ts` - Service métier
- `create-user.use-case.ts` - Use case
- `user.controller.ts` - Controller Fastify
- `user.routes.ts` - Définition routes

### Nommage
- **Fichiers**: kebab-case (user.service.ts)
- **Classes**: PascalCase (class UserService)
- **Interfaces**: PascalCase avec préfixe I (interface IUserRepository)
- **Constantes**: UPPER_SNAKE_CASE (ORDER_STATUS)

---

## 7. Security Checklist

- [ ] **HTTPS** en production
- [ ] **Helmet** headers sécurité
- [ ] **Rate limiting** sur les routes auth
- [ ] **Input validation** avec Zod
- [ ] **Password hashing** avec bcrypt (12 rounds)
- [ ] **SQL injection** prevent via Prisma
- [ ] **CORS** configuré correctement
- [ ] **JWT** avec expiration courte (15min)
- [ ] **Refresh token** pour session longue

---

## 8. Tests Strategy

| Type | Couverture Cible | Outil |
|------|------------------|-------|
| Unit | 70% functions métier | Jest |
| Integration | Routes API | Supertest |
| E2E | User flows critiques | Playwright |

---

## 9. Docker Setup

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://...
      - JWT_SECRET=...
  
  mysql:
    image: mysql:8
    volumes:
      - mysql_data:/var/lib/mysql
  
  redis:
    image: redis:7-alpine
```

---

## 10. Checklist Qualité

- [ ] ESLint + Prettier configuré
- [ ] TypeScript strict mode
- [ ] Git hooks (pre-commit)
- [ ] Conventional commits
- [ ] Documentation API (Swagger/OpenAPI)
- [ ] Monitoring (Prometheus + Grafana)

---

## Prochaine Étape

Tu veux que je commence à implémenter какойа partie ? Je suggère de commencer par:
1. **Phase 1** - Setup du projet avec structure Clean Architecture
2. OU direct sur **Phase 2** - Auth si tu veux aller vite vers un prototype fonctionnel

Dis-moi ton choix et je crée les fichiers de base!