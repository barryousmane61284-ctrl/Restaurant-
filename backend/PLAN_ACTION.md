# 📌 PLAN D'ACTION - CORRECTIONS PRIORITAIRES

## ✅ CORRECTIONS À APPLIQUER EN ORDRE DE PRIORITÉ

---

## 🔴 PRIORITÉ 1 - ERREURS BLOQUANTES (Appliquer IMMÉDIATEMENT)

### 1.1 Créer le fichier manquant: `commande/validate/commande.validate.js`

**Problème:** Le fichier est importé mais n'existe pas → Erreur au démarrage

**Fichier à créer:**
```javascript
// commande/validate/commande.validate.js
import yup from 'yup';

const commandeschema = yup.object().shape({
    id_user: yup.string().required("L'ID utilisateur est requis"),
    id_client: yup.string().required("L'ID client est requis"),
    plat: yup.array().of(
        yup.object().shape({
            id_plat: yup.string().required("L'ID plat est requis"),
            quantite: yup.number().required("La quantité est requise").positive(),
            prixunitaire: yup.number().required("Le prix unitaire est requis").positive()
        })
    ).required("Au moins un plat est requis"),
    total: yup.number().required("Le total est requis").positive(),
    status: yup.string().oneOf(["en_cours", "terminée", "annulée", "en_attente"])
});

export default commandeschema;
```

---

### 1.2 Créer un middleware global de gestion d'erreurs

**Fichier à créer:** `commun/middleware/errorHandler.js`

```javascript
// commun/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error("Erreur:", err);
    
    const status = err.status || 500;
    const message = err.message || "Une erreur interne est survenue";
    
    res.status(status).json({ 
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export default errorHandler;
```

**À ajouter dans app.js:**
```javascript
import errorHandler from './commun/middleware/errorHandler.js';

// ... autres middlewares ...

// Mettre EN DERNIER
serveur.use(errorHandler);
```

---

### 1.3 Valider les IDs ObjectId dans TOUS les repositories

**Action:** Ajouter cette vérification dans:
- `client/repository/client.repository.js`
- `plat/repository/plat.repository.js`
- `commande/repository/commande.repository.js`
- `facture/repository/facture.repository.js`

**Code à ajouter** (copier depuis user.repository.js):
```javascript
import { Types } from "mongoose";

// Au début de chaque méthode getById, update, delete:
static getById = async(id) => {
    if (!Types.ObjectId.isValid(id)) {
        const error = new Error("ID invalide");
        error.status = 400;
        throw error;
    }
    return await modelModel.findById(id);
}
```

---

### 1.4 Corriger les contrôleurs pour utiliser error.status

**Action:** Remplacer TOUS les `res.status(500)` par:
```javascript
const envoyerErreur = (res, error) => {
    res.status(error.status || 500).json({
        message: error.message || "Une erreur interne est survenue"
    });
};

// Dans les catch:
catch (error) {
    envoyerErreur(res, error);
}
```

**Fichiers à corriger:**
- `client/controller/client.controller.js`
- `commande/controller/commande.controller.js`
- `facture/controller/facture.controller.js`
- `plat/controller/plat.controller.js` (partiellement)
- `categori/controller/categori.controller.js`

---

## 🟠 PRIORITÉ 2 - AMÉLIORATIONS IMPORTANTES (À faire cette semaine)

### 2.1 Corriger les schémas de validation

#### 2.1.1 `client/validate/client.validate.js`
```javascript
import yup from 'yup';

const clientschema = yup.object().shape({
    nom: yup.string().required("Le nom est requis"),
    prenom: yup.string().required("Le prénom est requis"),
    matricule: yup.string().required("Le matricule est requis"),
    telephone: yup.string().required("Le numéro de téléphone est requis"),
    email: yup.string().email("L'email est invalide").required("L'email est requis"),
    adresse: yup.string().required("L'adresse est requise")
});

export default clientschema;
```

#### 2.1.2 `user/validate/user.validate.js`
**PROBLÈME:** Admin ne peut pas être créé par l'API, mais seulement en base de données

```javascript
import yup from "yup";

export const userCreationSchema = yup.object().shape({
    nom: yup.string().required("Le nom est requis"),
    prenom: yup.string().required("Le prénom est requis"),
    email: yup.string().email("L'email est invalide").required("L'email est requis"),
    telephone: yup.string().required("Le numéro de téléphone est requis"),
    password: yup.string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .required("Le mot de passe est requis"),
    role: yup.string()
        .oneOf(["serveur", "caissier"], "Le rôle doit être serveur ou caissier")
        .required("Le rôle est requis")
});

export const userUpdateSchema = yup.object().shape({
    nom: yup.string(),
    prenom: yup.string(),
    email: yup.string().email("L'email est invalide"),
    telephone: yup.string(),
    role: yup.string().oneOf(["serveur", "caissier"])
});
```

---

