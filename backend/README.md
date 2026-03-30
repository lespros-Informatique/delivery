# Woli Delivery Backend - Phase 1 Complete

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your database credentials
# Make sure MySQL is running or use Docker
```

### 3. Start Docker Services (MySQL + Redis)

```bash
npm run docker:up
```

This will start:
- **MySQL** on port 3306
- **Redis** on port 6379
- **Adminer** (MySQL web interface) on port 8080

### 4. Generate Prisma Client & Run Migrations

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

Or if you want to push schema directly to DB:

```bash
npm run prisma:push
```

### 5. Start Development Server

```bash
npm run dev
```

Server will start at: **http://localhost:3000**

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/auth/me` | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users` | List all users |
| GET | `/api/v1/users/:codeUser` | Get user by code |
| POST | `/api/v1/users` | Create user |
| PUT | `/api/v1/users/:codeUser` | Update user |
| DELETE | `/api/v1/users/:codeUser` | Delete user |

### Restaurants
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/restaurants` | List restaurants |
| GET | `/api/v1/restaurants/:codeRestaurant` | Get restaurant |
| POST | `/api/v1/restaurants` | Create restaurant |
| PUT | `/api/v1/restaurants/:codeRestaurant` | Update restaurant |

### Other Modules
- `/api/v1/categories` - Categories CRUD
- `/api/v1/products` - Products CRUD
- `/api/v1/clients` - Clients CRUD
- `/api/v1/commandes` - Orders CRUD
- `/api/v1/livreurs` - Delivery people CRUD
- `/api/v1/livraisons` - Deliveries CRUD
- `/api/v1/paiements` - Payments CRUD
- `/api/v1/villes` - Cities (public)
- `/api/v1/zones` - Delivery zones
- `/api/v1/promotions` - Promotions
- `/api/v1/analytics` - Analytics

---

## 🔐 Testing the API

### Register a user:
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@woli.com","password":"password123","nomUser":"Admin"}'
```

### Login:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@woli.com","password":"password123"}'
```

### Get current user (with token):
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema (29 tables!)
├── src/
│   ├── index.ts              # Entry point
│   ├── app.ts                # Fastify app setup
│   ├── infrastructure/
│   │   └── database/
│   │       └── prisma.service.ts  # Database connection
│   ├── presentation/
│   │   ├── middleware/
│   │   │   ├── error-handler.middleware.ts
│   │   │   └── not-found-handler.middleware.ts
│   │   └── routes/
│   │       ├── auth.routes.ts
│   │       ├── user.routes.ts
│   │       └── ... (14 route files)
│   └── shared/
│       └── utils/
│           └── logger.util.ts
├── package.json
├── tsconfig.json
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server (hot reload) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run docker:up` | Start Docker services |
| `npm run docker:down` | Stop Docker services |

---

## ✅ Next Steps

Phase 1 is complete! Now ready for:
- **Phase 2**: Auth & Users (already implemented)
- **Phase 3**: Restaurants CRUD
- **Phase 4**: Products/Categories
- **Phase 5**: Orders & Cart
- **Phase 6**: Delivery Management
- **Phase 7**: Payments & Wallet

---

## 🔧 Tech Stack

- **Runtime**: Node.js 20 LTS
- **Language**: TypeScript 5.x
- **API Framework**: Fastify 4.x
- **ORM**: Prisma 5.x
- **Database**: MySQL 8
- **Validation**: Zod
- **Password**: bcrypt

---

## 📝 Notes

- All routes (except login, register, /health, /villes) require JWT authentication
- Password hashing uses bcrypt with 12 rounds
- All endpoints return `{ success: true/false, data: ... }` format
- Database schema is fully generated from your db.sql file
