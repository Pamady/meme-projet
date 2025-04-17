import React, { useEffect, useState } from "react";
import "../styles/MemeEditor.css";

const MemeEditor = () => {
  const [imageFile, setImageFile] = useState(null);
  const [text, setText] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
      if (!localStorage.getItem("userId")) {
        const userId = `user-${Date.now()}`;
        localStorage.setItem("userId", userId);
      }
    }, []);


  // Gère le changement d’image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Affiche un message temporaire
  const showTemporaryMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  // Envoie le GIF à Cloudinary
  const uploadToCloudinary = async (memeText) => {
    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("caption", memeText);
    formData.append("userId", userId);

    const response = await fetch("https://meme-projet-1.onrender.com/images/upload", {
      method: "POST",
      body: formData,
    });


    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary upload error:", errorData);
      throw new Error("Échec du téléchargement sur Cloudinary");
    }

    const data = await response.json();
    
    return {
      url: data.url,
      text: data.text,
    };
  };

  // Enregistre dans localStorage
  const saveMemeToLocalStorage = (meme) => {
    const existingMemes = JSON.parse(localStorage.getItem("memes")) || [];
    localStorage.setItem("memes", JSON.stringify([meme, ...existingMemes]));
  }

  // Réinitialise les champs
  const resetEditor = () => {
    setImageFile(null);
    setText("");
    setPreviewUrl(null);
  };

  // Création du mème
  const handleCreateMeme = async () => {
    try {
      const meme = await uploadToCloudinary(text);
      saveMemeToLocalStorage(meme);
      showTemporaryMessage("✅ Mème généré avec succès !");
      resetEditor();
    } catch (error) {
      alert(error.message || "Erreur lors de la création du mème");
    }
  };

  return (
    <div className="meme-editor-container">
      <h2>Créer un mème</h2>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <input type="file" accept="image/*" onChange={handleImageChange} style={{"margin-top": "20px"}} />
      <br /><br />

      {imageFile && (
        <>
          <input
            type="text"
            placeholder="Texte du mème"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <br /><br />
        </>
      )}

      {previewUrl && (
        <div id="meme-preview" className="meme-preview">
          <img src={previewUrl} alt="Prévisualisation" className="preview-image" />
          <div className="meme-text">{text}</div>
        </div>
      )}

      <br /><br />
      <button
        disabled={!imageFile}
        onClick={handleCreateMeme}
        className={imageFile ? "create-meme-button" : "btn-disabled"}
      >
        Créer le mème
      </button>
    </div>
  );
};

export default MemeEditor;
