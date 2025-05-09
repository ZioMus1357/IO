require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const Product = require("./models/product");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 5000;

// Środowisko
app.use(cors());
app.use(express.json());

// OpenAI
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/produkty", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Połączono z MongoDB"))
  .catch((err) => console.error("❌ Błąd MongoDB:", err));

// Scraping
const BASE_URL = "https://zakupy.biedronka.pl/";
const categories = [
  "owoce", "warzywa", "piekarnia", "nabial", "mieso", "dania-gotowe",
  //"napoje", "mrozone", "artykuly-spozywcze", "drogeria", "dla-domu",
  "dla-dzieci", "dla-zwierzat"
];

async function scrapeCategory(category) {
  const products = [];
  let page = 1;
  let lastPageProducts = [];

  while (true) {
    const url = `${BASE_URL}${category}/?page=${page}`;
    console.log(`🔎 Pobieranie: ${url}`);

    try {
      const response = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      const $ = cheerio.load(response.data);
      const productElements = $(".product-tile");

      if (productElements.length === 0) {
        console.log(`❌ Brak produktów na stronie ${page}, kończę kategorię "${category}"`);
        break;
      }

      const currentPageProducts = [];

      productElements.each((_, el) => {
        const name = $(el).find(".product-tile__name").text().trim();

        const zl = $(el).find(".price-tile__sales").clone().children().remove().end().text().trim();
        const gr = $(el).find(".price-tile__decimal").text().trim();
        const priceString = zl && gr ? `${zl}.${gr}` : null;
        const price = priceString ? parseFloat(priceString.replace(",", ".")) : null;

        if (name && price !== null) {
          currentPageProducts.push({ name, price, category });
        }
      });

      const duplicateFound = currentPageProducts.every(product =>
        lastPageProducts.some(lastProduct => lastProduct.name === product.name)
      );

      if (duplicateFound) {
        console.log(`🚨 Duplikaty – koniec kategorii "${category}"`);
        break;
      }

      products.push(...currentPageProducts);
      lastPageProducts = currentPageProducts;
      console.log(`✅ Strona ${page}: ${currentPageProducts.length} produktów`);
      page++;
    } catch (error) {
      console.error(`❗ Błąd pobierania ${category}, strona ${page}:`, error.message);
      break;
    }
  }

  return products;
}

async function scrapeAllAndSave() {
  const allProducts = [];

  for (const category of categories) {
    console.log(`📦 Kategoria: ${category}`);
    const products = await scrapeCategory(category);
    allProducts.push(...products);
  }

  try {
    await Product.deleteMany({});
    await Product.insertMany(allProducts);
    console.log(`💾 Zapisano ${allProducts.length} produktów do bazy`);
  } catch (err) {
    console.error("❌ Błąd zapisu do MongoDB:", err.message);
  }
}

// Wywołaj scraping po starcie serwera
scrapeAllAndSave();

// Endpoint – pobierz produkty
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Błąd pobierania produktów" });
  }
});

// Endpoint – przepisy z OpenAI/groq
app.post("/api/recipes", async (req, res) => {
  const selectedProducts = req.body;
  console.log("Zapytanie do API Groq...");
  console.log("Otrzymane dane:", req.body); 
  const productNames = selectedProducts.map((p) => p.name).join(", ");
  const prompt = `Wymyśl przepisy kulinarne, które można przygotować z następujących produktów: ${productNames}. Podaj przepisy w punktach.`;
  
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
    });

    const recipeText = completion.choices[0].message.content;
    console.log("📩 Odpowiedź Groq:", recipeText);
    res.json({ recipes: recipeText });
  } catch (error) {
    console.error("❌ Błąd OpenAI:", error.message);
    res.status(500).json({ error: "Błąd przy generowaniu przepisów." });
  }
});

// Start serwera
app.listen(PORT, () => {
  console.log(`🚀 Serwer działa na http://localhost:${PORT}`);
});
