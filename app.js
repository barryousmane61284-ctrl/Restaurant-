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

// initialisation du serveur express
 const serveur = express();
 serveur.use(express.json()); //pour les requette json
 serveur.use(express.urlencoded({ extended: true}));

//  liaison des routes
serveur.use('/client',routeclient);
serveur.use('/plat',routeplat);
serveur.use('/categori',routecategori);
serveur.use('/commande',routecommande);
serveur.use('/user',routeuser);
serveur.use('/facture',routefacture);
serveur.use('/authentification',routeauth);

export default serveur;