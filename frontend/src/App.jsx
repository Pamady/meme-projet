import React, { useState } from "react";
import MemeEditor from "./components/MemeEditor";
import Gallery from "./components/Gallery";
import "./App.css";


function App() {
  const [view, setView] = useState("");

  const renderView = () => {
    if (view === "editor") return <MemeEditor />;
    else if (view === "gallery") return <Gallery />;
    else return null;
  };


  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>🎭 Générateur de Mèmes</h1>

      {view != "editor" && view != "gallery" ?
        (
          <div style={{ marginBottom: "10px" }}>
            <button
              onClick={() => setView("editor")}
              className="my-button editor">Créer un mème
            </button>
            <button
              onClick={() => setView("gallery")}
              className="my-button gallery">Galerie
            </button>
          </div>
        ) :
        (
          <button
            onClick={() => setView("")}
            className="my-button gallery">Retour
          </button>
        )
      }

      <hr />

      <div>{renderView()}</div>
    </div>
  );

}

export default App;
