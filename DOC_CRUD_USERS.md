# Guide de Fonctionnement du CRUD Utilisateurs

Ce document explique en détail le fonctionnement technique du module de gestion des utilisateurs, du clic sur l'interface jusqu'à l'enregistrement dans la base de données.

---

## 🏗️ Architecture Globale

Le projet suit une architecture moderne en couches :

1.  **Frontend (UI)** : React + Vite + Material UI.
2.  **API Client** : Axios (encapsulé dans `apiClient`) pour les appels réseau.
3.  **Backend (Serveur)** : Fastify (Node.js).
4.  **Base de données** : MySQL via l'ORM Prisma.

---

## 🔄 Le Flux de Données (Exemple : Création)

Voici le cheminement complet quand vous ajoutez un nouvel utilisateur :

### 1. Frontend : Saisie et Envoi
- **Fichier** : `src/pages/users.tsx` & `src/components/forms/user-form.tsx`
- L'utilisateur remplit le formulaire dans `UserForm`.
- Au clic sur "Ajouter", la fonction `handleSubmit` est appelée dans `users.tsx`.
- Elle déclenche une **Mutation** via `createUser.mutate(formData)`.

### 2. Service API : Pont vers le Serveur
- **Fichier** : `src/lib/api/users.ts`
- La mutation appelle la méthode `usersService.create(data)`.
- Elle effectue une requête HTTP **POST** vers `http://localhost:3001/api/v1/users`.

### 3. Backend : Réception et Validation
- **Fichier** : `backend/src/presentation/routes/user.routes.ts`
- La route `app.post('/')` intercepte la requête.
- **Validation Zod** : Le schéma `createUserSchema` vérifie que les données sont valides (email correct, nom présent, etc.).
- Si c'est invalide, le serveur renvoie une erreur 400.

### 4. Base de Données : Persistance
- **Fichier** : `user.routes.ts`
- Si les données sont valides, Prisma génère un code unique (ex: `USER_0015`).
- Le mot de passe est haché via `bcrypt` pour la sécurité.
- Prisma exécute la commande `prisma.users.create()` qui insère la ligne dans la table **users** de MySQL.

### 5. Retour : Notification et Rafraîchissement
- Le serveur renvoie une réponse `success: true`.
- Le Frontend intercepte cette réponse dans le callback `onSuccess` de `useApiMutation` (dans `users.tsx`).
- Une notification **toast** verte s'affiche : "Utilisateur créé avec succès".
- La fonction `refetch()` est appelée pour recharger la liste automatiquement sans rafraîchir la page.

---

## 🛠️ Détail des Opérations (CRUD)

### 📥 LECTURE (Read)
- **Frontend** : `useApiList` appelle `usersService.getAll`.
- **Backend** : `prisma.users.findMany` récupère les utilisateurs avec pagination et recherche.

### ✏️ MODIFICATION (Update)
- **Frontend** : Au clic sur "Modifier", l'utilisateur sélectionné est stocké dans l'état `selectedUser`. Le formulaire s'ouvre pré-rempli.
- **Soumission** : Appel à `usersService.update(code, data)` via une requête **PUT**.
- **Backend** : Mise à jour sélective des champs modifiés via `prisma.users.update`.

### 🗑️ SUPPRESSION (Soft Delete / Archivage)
> **Note Importante** : Dans ce projet, nous ne supprimons pas physiquement les données (pour garder l'historique).
- **Frontend** : Le bouton "Supprimer" appelle en réalité la fonction `update` en changeant l'état : `etatUsers: false`.
- **Backend** : Prisma met à jour la colonne `etat_users` à `0` (Inactif).
- **Conséquence** : L'utilisateur n'apparaît plus dans les listes car le backend filtre souvent par `etat_users = 1`.

---

## 🗺️ Carte des Communications

| Élément | Rôle | Communique avec... |
| :--- | :--- | :--- |
| **UserPage** (`users.tsx`) | Chef d'orchestre (UI) | DataTable, Modals, API Service |
| **UserForm** (`user-form.tsx`) | Saisie des données | UserPage (via `onSubmit`) |
| **usersService** (`users.ts`) | Messager Réseau | Backend Node.js |
| **userRoutes** (`user.routes.ts`) | Cerveau Logique | Zod (Validation), Prisma |
| **Prisma** | Maçon | Base de données MySQL |

---

## 💡 Points Clés à Retenir
- **Hachage** : Les mots de passe ne sont jamais stockés en clair (BCRYPT).
- **Codes** : Les codes utilisateurs (ex: USR_001) sont générés par le backend.
- **Validation** : Zod protège le backend contre les données corrompues ou pirates.
- **Réactivité** : React Query (`useApiMutation`) gère les états de chargement et le rafraîchissement automatique.
