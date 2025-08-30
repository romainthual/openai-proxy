const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Autoriser toutes les origines (tu peux limiter plus tard si besoin)
app.use(cors());
app.use(express.json());

// Route principale pour le proxy
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message manquant" });
    }

    // Appel API OpenAI
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // ou "gpt-4" si ton compte l'autorise
        messages: [{ role: "user", content: userMessage }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // ta clé dans Railway (variables d'env)
        },
      }
    );

    // Récupération de la réponse
    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Erreur API OpenAI:", error.response?.data || error.message);
    res.status(500).json({ error: "Erreur lors de l'appel à OpenAI" });
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Proxy démarré sur http://localhost:${PORT}`);
});
