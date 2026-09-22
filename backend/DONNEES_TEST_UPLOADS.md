# 🧪 DONNÉES DE TEST - Upload Fichiers

Ce fichier contient des données de test prêtes à l'emploi pour tester les uploads de fichiers (utilisateurs et plats).

---

## 🔑 ÉTAPE 1: Obtenir un Token d'Authentification

### Créer un Administrateur (si pas encore fait)

**Endpoint:** `POST http://localhost:8000/authentification/inscription`

```bash
curl -X POST http://localhost:8000/authentification/inscription \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Admin",
    "prenom": "Test",
    "email": "admin@restaurant.com",
    "telephone": "0600000000",
    "password": "AdminSecure123!"
  }'
```

**Réponse (copier le accessToken):**
```json
{
  "utilisateur": { ... },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Se Connecter

**Endpoint:** `POST http://localhost:8000/authentification/connexion`

```bash
curl -X POST http://localhost:8000/authentification/connexion \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@restaurant.com",
    "password": "AdminSecure123!"
  }'
```

➡️ **Garder le TOKEN pour les autres requêtes** ⬇️

---

## 👥 UTILISATEURS - Upload avec Image

### ✅ Cas 1: Créer un Utilisateur SERVEUR avec Image

**Endpoint:** `POST http://localhost:8000/user`

**URL de création:**
```
POST http://localhost:8000/user
```

**Données de test:**
```
Nom: Martin
Prénom: Pierre
Email: martin.pierre@restaurant.com
Téléphone: 0612345678
Mot de passe: Password123!
Rôle: serveur
Image: À sélectionner (JPG, PNG, WEBP - max 5MB)
```

**Commande curl complète:**
```bash
curl -X POST http://localhost:8000/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "nom=Martin" \
  -F "prenom=Pierre" \
  -F "email=martin.pierre@restaurant.com" \
  -F "telephone=0612345678" \
  -F "password=Password123!" \
  -F "role=serveur" \
  -F "image=@/chemin/vers/votre/image.jpg"
```

**Remplacer:**
- `YOUR_TOKEN_HERE` → Le token reçu lors de l'authentification
- `/chemin/vers/votre/image.jpg` → Chemin vers une vraie image

**Réponse attendue (201):**
```json
{
  "_id": "66f8a1b2c3d4e5f6g7h8i9j0",
  "nom": "Martin",
  "prenom": "Pierre",
  "email": "martin.pierre@restaurant.com",
  "telephone": "0612345678",
  "role": "serveur",
  "image": "1727094234567-849263847.jpg",
  "createdAt": "2026-09-08T10:30:45.123Z"
}
```

**L'image uploadée est accessible à:**
```
http://localhost:8000/uploads/users/1727094234567-849263847.jpg
```

---

### ✅ Cas 2: Créer un Utilisateur CAISSIER avec Image

**Endpoint:** `POST http://localhost:8000/user`

**Données de test:**
```
Nom: Durand
Prénom: Sophie
Email: sophie.durand@restaurant.com
Téléphone: 0698765432
Mot de passe: SecurePass456!
Rôle: caissier
Image: À sélectionner
```

**Commande curl:**
```bash
curl -X POST http://localhost:8000/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "nom=Durand" \
  -F "prenom=Sophie" \
  -F "email=sophie.durand@restaurant.com" \
  -F "telephone=0698765432" \
  -F "password=SecurePass456!" \
  -F "role=caissier" \
  -F "image=@/chemin/vers/image2.jpg"
```

---

### ✅ Cas 3: Créer un Utilisateur SANS Image

**Endpoint:** `POST http://localhost:8000/user`

**Données de test:**
```
Nom: Lefebvre
Prénom: Marc
Email: marc.lefebvre@restaurant.com
Téléphone: 0645123789
Mot de passe: NoImage789!
Rôle: serveur
```

**Commande curl:**
```bash
curl -X POST http://localhost:8000/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "nom=Lefebvre" \
  -F "prenom=Marc" \
  -F "email=marc.lefebvre@restaurant.com" \
  -F "telephone=0645123789" \
  -F "password=NoImage789!" \
  -F "role=serveur"
```

---

### ✅ Cas 4: Mettre à Jour un Utilisateur (Remplacer l'Image)

**Endpoint:** `PUT http://localhost:8000/user/{userId}`

**Remplacer `{userId}` par l'ID reçu lors de la création**

**Données de test:**
```
Nom: Martin_Updated
Téléphone: 0687654321
Image: À sélectionner (nouvelle image)
```

