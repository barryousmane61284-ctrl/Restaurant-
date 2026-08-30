# Donnees de test pour Thunder Client

Base URL : `http://localhost:8000`

Les endpoints proteges necessitent l'en-tete suivant :

```http
Authorization: Bearer {{token}}
Content-Type: application/json
```

## Ordre d'envoi

1. Connecter un compte admin existant et enregistrer son JWT dans `{{token}}`.
2. Creer les 5 fiches clients avec `POST /client/creation` en utilisant le token d'un membre du restaurant.
3. Creer les 5 utilisateurs employes avec `POST /user/creation` et enregistrer leurs `_id`.
4. Creer les 5 categories, puis enregistrer leurs `_id`.
5. Creer les 5 plats en remplacant `{{categorieId1}}` a `{{categorieId5}}`.
6. Creer les 5 commandes en remplacant les variables de clients, utilisateurs et plats.
7. Creer les 5 factures en remplacant les variables de commandes.

Les variables `{{...}}` sont des placeholders : apres chaque requete, copier l'`_id` de la reponse dans la variable correspondante de Thunder Client.

## 1. Clients

Requete : `POST /client/creation`

```json
{
  "nom": "Diallo",
  "prenom": "Aminata",
  "matricule": "CLI-001",
  "telephone": 770000001,
  "adresse": "Plateau, Dakar",
  "email": "aminata.diallo@example.com"
}
```

```json
{
  "nom": "Ndiaye",
  "prenom": "Moussa",
  "matricule": "CLI-002",
  "telephone": 770000002,
  "adresse": "Medina, Dakar",
  "email": "moussa.ndiaye@example.com"
}
```

```json
{
  "nom": "Sow",
  "prenom": "Fatou",
  "matricule": "CLI-003",
  "telephone": 770000003,
  "adresse": "Almadies, Dakar",
  "email": "fatou.sow@example.com"
}
```

```json
{
  "nom": "Ba",
  "prenom": "Ibrahima",
  "matricule": "CLI-004",
  "telephone": 770000004,
  "adresse": "Parcelles Assainies, Dakar",
  "email": "ibrahima.ba@example.com"
}
```

```json
{
  "nom": "Faye",
  "prenom": "Mariama",
  "matricule": "CLI-005",
  "telephone": 770000005,
  "adresse": "Yoff, Dakar",
  "email": "mariama.faye@example.com"
}
```

Enregistrer les identifiants clients sous `{{clientId1}}` a `{{clientId5}}`.

## 2. Utilisateurs employes

Requete : `POST /user/creation`

```json
{
  "nom": "Fall",
  "prenom": "Oumar",
  "email": "oumar.fall@example.com",
  "telephone": 771000001,
  "password": "Employe123!",
  "role": "serveur"
}
```

```json
{
  "nom": "Diop",
  "prenom": "Khady",
  "email": "khady.diop@example.com",
  "telephone": 771000002,
  "password": "Employe123!",
  "role": "serveur"
}
```

```json
{
  "nom": "Gueye",
  "prenom": "Lamine",
  "email": "lamine.gueye@example.com",
  "telephone": 771000003,
  "password": "Employe123!",
  "role": "caissier"
}
```

```json
{
  "nom": "Sarr",
  "prenom": "Awa",
  "email": "awa.sarr@example.com",
  "telephone": 771000004,
  "password": "Employe123!",
  "role": "caissier"
}
```

```json
{
  "nom": "Cisse",
  "prenom": "Mamadou",
  "email": "mamadou.cisse@example.com",
  "telephone": 771000005,
  "password": "Employe123!",
  "role": "serveur"
}
```

Enregistrer les identifiants sous `{{userId1}}` a `{{userId5}}`.

## 3. Categories

Requete : `POST /categori/creation`

```json
{ "nom": "Entrees", "description": "Plats servis avant le repas principal" }
```

```json
{ "nom": "Plats locaux", "description": "Specialites traditionnelles ouest-africaines" }
```

```json
{ "nom": "Grillades", "description": "Viandes et poissons grilles au feu" }
```

```json
{ "nom": "Desserts", "description": "Douceurs et fruits servis en fin de repas" }
```

```json
{ "nom": "Boissons", "description": "Boissons fraiches et chaudes" }
```

