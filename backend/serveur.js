import serveur from "./app.js"

// mise en ecoute du serveur sur le port 8000
const PORT = process.env.PORT || 8000;
serveur.listen(PORT, () => {
    console.log(`le serveur est en ecoute sur le port ${PORT}`)
})

