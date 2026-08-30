import serveur from "./app.js"

// mise en ecoute du serveur sur le port 8000
serveur.listen(8000,()=>{
    console.log("le serveur est en ecoute sur le port 8000")
})

