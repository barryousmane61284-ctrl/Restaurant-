import "dotenv/config";
import express, { urlencoded } from 'express';
import cnx from './config/db/db.config.js';
import routeclient from './client/route/client.route.js';
import routeplat from './plat/route/plat.route.js';
import routecategori from './categori/route/categori.route.js';
import routecommande from './commande/route/commande.route.js';
import routeuser from './user/route/user.route.js';
import routefacture from './facture/route/facture.route.js';
import routeauth from './authentification/route/auth.route.js';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
// initialisation du serveur express
 const serveur = express();
 serveur.use(cors());
 // Configuration de Helmet pour la sécurité, mais en autorisant les images cross-origin
 // (Angular tourne sur le port 4200 et l'API sur 8000, donc on doit autoriser le partage)
 serveur.use(helmet({
   crossOriginResourcePolicy: { policy: "cross-origin" },
   contentSecurityPolicy: false // Désactivé pour laisser Angular gérer ses propres ressources
 }));
 serveur.use(morgan('dev'));
 serveur.use(express.json()); //pour les requette json
 serveur.use(express.urlencoded({ extended: true}));

// Rendre le dossier "uploads" accessible publiquement pour afficher les images uploadées
serveur.use('/uploads', express.static('uploads'));

//  liaison des routes
serveur.use('/client',routeclient);
serveur.use('/plat',routeplat);
serveur.use('/categori',routecategori);
serveur.use('/commande',routecommande);
serveur.use('/user',routeuser);
serveur.use('/facture',routefacture);
serveur.use('/authentification',routeauth);

export default serveur;