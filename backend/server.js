require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const frontendUrl = "https://meme-projet-2.onrender.com";
app.use(cors(
  {
    origin:frontendUrl
  }
));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

   
  app.get("/images", async (req, res) => {
    const userId = req.query.userId;
    // Cloudinary authentication
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  
    try {
      // Obtenir des images de l'API Cloudinary avec « include_context » défini sur true
      const response = await axios.get(
        `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`, 
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
          params: {
            context: true, 
          },
        }
      );
    
      const images = response.data.resources
      .filter((img) => img.context?.custom?.userId === userId)
      .map((img) => {
        return {
          url: img.secure_url,
          text: img.context?.custom?.caption || "",
          public_id: img.public_id,
        };
      });

      res.json(images);
  
    } catch (error) {
    
      console.error("Error fetching images:", error.message);
      res.status(500).json({ message: "Error fetching images" });
    }
  });
  
  
  

// Route d’upload vers Cloudinary
app.post('/images/upload', upload.single('file'), async (req, res) => {
  try {
    const memeText = req.body.caption || "";
    const userId = req.body.userId;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
  

    const form = new FormData();
    form.append("file", fileBuffer, fileName);
    form.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);
    form.append("cloud_name", cloudName);
    form.append("context", `userId=${userId}|caption=${memeText}`);
    form.append("resource_type", "image");
    

    // Envoi à Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      form,
      { headers: form.getHeaders() }
    );

    res.status(200).json({
      url: response.data.secure_url,
      text: memeText
    });
  } catch (error) {
    console.error("Erreur upload:", error.message);
    res.status(500).json({ message: "Erreur lors de l’upload" });
  }
});


app.delete("/images/:publicId", async (req, res) => {
  const publicId = req.params.publicId;
  const auth = {
    username: apiKey,
    password: apiSecret,
  };

  try {
    const response = await axios.delete(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`,
      {
        auth,
        data: {
          public_ids: [publicId]
        }
      }
    );

    res.status(200).json({ message: "Image supprimée avec succès" });
  } catch (error) {
    console.error("Erreur suppression:", error.response?.data || error.message);
    res.status(500).json({ message: "Erreur lors de la suppression de l’image" });
  }
});

app.listen(PORT, '0.0.0.0',() => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);

});
