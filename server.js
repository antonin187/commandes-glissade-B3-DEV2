const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 8000;

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://invite:guest@cluster0.o82caff.mongodb.net/Glissade?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const commandeSchema = new mongoose.Schema({
  date: String,
  acheteur: {
    nom: String,
    email: String,
    adresse: {
      rue: String,
      ville: String,
      pays: String,
      zipCode: String,
    },
    telephone: String,
  },
  adresseLivraison: {
    rue: String,
    ville: String,
    pays: String,
    zipCode: String,
  },
  articles: [
    {
      reference: String,
      nom: String,
      description: String,
      prix: Number,
      quantité: Number,
      etat: String,
      vendeur: {
        nom: String,
        email: String,
        telephone: String,
      },
    },
  ],
  totalHT: Number,
  fraisDePort: Number,
  reduction: Number,
  taxe: Number,
  totalTTC: Number,
  modePaiement: String,
  statut: String,
});

const Commandes = mongoose.model("Commandes", commandeSchema);

// app.get("/", (req, res) => {
//   res.set("Content-Type", "text/html");
//   res.send("Hello world !!");
// });

app.get("/commandes", async (req, res) => {
  try {
    const commandes = await Commandes.find({});
    res.send(commandes);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.get("/commandes/outOf/:pays", async (req, res) => {
  let pays = req.params.pays;
  try {
    const commandes = await Commandes.find({
      "adresseLivraison.pays": { $ne: `${pays}` },
    });
    res.send(commandes);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log("Server app listening on port " + port);
});