**Commande curl:**
```bash
curl -X PUT http://localhost:8000/user/66f8a1b2c3d4e5f6g7h8i9j0 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "nom=Martin_Updated" \
  -F "telephone=0687654321" \
  -F "image=@/chemin/vers/nouvelle_image.jpg"
```

**Note:** L'ancienne image est automatiquement supprimée!

---

### ✅ Cas 5: Récupérer les Détails d'un Utilisateur

**Endpoint:** `GET http://localhost:8000/user/{userId}`

**Commande curl:**
```bash
curl -X GET http://localhost:8000/user/66f8a1b2c3d4e5f6g7h8i9j0 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Réponse:**
```json
{
  "id": "66f8a1b2c3d4e5f6g7h8i9j0",
  "nom": "Martin",
  "email": "martin.pierre@restaurant.com",
  "prenom": "Pierre",
  "image": "1727094234567-849263847.jpg",
  "telephone": "0612345678"
}
```

**Image accessible à:**
```
http://localhost:8000/uploads/users/1727094234567-849263847.jpg
```

---

### ✅ Cas 6: Récupérer TOUS les Utilisateurs (Pagination)

**Endpoint:** `GET http://localhost:8000/user?page=1&limit=20`

**Commande curl:**
```bash
curl -X GET "http://localhost:8000/user?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### ✅ Cas 7: Supprimer un Utilisateur

**Endpoint:** `DELETE http://localhost:8000/user/{userId}`

**Commande curl:**
```bash
curl -X DELETE http://localhost:8000/user/66f8a1b2c3d4e5f6g7h8i9j0 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Note:** L'image est automatiquement supprimée du serveur!

---

## 🍽️ PLATS - Upload avec Image

### ⚠️ ÉTAPE 1: Créer une Catégorie D'abord

**Endpoint:** `POST http://localhost:8000/categori/creation`

```bash
curl -X POST http://localhost:8000/categori/creation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "nom": "Entrées",
    "description": "Les plats d'\''entrée de notre restaurant"
  }'
```