Enregistrer les identifiants sous `{{categorieId1}}` a `{{categorieId5}}`.

## 4. Plats

Requete : `POST /plat/creation`

```json
{
  "nom": "Salade fraicheur",
  "description": "Salade verte, tomates et mais",
  "prix": 2500,
  "disponible": true,
  "categori": "{{categorieId1}}"
}
```

```json
{
  "nom": "Thieboudienne",
  "description": "Riz au poisson et legumes",
  "prix": 6500,
  "disponible": true,
  "categori": "{{categorieId2}}"
}
```

```json
{
  "nom": "Poulet grille",
  "description": "Poulet grille avec pommes de terre",
  "prix": 7000,
  "disponible": true,
  "categori": "{{categorieId3}}"
}
```

```json
{
  "nom": "Salade de fruits",
  "description": "Melange de fruits de saison",
  "prix": 2000,
  "disponible": true,
  "categori": "{{categorieId4}}"
}
```

```json
{
  "nom": "Jus de bissap",
  "description": "Boisson fraiche a base d'hibiscus",
  "prix": 1500,
  "disponible": true,
  "categori": "{{categorieId5}}"
}
```

Enregistrer les identifiants sous `{{platId1}}` a `{{platId5}}`.

## 5. Commandes

Requete : `POST /commande/creation`

```json
{
  "id_user": "{{userId1}}",
  "id_client": "{{clientId1}}",
  "plat": [{ "id_plat": "{{platId2}}", "quantite": 1, "prixunitaire": 6500 }],
  "total": 6500,
  "status": "en_attente"
}
```

```json
{
  "id_user": "{{userId2}}",
  "id_client": "{{clientId2}}",
  "plat": [{ "id_plat": "{{platId3}}", "quantite": 2, "prixunitaire": 7000 }],
  "total": 14000,
  "status": "en_cours"
}
```

```json
{
  "id_user": "{{userId3}}",
  "id_client": "{{clientId3}}",
  "plat": [{ "id_plat": "{{platId1}}", "quantite": 1, "prixunitaire": 2500 }, { "id_plat": "{{platId5}}", "quantite": 2, "prixunitaire": 1500 }],
  "total": 5500,
  "status": "terminée"
}
```

```json
{
  "id_user": "{{userId4}}",
  "id_client": "{{clientId4}}",
  "plat": [{ "id_plat": "{{platId4}}", "quantite": 2, "prixunitaire": 2000 }],
  "total": 4000,
  "status": "en_attente"
}
```

```json
{
  "id_user": "{{userId5}}",
  "id_client": "{{clientId5}}",
  "plat": [{ "id_plat": "{{platId2}}", "quantite": 1, "prixunitaire": 6500 }, { "id_plat": "{{platId4}}", "quantite": 1, "prixunitaire": 2000 }],
  "total": 8500,
  "status": "annulée"
}
```

Enregistrer les identifiants sous `{{commandeId1}}` a `{{commandeId5}}`.

## 6. Factures

Requete : `POST /facture/creation`

```json
{
  "id_user": "{{userId1}}",
  "id_commande": "{{commandeId1}}",
  "id_client": "{{clientId1}}",
  "montant_total": 6500,
  "statut": "payee",
  "mode_paiement": "especes"
}
```

```json
{
  "id_user": "{{userId2}}",
  "id_commande": "{{commandeId2}}",
  "id_client": "{{clientId2}}",
  "montant_total": 14000,
  "statut": "payee",
  "mode_paiement": "carte"
}
```

```json
{
  "id_user": "{{userId3}}",
  "id_commande": "{{commandeId3}}",
  "id_client": "{{clientId3}}",
  "montant_total": 5500,
  "statut": "payee",
  "mode_paiement": "wave"
}
```

```json
{
  "id_user": "{{userId4}}",
  "id_commande": "{{commandeId4}}",
  "id_client": "{{clientId4}}",
  "montant_total": 4000,
  "statut": "en_attente",
  "mode_paiement": "orange_money"
}
```

```json
{
  "id_user": "{{userId5}}",
  "id_commande": "{{commandeId5}}",
  "id_client": "{{clientId5}}",
  "montant_total": 8500,
  "statut": "annulee",
  "mode_paiement": "especes"
}
```