### 2.2 Ajouter des enums aux modèles Mongoose

#### Ajouter dans `commande/model/commande.model.js`:
```javascript
status: {
    type: String,
    enum: ["en_cours", "terminée", "annulée", "en_attente"],
    default: "en_attente"
}
```

#### Ajouter dans `facture/model/facture.model.js`:
```javascript
statut: {
    type: String,
    enum: ["payée", "impayée", "annulée", "en_attente"],
    required: true
},
mode_paiement: {
    type: String,
    enum: ["especes", "carte", "cheque", "virement"],
    required: true
}
```

---

### 2.3 Normaliser le hashage des mots de passe

**Changer dans `user/service/user.service.js`:**
```javascript
// Avant:
const motDePasseHash = await bcrypt.hash(data.password, 10);

// Après:
const motDePasseHash = await bcrypt.hash(data.password, 12);
```

---

### 2.4 Ajouter la pagination partout

**Ajouter aux contrôleurs:**

```javascript
// client/controller/client.controller.js
static getAll = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        res.status(200).json(await clientservice.getAll(page, limit));
    } catch (error) {
        envoyerErreur(res, error);
    }
}
```

**Mettre à jour les services et repositories également**

---

### 2.5 Valider les références en base de données

**Exemple dans `commande/service/commande.service.js`:**
```javascript
import userrepository from "../../user/repository/user.repository.js";
import clientrepository from "../../client/repository/client.repository.js";
import platrepository from "../../plat/repository/plat.repository.js";

static creation = async(data) => {
    // Valider l'utilisateur
    const user = await userrepository.getById(data.id_user);
    if (!user) throw new Error("Utilisateur introuvable");
    
    // Valider le client
    const client = await clientrepository.getById(data.id_client);
    if (!client) throw new Error("Client introuvable");
    
    // Valider les plats
    for (let plat of data.plat) {
        const platExiste = await platrepository.getById(plat.id_plat);
        if (!platExiste) throw new Error(`Plat ${plat.id_plat} introuvable`);
    }
    
    return await commanderepository.creation(data);
}
```

---

## 🟡 PRIORITÉ 3 - AMÉLIORATION DE LA QUALITÉ (À faire si temps)

### 3.1 Ajouter les routes manquantes

**Ajouter dans `authentification/route/auth.route.js`:**
```javascript
routeauth.post("/logout", authMiddleware, authcontroller.logout);
routeauth.post("/refresh-token", authcontroller.refreshToken);
```

**Ajouter les méthodes dans `authentification/controller/auth.controller.js`:**
```javascript
static logout = async(req, res) => {
    // Optionnel: Ajouter le token à une liste noire
    res.status(200).json({ message: "Déconnecte avec succès" });
}

static refreshToken = async(req, res) => {
    try {
        const { refreshToken } = req.body;
        const decoded = JwtUtils.verifyRefreshToken(refreshToken);
        const newAccessToken = JwtUtils.generateAccessToken({
            id: decoded.id,
            role: decoded.role
        });
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(401).json({ message: "Token invalide" });
    }
}
```

---

### 3.2 Ajouter la documentation Swagger

**Créer `swagger.js` à la racine:**
```javascript
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Gestion Restaurant',
            version: '1.0.0'
        },
        servers: [{ url: 'http://localhost:8000' }]
    },
    apis: ['./*/route/*.route.js']
};

const specs = swaggerJsdoc(options);
export const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve);
    app.get('/api-docs', swaggerUi.setup(specs));
};
```

**Ajouter dans app.js:**
```javascript
import { swaggerDocs } from './swagger.js';
swaggerDocs(serveur);
```

---

### 3.3 Ajouter un logger centralisé

**Créer `commun/utils/logger.js`:**
```javascript
export const logger = {
    info: (message) => console.log(`[INFO] ${new Date().toISOString()} - ${message}`),
    error: (message) => console.error(`[ERROR] ${new Date().toISOString()} - ${message}`),
    warn: (message) => console.warn(`[WARN] ${new Date().toISOString()} - ${message}`)
};
```

---

## 📝 CHECKSUM DE VALIDATION

Après avoir appliqué les correctifs, vérifier:

- [ ] Le serveur démarre sans erreurs
- [ ] `commande/validate/commande.validate.js` existe
- [ ] Tous les repositories valident les IDs ObjectId
- [ ] Tous les contrôleurs retournent des codes HTTP corrects
- [ ] Les schémas de validation sont corrects
- [ ] Les enums sont présents dans les modèles
- [ ] La pagination fonctionne
- [ ] Les références sont validées

---

## 🧪 TESTER APRÈS LES CORRECTIONS

```bash
# Terminal 1: Démarrer le serveur
npm run dev

# Terminal 2: Tester les endpoints
curl -X POST http://localhost:8000/authentification/inscription \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "User",
    "email": "test@example.com",
    "telephone": "123456789",
    "password": "password123"
  }'
```