**Réponse (copier l'_id):**
```json
{
  "_id": "66f8a2c3d4e5f6g7h8i9j0k1",
  "nom": "Entrées",
  "description": "Les plats d'entrée de notre restaurant",
  "createdAt": "2026-09-08T10:35:20.000Z"
}
```

➡️ **Garder cet ID pour créer les plats**

---

### ✅ Cas 1: Créer un Plat PIZZA avec Image

**Endpoint:** `POST http://localhost:8000/plat/creation`

**Données de test:**
```
Nom: Pizza Margherita
Description: Pizza classique avec sauce tomate, mozzarella et basilic frais
Prix: 12.50
Disponible: true
Catégorie: 66f8a2c3d4e5f6g7h8i9j0k1 (l'ID de catégorie créée)
Image: À sélectionner (JPG, PNG, WEBP - max 5MB)
```

**Commande curl complète:**
```bash
curl -X POST http://localhost:8000/plat/creation \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "nom=Pizza Margherita" \
  -F "description=Pizza classique avec sauce tomate, mozzarella et basilic frais" \
  -F "prix=12.50" \
  -F "disponible=true" \
  -F "categori=66f8a2c3d4e5f6g7h8i9j0k1" \
  -F "image=@/chemin/vers/pizza.jpg"
```

**Réponse attendue (201):**
```json
{
  "_id": "66f8a3d4e5f6g7h8i9j0k1l2",
  "nom": "Pizza Margherita",
  "description": "Pizza classique avec sauce tomate, mozzarella et basilic frais",
  "prix": 12.50,
  "disponible": true,
  "categori": "66f8a2c3d4e5f6g7h8i9j0k1",
  "image": "1727094540987-291847392.jpg",
  "createdAt": "2026-09-08T10:39:00.000Z"
}
```

**L'image du plat est accessible à:**
```
http://localhost:8000/uploads/plats/1727094540987-291847392.jpg
```

---

### ✅ Cas 2: Créer un Plat BURGER avec Image

**Données de test:**
```
Nom: Burger Deluxe
Description: Burger maison avec steak, bacon, cheddar et sauce spéciale
Prix: 14.99
Disponible: true
Catégorie: 66f8a2c3d4e5f6g7h8i9j0k1
Image: À sélectionner
```

**Commande curl:**
```bash
curl -X POST http://localhost:8000/plat/creation \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "nom=Burger Deluxe" \
  -F "description=Burger maison avec steak, bacon, cheddar et sauce spéciale" \
  -F "prix=14.99" \
  -F "disponible=true" \
  -F "categori=66f8a2c3d4e5f6g7h8i9j0k1" \
  -F "image=@/chemin/vers/burger.jpg"
```

---

### ✅ Cas 3: Créer un Plat PÂTES avec Image

**Données de test:**
```
Nom: Pâtes Carbonara
Description: Pâtes fraîches avec sauce carbonara, guanciale et parmesan
Prix: 11.99
Disponible: true
Catégorie: 66f8a2c3d4e5f6g7h8i9j0k1
Image: À sélectionner
```

**Commande curl:**
```bash
curl -X POST http://localhost:8000/plat/creation \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "nom=Pâtes Carbonara" \
  -F "description=Pâtes fraîches avec sauce carbonara, guanciale et parmesan" \
  -F "prix=11.99" \
  -F "disponible=true" \
  -F "categori=66f8a2c3d4e5f6g7h8i9j0k1" \
  -F "image=@/chemin/vers/pates.jpg"
```

---

### ✅ Cas 4: Créer un Plat SALADE SANS Image

**Données de test:**
```
Nom: Salade César
Description: Salade fraîche avec laitue, œuf, bacon et sauce César maison
Prix: 9.99
Disponible: true
Catégorie: 66f8a2c3d4e5f6g7h8i9j0k1
```

**Commande curl:**
```bash
curl -X POST http://localhost:8000/plat/creation \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "nom=Salade César" \
  -F "description=Salade fraîche avec laitue, œuf, bacon et sauce César maison" \
  -F "prix=9.99" \
  -F "disponible=true" \
  -F "categori=66f8a2c3d4e5f6g7h8i9j0k1"
```

---

### ✅ Cas 5: Mettre à Jour un Plat (Changer l'Image)

**Endpoint:** `PUT http://localhost:8000/plat/{platId}`

**Données de test:**
```
Nom: Pizza Margherita Premium
Description: Pizza premium avec tomates fraîches, mozzarella di bufala
Image: À sélectionner (nouvelle image)
```

**Commande curl:**
```bash
curl -X PUT http://localhost:8000/plat/66f8a3d4e5f6g7h8i9j0k1l2 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "nom=Pizza Margherita Premium" \
  -F "description=Pizza premium avec tomates fraîches, mozzarella di bufala" \
  -F "image=@/chemin/vers/pizza_premium.jpg"
```

**Note:** L'ancienne image est automatiquement supprimée!

---

### ✅ Cas 6: Récupérer TOUS les Plats

**Endpoint:** `GET http://localhost:8000/plat`

**Commande curl:**
```bash
curl -X GET http://localhost:8000/plat \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Réponse:**
```json
[
  {
    "_id": "66f8a3d4e5f6g7h8i9j0k1l2",
    "nom": "Pizza Margherita",
    "description": "Pizza classique...",
    "prix": 12.50,
    "disponible": true,
    "categori": "66f8a2c3d4e5f6g7h8i9j0k1",
    "image": "1727094540987-291847392.jpg",
    "createdAt": "2026-09-08T10:39:00.000Z"
  },
  ...
]
```

**Images accessibles à:**
```
http://localhost:8000/uploads/plats/1727094540987-291847392.jpg
```

---

### ✅ Cas 7: Récupérer un Plat par ID

**Endpoint:** `GET http://localhost:8000/plat/{platId}`

**Commande curl:**
```bash
curl -X GET http://localhost:8000/plat/66f8a3d4e5f6g7h8i9j0k1l2 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### ✅ Cas 8: Supprimer un Plat

**Endpoint:** `DELETE http://localhost:8000/plat/{platId}`

**Commande curl:**
```bash
curl -X DELETE http://localhost:8000/plat/66f8a3d4e5f6g7h8i9j0k1l2 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Note:** L'image est automatiquement supprimée!

---

## 🧪 RÉSUMÉ DES URLs

### URLs Utilisateurs
| Action | Méthode | URL | Auth |
|--------|---------|-----|------|
| Créer | POST | `http://localhost:8000/user` | ✅ Admin |
| Lister | GET | `http://localhost:8000/user?page=1&limit=20` | ✅ Admin |
| Détails | GET | `http://localhost:8000/user/{id}` | ✅ Oui |
| Mettre à jour | PUT | `http://localhost:8000/user/{id}` | ✅ Oui |
| Supprimer | DELETE | `http://localhost:8000/user/{id}` | ✅ Admin |

**Dossier des uploads:** `http://localhost:8000/uploads/users/`

---

### URLs Plats
| Action | Méthode | URL | Auth |
|--------|---------|-----|------|
| Créer | POST | `http://localhost:8000/plat/creation` | ✅ Admin |
| Lister | GET | `http://localhost:8000/plat` | ✅ Oui |
| Détails | GET | `http://localhost:8000/plat/{id}` | ✅ Oui |
| Mettre à jour | PUT | `http://localhost:8000/plat/{id}` | ✅ Admin |
| Supprimer | DELETE | `http://localhost:8000/plat/{id}` | ✅ Admin |

**Dossier des uploads:** `http://localhost:8000/uploads/plats/`

---

## ⚠️ TESTS D'ERREURS (Validation)

### ❌ Test 1: Image Non Autorisée

**Essayer d'uploader un fichier PDF:**
```bash
curl -X POST http://localhost:8000/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "nom=Test" \
  -F "prenom=User" \
  -F "email=test@test.com" \
  -F "telephone=0123456789" \
  -F "password=Password123!" \
  -F "role=serveur" \
  -F "image=@/chemin/vers/document.pdf"
```

**Réponse attendue (400):**
```json
{
  "message": "Type de fichier non autorisé. Seules les images (jpeg, png, webp) sont acceptées !"
}
```

---

### ❌ Test 2: Fichier Trop Volumineux

**Essayer d'uploader une image > 5MB:**
```bash
curl -X POST http://localhost:8000/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "nom=Test" \
  -F "prenom=User" \
  -F "email=test@test.com" \
  -F "telephone=0123456789" \
  -F "password=Password123!" \
  -F "role=serveur" \
  -F "image=@/chemin/vers/grosse_image.jpg"
```

**Réponse attendue (400):**
```json
{
  "message": "Erreur d'upload: File too large"
}
```

---

### ❌ Test 3: Champs Manquants

**Essayer de créer sans email:**
```bash
curl -X POST http://localhost:8000/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "nom=Test" \
  -F "prenom=User" \
  -F "telephone=0123456789" \
  -F "password=Password123!" \
  -F "role=serveur" \
  -F "image=@/chemin/vers/image.jpg"
```

**Réponse attendue (400):**
```json
{
  "message": "Erreur de validation : L'email est requis"
}
```

---

### ❌ Test 4: Email Invalide

```bash
curl -X POST http://localhost:8000/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "nom=Test" \
  -F "prenom=User" \
  -F "email=invalidemail" \
  -F "telephone=0123456789" \
  -F "password=Password123!" \
  -F "role=serveur" \
  -F "image=@/chemin/vers/image.jpg"
```

**Réponse attendue (400):**
```json
{
  "message": "Erreur de validation : L'email n'est pas valide"
}
```

---

## 📋 CHECKLIST DE TEST

- [ ] Créer une catégorie
- [ ] Créer utilisateur WITH image (martini.pierre@restaurant.com)
- [ ] Vérifier l'image à `http://localhost:8000/uploads/users/[filename].jpg`
- [ ] Créer utilisateur WITHOUT image (marc.lefebvre@restaurant.com)
- [ ] Mettre à jour utilisateur avec nouvelle image
- [ ] Créer plat WITH image (Pizza Margherita)
- [ ] Vérifier l'image à `http://localhost:8000/uploads/plats/[filename].jpg`
- [ ] Créer plat WITHOUT image (Salade César)
- [ ] Mettre à jour plat avec nouvelle image
- [ ] Supprimer utilisateur (vérifier que l'image est supprimée)
- [ ] Supprimer plat (vérifier que l'image est supprimée)
- [ ] Tester upload fichier PDF (doit échouer)
- [ ] Tester upload fichier > 5MB (doit échouer)

---

## 💡 ASTUCES

### Obtenir facilement un fichier test
```bash
# Créer une petite image de test (1x1 pixel rouge)
convert -size 1x1 xc:red test.jpg

# Ou copier une image existante
cp ~/Bureau/image.jpg ./test.jpg

# Ou télécharger une image
wget https://via.placeholder.com/200/FF0000/FFFFFF?text=Test -O test.jpg
```

### Tester avec Postman au lieu de curl
1. Importer la collection Postman
2. Dans la variable d'env, ajouter `{{token}}` avec votre token JWT
3. Utiliser l'onglet "Body" → "form-data"
4. Sélectionner le type "File" pour les images

### Voir les fichiers uploadés
```bash
ls -la uploads/users/
ls -la uploads/plats/
```

### Tester directement dans le navigateur
```
http://localhost:8000/uploads/users/1727094234567-849263847.jpg
http://localhost:8000/uploads/plats/1727094540987-291847392.jpg
```

---

**✅ Prêt à tester!** 🚀

