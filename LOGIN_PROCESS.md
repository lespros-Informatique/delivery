# 🔐 Comment fonctionne la connexion? (Pour les débutants)

Ce document explique simplement comment un utilisateur peut se connecter à l'application Woli Delivery.

---

## 🎯 C'est quoi la connexion?

Quand tu veux entrer dans une maison, tu as besoin d'une clé. Sur internet, c'est pareil! La connexion vérifie que tu es bien autorisé à accéder à l'application.

---

## 🏠 Les 3 parties de l'application

```
┌─────────────────────────────────────────────────────────────────┐
│                         NOTRE APP                               │
│                                                                 │
│   ┌──────────────┐      ┌──────────────┐      ┌─────────────┐  │
│   │   FRONTEND   │      │    BACKEND   │      │   DATABASE  │  │
│   │  (Interface) │ ───▶ │   (Serveur)  │ ───▶ │  (Stockage) │  │
│   └──────────────┘      └──────────────┘      └─────────────┘  │
│        │                       │                      │         │
│   Ce que tu vois         Le cerveau qui           Là où on     │
│   à l'écran              traite tout               garde les    │
│                          les demandes              données      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Étape 1: L'utilisateur remplit le formulaire

**Fichier:** `src/pages/login.tsx`

Quand tu es sur la page de connexion, tu vois un formulaire avec:
- Un champ pour l'email (ex: admin@test.com)
- Un champ pour le mot de passe (ex: password123)
- Un bouton "Se connecter"

```typescript
// Ce que fait le code quand tu cliques sur le bouton:
const handleSubmit = async (e) => {
  e.preventDefault();  // Empêche la page de se recharger
  
  // On appelle la fonction login avec email et mot de passe
  const success = await login(email, password);
  
  // Si ça marche, on va vers le dashboard
  if (success.success) {
    navigate('/');  // Redirection vers la page d'accueil
  }
};
```

**En gros:** Le formulaire envoie tes identifiants au serveur pour vérification.

---

## 🔄 Étape 2: Le frontend envoie la demande

**Fichier:** `src/hooks/useAuth.tsx`

Le "hook" useAuth est comme un assistant qui gère toute la partie connexion:

```typescript
const login = async (email, password) => {
  // 1. On dit que ça charge (pour afficher le chargement)
  setIsLoading(true);
  
  // 2. On envoie la demande au serveur
  const response = await authService.login({ email, password });
  
  // 3. Si le serveur dit que c'est bon
  if (response.success) 
    // On sauvegarde l'utilisateur pour l'affichage
    authService.setCurrentUser(response.data.user);
    setUser(response.data.user);
    return { success: true };
  }
  
  // 4. Si le serveur dit que c'est faux
  return { success: false, message: 'Email ou mot de passe incorrect' };
};
```

**En gros:** C'est l'intermédiaire entre le formulaire et le serveur.

---

## 📡 Étape 3: La requête HTTP

**Fichier:** `src/lib/api/auth.ts`

Comment on envoie la demande au serveur:

```typescript
async login(data) {
  // Axios est une librairie qui permet de faire des requêtes HTTP
  const response = await apiClient.post('/auth/login', data);
  return response.data;
}
```

**En gros:** POST = "je veux envoyer des données", /auth/login = "c'est la page de connexion"

---

## 🍪 Étape 4: Le serveur reçoit la demande

**Fichier:** `backend/src/presentation/routes/auth.routes.ts`

Le serveur (Fastify) reçoit la demande et fait plusieurs vérifications:

```typescript
app.post('/login', async (request, reply) => {
  
  // 1. Récupérer l'email et le mot de passe
  const { email, password } = request.body;
  
  // 2. Chercher l'utilisateur dans la base de données
  const user = await prisma.users.findUnique({
    where: { email_user: email }
  });
  
  // 3. Si l'utilisateur n'existe pas
  if (!user) {
    return reply.status(401).send({ message: 'Identifiants incorrects' });
  }
  
  // 4. Vérifier le mot de passe (bcrypt compare les mots de passe)
  const validPassword = await bcrypt.compare(password, user.mot_de_passe);
  
  if (!validPassword) {
    return reply.status(401).send({ message: 'Identifiants incorrects' });
  }
  
  // 5. Créer les tokens JWT (des clés d'accès)
  const accessToken = jwt.sign({ id: user.id }, 'secret', { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id }, 'secret', { expiresIn: '7d' });
  
  // 6. Envoyer les cookies (des petits fichiers dans le navigateur)
  reply.setCookie('access_token', accessToken, { httpOnly: true });
  reply.setCookie('refresh_token', refreshToken, { httpOnly: true });
  
  // 7. Répondre que tout est OK
  return reply.send({ success: true, data: { user } });
});
```

**En gros:** Le serveur vérifie que l'utilisateur existe et que le mot de passe est correct, puis crée des "clés" (tokens) pour permettre l'accès.

---

## 🔑 Étape 5: Les tokens JWT (les clés d'accès)

**C'est quoi un token JWT?**

Imagine que tu achètes un billet de cinéma. Le billet contient:
- Ton nom
- La date de validité
- Un code secret

Un token JWT c'est pareil! C'est une chaîne de caractères qui contient:
- L'ID de l'utilisateur
- La date d'expiration
- Une signature pour vérifier que c'est authentique

```javascript
// Example de token JWT (c'est juste du texte encodé)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNzc0NDQ1Njc3fQ.abc123...
```

**Deux types de tokens:**
1. **Access Token** (15 minutes): Pour accéder aux pages
2. **Refresh Token** (7 jours): Pour obtenir un nouveau access token

---

## 🍪 Étape 6: Les cookies (le stockage)

**Pourquoi pas localStorage?**

On pourrait stocker le token dans localStorage, mais c'est dangereux car:
- JavaScript peut lire localStorage
- Un pirate pourrait voler le token (XSS)

**Solution: Les cookies HTTP-Only**

```typescript
// Configuration des cookies
reply.header('Set-Cookie', 
  'access_token=abc123; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900'
);
```

**Explication des options:**
- `HttpOnly`: JavaScript ne peut pas lire le cookie (sécurité XSS)
- `Secure`: Fonctionne seulement en HTTPS
- `SameSite=Strict`: Empêche les attaques CSRF
- `Path=/`: Disponible sur tout le site
- `Max-Age=900`: expire dans 15 minutes (900 secondes)

---

## 🛡️ Étape 7: La protection des routes

**Fichier:** `src/components/ProtectedRoute.tsx`

Certaines pages ne sont accessibles que si tu es connecté:

```typescript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Si ça charge, on attend
  if (isLoading) {
    return <Chargement...>;
  }
  
  // Si pas connecté, on redirige vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Si connecté, on affiche la page
  return children;
};
```

---

## 🔄 Étape 8: Le renouvellement automatique

**Pourquoi?**

Si tu es connecté depuis 15 minutes, ton access token expire. Au lieu de te déconnecter, on renouvelle automatiquement le token.

```typescript
// Toutes les 12 minutes
setTimeout(async () => {
  const response = await authService.refresh();
  if (response.success) {
    // Nouveau token reçu!
  }
}, 12 * 60 * 1000);
```

---

## 🚪 Étape 9: La déconnexion

```typescript
const logout = async () => {
  // 1. Appeler le serveur pour dire qu'on se déconnecte
  await authService.logout();
  
  // 2. Effacer les données locales
  authService.clearCurrentUser();
  setUser(null);
  
  // 3. Renvoyer vers la page de login
  window.location.href = '/login';
};
```

---

## 📊 Résumé visuel

```
┌─────────────┐
│  UTILISATEUR│
└──────┬──────┘
       │ 1. Remplit le formulaire
       ▼
