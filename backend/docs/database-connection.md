# Connexion à MySQL avec Prisma - Explication Technique

## Overview

Prisma est un ORM (Object-Relational Mapping) moderne pour Node.js qui simplifie l'accès à la base de données MySQL.

## Comment ça marche

### 1. Configuration (schema.prisma)

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

Le fichier `schema.prisma` définit les modèles de données. Prisma génère automatiquement le client TypeScript basé sur ce schéma.

### 2. URL de connexion (DATABASE_URL)

```
mysql://user:password@host:port/database?options
```

Exemple dans notre projet:
```
mysql://root:@localhost:3306/db_resto
```

- `root` - nom d'utilisateur MySQL
- `@` - pas de mot de passe (WAMP local)
- `localhost` - serveur MySQL
- `3306` - port par défaut MySQL
- `db_resto` - nom de la base de données

### 3. Service de connexion (prisma.service.ts)

```typescript
// Création du client Prisma
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn']
});

// Connexion automatique
prisma.$connect()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database error', err));
```

### 4. Utilisation dans les routes

```typescript
// Récupérer tous les utilisateurs
const users = await prisma.user.findMany();

// Créer un utilisateur
const newUser = await prisma.user.create({
  data: {
    codeUser: 'USER001',
    nomUser: 'John Doe',
    emailUser: 'john@example.com',
    motDePasse: 'hashed_password'
  }
});

// Requête avec relations
const restaurants = await prisma.restaurant.findMany({
  include: {
    owner: true,
    ville: true
  }
});
```

## Flux de données

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Fastify   │─────▶│   Prisma    │
│   (React)   │      │   (API)     │      │   Client    │
└─────────────┘      └─────────────┘      └─────────────┘
                                                │
                                                ▼
                                         ┌─────────────┐
                                         │    MySQL    │
                                         │  (db_resto) │
                                         └─────────────┘
```

## Commandes importantes

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev

# Voir la base de données
npx prisma studio

# Reset de la base (danger!)
npx prisma migrate reset
```

## Avantages de Prisma

1. **Type Safety** - Types TypeScript auto-générés
2. **DX** - API simple et intuitive
3. **Migrations** - Gestion des changements de schéma
4. **Relations** - Include/join automatiques
5. **Performance** - Connection pooling intégré

## Inconvénients

1. **重量** - Plus lourd qu'un driver SQL brut
2. **Learning curve** - Nouvelle syntaxe à apprendre
3. **Abstraction** - Moins de contrôle sur les requêtes complexes