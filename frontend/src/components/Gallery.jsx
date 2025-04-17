import React, { useEffect, useState } from "react";
import {
  FaTrash,
  FaShareAlt,
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaDownload,
} from "react-icons/fa";
import "../styles/Gallery.css";

const Gallery = () => {
  const [memes, setMemes] = useState([]);
  const [shareMenuOpen, setShareMenuOpen] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  
  useEffect(() => {
    const loadMemes = async () => {
      const allMemes = await fetchMemesFromCloudinary();
      saveMemesToLocalStorage(allMemes);
      setMemes(allMemes);
    };
    if (!localStorage.getItem("userId")) {
      const userId = `user-${Date.now()}`;
      localStorage.setItem("userId", userId);
    }
    loadMemes();
  }, []);

  const fetchMemesFromCloudinary = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`https://meme-projet-1.onrender.com/images?userId=${userId}`);
      if (!response.ok) throw new Error("Erreur de récupération");
  
      const memes = await response.json();
  
      return memes;
    } catch (error) {
      console.error("Erreur Cloudinary:", error);
      return [];
    }
  };
  

// Enregistre un tableau de memes dans localStorage
const saveMemesToLocalStorage = (memes) => {
  // Écrase les anciens memes par les nouveaux récupérés
  localStorage.setItem("memes", JSON.stringify(memes));
};

  const deleteMeme = async (publicId) => {
    
    if (!window.confirm("Es-tu sûr(e) de vouloir supprimer ce mème ?")) return;
  
    try {
      const res = await fetch(`https://meme-projet-1.onrender.com/images/${publicId}`, {
        method: "DELETE",
      });
      const data = await res.json();
  
      // Mise à jour des mèmes côté client
      const updated = memes.filter((meme) => meme.public_id !== publicId);
      setMemes(updated);
      localStorage.setItem("memes", JSON.stringify(updated));
  
      showTemporaryMessage("✅ Mème supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };
  

  
  const toggleShareMenu = (index) => {
    setShareMenuOpen(shareMenuOpen === index ? null : index);
  };

  const downloadMeme = async (meme) => {
    try {
      const encodedText = meme.text ? encodeURIComponent(meme.text) : "";
      const gifUrl = meme.url;
      const extension = gifUrl.split(".").pop();
      const publicId = gifUrl.split("/").pop().split(".")[0];

      const finalUrl = encodedText
        ? `https://res.cloudinary.com/duu2xloea/image/upload/l_text:Arial_40_bold:${encodedText},g_center,y_20/${publicId}.${extension}`
        : `https://res.cloudinary.com/duu2xloea/image/upload/g_center,y_20/${publicId}.${extension}`;

      const response = await fetch(finalUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.download = `meme-${Date.now()}.${extension}`;
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Erreur lors du téléchargement.");
      console.error(error);
    }
  };
  // Affiche un message temporaire
  const showTemporaryMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const ShareMenu = ({ url }) => (
    <div className="share-menu">
      <div className="share-menu-icons">
        <FaFacebookF
          style={{ color: "#3b5998", cursor: "pointer" }}
          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")}
        />
        <FaTwitter
          style={{ color: "#00acee", cursor: "pointer" }}
          onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, "_blank")}
        />
        <FaWhatsapp
          style={{ color: "#25D366", cursor: "pointer" }}
          onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, "_blank")}
        />
      </div>
    </div>
  );

  const MemeActions = ({ meme, index }) => (
    <div className="meme-actions">
      <button onClick={() => deleteMeme(meme.public_id)} title="Supprimer">
        <FaTrash />
      </button>
      <button onClick={() => downloadMeme(meme)} title="Télécharger">
        <FaDownload />
      </button>
      <div style={{ position: "relative" }}>
        <button onClick={() => toggleShareMenu(index)} title="Partager">
          <FaShareAlt />
        </button>
        {shareMenuOpen === index && <ShareMenu url={meme.url} />}
      </div>
    </div>
  );

  return (
    <div className="gallery-container">
      <h2 className="gallery-title">Galerie des mèmes</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {memes.length === 0 ? (
        <p className="gallery-empty">Aucun mème pour le moment 😢</p>
      ) : (
        <div className="gallery-grid">
          {memes.map((meme, index) => (
            <div key={index} className="meme-card meme-wrapper">
              <div className="meme-text-centered">{meme.text}</div>
              <img src={meme.url} alt={`meme-${index}`} className="meme-image" />
              <MemeActions meme={meme} index={index} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