┌─────────────┐
│ login.tsx   │ ──▶ Envoie email + mot de passe
└──────┬──────┘
       │ 2. Appelle useAuth
       ▼
┌─────────────┐
│ useAuth.tsx │ ──▶ Appelle le service API
└──────┬──────┘
       │ 3. Envoie requête HTTP
       ▼
┌─────────────┐
│ auth.ts     │ ──▶ apiClient.post('/auth/login')
└──────┬──────┘
       │ 4. Requête vers le serveur
       ▼
┌─────────────┐
│ BACKEND     │ ──▶ Vérifie email + mot de passe
│ auth.routes │ ──▶ Crée les tokens JWT
└──────┬──────┘
       │ 5. Répond avec cookies
       ▼
┌─────────────┐
│ NAVIGATEUR  │ ──▶ Reçoit les cookies HttpOnly
└──────┬──────┘
       │ 6. Sauvegarde user en localStorage (pour l'UI)
       ▼
┌─────────────┐
│ REDIRECTION │ ──▶ Va vers le dashboard
└─────────────┘
```

---

## 🔒 La sécurité en résumé

| Problème | Solution |
|----------|----------|
| Quelqu'un vole le mot de passe | Password hashé avec bcrypt |
| Quelqu'un vole le token | Cookie HttpOnly (JS ne peut pas lire) |
| Attaque CSRF | SameSite=Strict |
| Token expire | Refresh automatique toutes les 12 min |

---

## 📁 Les fichiers importants

| Fichier | Ce qu'il fait |
|---------|----------------|
| `src/pages/login.tsx` | Le formulaire que tu vois |
| `src/hooks/useAuth.tsx` | Gère la connexion dans React |
| `src/lib/api/auth.ts` | Envoie la demande au serveur |
| `src/lib/api/client.ts` | Configure Axios (les requêtes) |
| `src/components/ProtectedRoute.tsx` | Protège les pages |
| `backend/src/presentation/routes/auth.routes.ts` | Le serveur qui vérifie tout |

---

## ✅ C'est tout!

Tu sais maintenant comment fonctionne la connexion! 

En résumé:
1. Tu rentres ton email et mot de passe
2. Le frontend envoie ça au backend
3. Le backend vérifie dans la base de données
4. Si c'est bon, il donne des "clés" (tokens) via des cookies
5. Tu es redirigé vers le dashboard
6. Les tokens se renouvellent automatiquement
