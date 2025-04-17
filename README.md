# 🎉 Générateur de Mèmes

Bienvenue dans le **Générateur de Mèmes**, une application web simple et amusante développée avec **React et Node.js**. Elle vous permet de :

- Télécharger vos propres images  
- Ajouter du texte personnalisé  
- Générer des mèmes uniques  
- Les sauvegarder et les partager

---

## ✨ Fonctionnalités

✅ Télécharger une image depuis votre appareil  
✅ Ajouter un texte personnalisé  
✅ Voir un aperçu en direct du mème  
✅ Générer et télécharger le mème final  
✅ Sauvegarder les mèmes localement dans votre navigateur  
✅ Consulter la galerie de mèmes sauvegardés

## ✨ Fonctionnalité supplémentaire
✅ Supprimer un mème
---

## 🛠️ Technologies utilisées

  Frontend : React (avec Vite), HTML/CSS

  Backend : Node.js, Express

  Stockage d'images : Cloudinary

  Dépendances :

    axios : pour les requêtes HTTP

    multer : pour la gestion des fichiers uploadés

    form-data : pour la création de formulaires multipart

    cors : pour gérer les requêtes cross-origin

    dotenv : pour la gestion des variables d'environnement



---

## 📁 Détails des fichiers

## 📁 Frontend
- **`MemeEditor.jsx`** : Composant qui permet à l'utilisateur de créer un mème à partir d'une image et d’un texte.  
- **`Gallery.jsx`** : Composant qui affiche les mèmes enregistrés et les actions possibles.  
- **`App.jsx`** : Composant principal qui gère la navigation entre les différentes vues.
- **`package.json`** : Contient l'ensemble de dépendances nécessaires.

## 📁 Backend
- **`server.js`** : Fichier d'entrée qui gère le serveur et la logique métier.
- **`package.json`** : Contient l'ensemble de dépendances nécessaires.
---

## 🚀 Installation

1. **Clonez ce dépôt** :

```bash
git clone https://github.com/Pamady/meme-projet.git
cd meme-projet

2. **Installer les dépendances frontend et backend** :
  npm install

3. **Configurer les variables d'environnement**

Crée un fichier .env à la racine du projet avec les variables suivantes :

  CLOUDINARY_CLOUD_NAME=ton_nom_de_cloud
  CLOUDINARY_API_KEY=ta_clé_api
  CLOUDINARY_API_SECRET=ton_secret_api
  CLOUDINARY_UPLOAD_PRESET=ton_upload_preset
  PORT=3000

4. Lancer le serveur  :
  npm start

5. Lancer le frontend  :
  npm run dev

📁 Structure du projet

Meme-Generator/
├── backend/
│   ├── server.js         # Serveur Express
│   └── .env              # Variables d'environnement
│   └── package.json      # Dépendances
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/   # Composants React
│       ├── styles/       # Fichiers CSS
│       └── App.js        # Composant principal
│   └── package.json      # Dépendances
└── README.md

🔐 Authentification et gestion des utilisateurs

  L'application utilise le LocalStorage du navigateur pour stocker un identifiant utilisateur unique (userId). Cet identifiant est généré lors de la première visite et est utilisé pour associer les mèmes créés à l'utilisateur.

☁️ Intégration avec Cloudinary

  Les images sont stockées sur Cloudinary avec un contexte personnalisé contenant le caption (texte du mème) et le userId. Cela permet de filtrer les mèmes par utilisateur lors de la récupération des images.

📬 API Endpoints

  GET /images:userId

  Récupère les images stockées sur Cloudinary avec leur contexte.


POST /images/upload

Upload une nouvelle image sur Cloudinary avec un texte personnalisé.

Corps de la requête :

  .file : Fichier image

  .caption : Texte du mème

  .userId : Identifiant de l'utilisateur



DELETE /images/:publicId

  Supprime une image de Cloudinary en utilisant son public_id.

  