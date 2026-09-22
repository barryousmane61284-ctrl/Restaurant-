# 🔧 GUIDE DE DÉMARRAGE RAPIDE

## Installation et Configuration

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet:

```env
# ===== Database =====
DB_URL=mongodb://localhost:27017/gestion-de-restaurant

# ===== JWT Secrets =====
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ===== Server =====
PORT=8000
NODE_ENV=development
```

### 3. Démarrer la base de données MongoDB

```bash
# Si MongoDB est installé localement:
mongod

# Ou utiliser Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Démarrer le serveur

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:8000`

---

## 📡 Tester les Endpoints

### Authentification

#### 1. S'inscrire
```bash
curl -X POST http://localhost:8000/authentification/inscription \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean@restaurant.com",
    "telephone": "0612345678",
    "password": "SecurePassword123"
  }'
```

#### 2. Se connecter
```bash
curl -X POST http://localhost:8000/authentification/connexion \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@restaurant.com",
    "password": "SecurePassword123"
  }'
```

Copier le `accessToken` retourné pour les autres requêtes

#### 3. Récupérer l'utilisateur connecté
```bash
curl -X GET http://localhost:8000/authentification/moi \
  -H "Authorization: Bearer {accessToken}"
```

---

### Users (Administrateur)

#### Créer un utilisateur
```bash
curl -X POST http://localhost:8000/user \
  -H "Content-Type: multipart/form-data" \
  -H "Authorization: Bearer {adminToken}" \
  -F "nom=Martin" \
  -F "prenom=Pierre" \
  -F "email=pierre@restaurant.com" \
  -F "telephone=0687654321" \
  -F "password=Password123" \
  -F "role=serveur" \
  -F "image=@/chemin/vers/image.jpg"
```

#### Récupérer tous les utilisateurs
```bash
curl -X GET "http://localhost:8000/user?page=1&limit=20" \
  -H "Authorization: Bearer {adminToken}"
```

#### Récupérer un utilisateur par ID
```bash
curl -X GET http://localhost:8000/user/{userId} \
  -H "Authorization: Bearer {token}"
```

#### Mettre à jour un utilisateur
```bash
curl -X PUT http://localhost:8000/user/{userId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "nom": "MartinUpdated",
    "telephone": "0698765432"
  }'
```

#### Supprimer un utilisateur
```bash
curl -X DELETE http://localhost:8000/user/{userId} \
  -H "Authorization: Bearer {adminToken}"
```

---

### Catégories

#### Créer une catégorie
```bash
curl -X POST http://localhost:8000/categori/creation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {adminToken}" \
  -d '{
    "nom": "Entrées",
    "description": "Les plats d'\''entrée"
  }'
```

#### Récupérer toutes les catégories
```bash
curl -X GET http://localhost:8000/categori \
  -H "Authorization: Bearer {token}"
```

---

### Plats

#### Créer un plat
```bash
curl -X POST http://localhost:8000/plat/creation \
  -H "Content-Type: multipart/form-data" \
  -H "Authorization: Bearer {adminToken}" \
  -F "nom=Pizza Margherita" \
  -F "description=Pizza classique avec tomate et mozarella" \
  -F "prix=12.50" \
  -F "disponible=true" \
  -F "categori={categoriId}" \
  -F "image=@/chemin/vers/image.jpg"
```

#### Récupérer tous les plats
```bash
curl -X GET http://localhost:8000/plat \
  -H "Authorization: Bearer {token}"
```

---

### Clients

#### Créer un client
```bash
curl -X POST http://localhost:8000/client/creation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {serverToken}" \
  -d '{
    "nom": "Durand",
    "prenom": "Marie",
    "matricule": "CLI001",
    "telephone": "0645123456",
    "email": "marie@example.com",
    "adresse": "123 Rue de la Paix, 75000 Paris"
  }'
```

#### Récupérer tous les clients
```bash
curl -X GET http://localhost:8000/client \
  -H "Authorization: Bearer {token}"
```

---

### Commandes

#### Créer une commande
```bash
curl -X POST http://localhost:8000/commande/creation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {serverToken}" \
  -d '{
    "id_user": "{userId}",
    "id_client": "{clientId}",
    "plat": [
      {
        "id_plat": "{platId1}",
        "quantite": 2,
        "prixunitaire": 12.50
      },
      {
        "id_plat": "{platId2}",
        "quantite": 1,
        "prixunitaire": 8.99
      }
    ],
    "total": 34.99,
    "status": "en_attente"
  }'
```

#### Récupérer toutes les commandes
```bash
curl -X GET http://localhost:8000/commande \
  -H "Authorization: Bearer {token}"
```

#### Mettre à jour une commande
```bash
curl -X PUT http://localhost:8000/commande/{commandeId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {serverToken}" \
  -d '{
    "status": "en_cours"
  }'
```

---

### Factures

#### Créer une facture
```bash
curl -X POST http://localhost:8000/facture/creation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {serverToken}" \
  -d '{
    "id_user": "{userId}",
    "id_commande": "{commandeId}",
    "id_client": "{clientId}",
    "montant_total": 34.99,
    "statut": "payée",
    "mode_paiement": "carte"
  }'
```

#### Récupérer toutes les factures
```bash
curl -X GET http://localhost:8000/facture \
  -H "Authorization: Bearer {token}"
```

---

## 🧪 Test avec Postman

1. Importer la collection depuis `doc/donnees-test-thunder.md`
2. Configurer la variable d'environnement `{{token}}` avec le token JWT reçu
3. Exécuter les requêtes

---

## 🐛 Débogage

### Vérifier la connexion à MongoDB
```bash
# Si MongoDB est actif, vous devriez voir:
# "connexion etablie avec mongodb"
```

### Vérifier les variables d'environnement
```bash
node -e "console.log(process.env.DB_URL)"
```

### Logs détaillés
Activer `NODE_ENV=development` dans le `.env` pour voir plus de détails

---

## ✅ Checklist de Vérification

- [ ] `npm install` réussi sans erreurs
- [ ] `.env` créé avec les variables requises
- [ ] MongoDB est en cours d'exécution
- [ ] `npm run dev` démarre sans erreurs
- [ ] Inscription possible sur `/authentification/inscription`
- [ ] Connexion possible sur `/authentification/connexion`
- [ ] Token JWT reçu et valide
- [ ] Tous les endpoints retournent le bon code HTTP

---

## 📞 En Cas de Problème

### Erreur: \"connexion etablie avec mongodb\" pas visible
- Vérifier que MongoDB est en cours d'exécution
- Vérifier la valeur de `DB_URL` dans `.env`

### Erreur: \"Cannot find module\"
- Exécuter `npm install` à nouveau
- Supprimer `node_modules` et `package-lock.json`, puis `npm install`

### Erreur 401 (Non authentifié)
- Vérifier que le token est dans le header `Authorization: Bearer {token}`
- Vérifier que le token n'a pas expiré
- Générer un nouveau token

### Erreur 403 (Accès interdit)
- Vérifier que l'utilisateur a le bon rôle (admin/serveur/caissier)

---

## 🔒 Considérations de Sécurité

- 🔑 Ne jamais committer le fichier `.env`
- 🔐 Changer les secrets JWT en production
- 🚫 Utiliser HTTPS en production
- 🔒 Ajouter le `.env` au `.gitignore`

---

## 📖 Documentation Complète

Voir les fichiers:
- `RESUME_ANALYSE.md` - Vue d'ensemble
- `ANALYSE_CODE_COMPLETE.md` - Tous les problèmes détectés
- `PLAN_ACTION.md` - Comment corriger chaque problème

