# Flow Complet: Login - De la soumission à la connexion réussie

## Schéma du parcours

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. LoginForm (src/pages/login.tsx)                                    │
│     └─> user clicks "Se connecter"                                     │
│           │                                                             │
│           ▼                                                             │
│  2. useAuth hook (src/hooks/useAuth.tsx:49)                           │
│     └─> login(email, password)                                        │
│           │                                                             │
│           ▼                                                             │
│  3. authService.login() (src/lib/api/auth.ts:53)                      │
│     └─> apiClient.post('/auth/login', data)                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP POST /api/v1/auth/login
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Fastify)                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  4. Route POST /auth/login                                            │
│     (backend/src/presentation/routes/auth.routes.ts:93)              │
│           │                                                             │
│           ▼                                                             │
│  5. Validation Zod (line 96)                                          │
│     └─> loginSchema.parse(request.body)                               │
│           │                                                             │
│           ▼                                                             │
│  6. Recherche utilisateur via Prisma (line 99-108)                   │
│     └─> prisma.user.findUnique({                                      │
│            where: { emailUser: data.email },                          │
│            include: { userRoles: { include: { role: true } } }       │
│          })                                                            │
│           │                                                             │
│           ▼                                                             │
│  7. Vérification mot de passe (line 118-121)                         │
│     └─> bcrypt.compare(password, user.motDePasse)                     │
│           │                                                             │
│           ▼                                                             │
│  8. Génération JWT (line 142-147)                                     │
│     └─> app.jwt.sign({ id, codeUser, email, roles })                  │
│           │                                                             │
│           ▼                                                             │
│  9. Réponse JSON (line 151-163)                                       │
│     └─> { success: true, data: { user, token } }                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP Response + JWT Token
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  10. authService.login() (src/lib/api/auth.ts:53-59)                 │
│      └─> Stockage token + user en localStorage                        │
│           localStorage.setItem('woli_token', response.data.token)    │
│           localStorage.setItem('woli_user', JSON.stringify(user))    │
│           │                                                             │
│           ▼                                                             │
│  11. useAuth hook met à jour le state (src/hooks/useAuth.tsx:56)     │
│      └─> setUser(response.data.user)                                  │
│           │                                                             │
│           ▼                                                             │
│  12. Redirection vers dashboard                                        │
│      └─> isAuthenticated = true                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Code détaillé par étape

### Étape 1-3: Frontend soumet le login

```typescript
// src/pages/login.tsx (exemple)
const { login } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await login(email, password);
  if (result.success) {
    navigate('/dashboard');
  }
};
```

### Étape 4-6: Backend reçoit et valide

```typescript
// backend/src/presentation/routes/auth.routes.ts:93-108
app.post('/login', async (request, reply) => {
  // 1. Valider les données
  const data = loginSchema.parse(request.body);
  
  // 2. Chercher utilisateur dans MySQL via Prisma
  const user = await prisma.user.findUnique({
    where: { emailUser: data.email },
    include: { userRoles: { include: { role: true } } }
  });
  
  if (!user) {
    return reply.status(401).send({ success: false, message: 'Invalid credentials' });
  }
  
  // 3. Vérifier mot de passe
  const validPassword = await bcrypt.compare(data.password, user.motDePasse);
  
  if (!validPassword) {
    return reply.status(401).send({ success: false, message: 'Invalid credentials' });
  }
});
```

### Étape 7-9: Backend génère le token

```typescript
// backend/src/presentation/routes/auth.routes.ts:141-163
// Générer JWT
const token = app.jwt.sign({
  id: user.idUser,
  codeUser: user.codeUser,
  email: user.emailUser,
  roles: user.userRoles.map(ur => ur.role.codeRole)
});

// Retourner réponse
return reply.send({
  success: true,
  data: {
    user: {
      id: user.idUser,
      codeUser: user.codeUser,
      email: user.emailUser,
      nomUser: user.nomUser,
      roles: roles
    },
    token
  }
});
```

### Étape 10-12: Frontend stocke et redirige

```typescript
// src/lib/api/auth.ts:53-59
async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
  const response = await apiClient.post('/auth/login', data);
  
  // Stocker dans localStorage
  if (response.data.success && response.data.data?.token) {
    localStorage.setItem('woli_token', response.data.data.token);
    localStorage.setItem('woli_user', JSON.stringify(response.data.data.user));
  }
  
  return response.data;
}
```

---

## Requête SQL exécutée (vue simplifiée)

```sql
-- Prisma génère cette requête automatiquement
SELECT * FROM users 
WHERE email_user = 'user@example.com' 
LIMIT 1;

-- Pour les roles
SELECT ur.*, r.* 
FROM user_roles ur
JOIN roles r ON ur.role_code = r.code_role
WHERE ur.user_code = 'USER_0001';
```

---

## Points importants

1. **Le mot de passe est hashé** avec bcrypt (12 rounds)
2. **Le token JWT contient**: id, codeUser, email, roles
3. **Le token expire** après 15 minutes (config dans .env)
4. **Le refresh token** expire après 7 jours
5. **localStorage** stocke le token et les infos utilisateur