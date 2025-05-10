// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const scrape = require('../scrapers/scraper');

// GET: Pobierz produkty (opcjonalnie z filtrem kategorii)
router.get('/', async (req, res) => {
  const { category } = req.query;
  try {
    const filter = category ? { category } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Wykonaj scraping i zapisz dane
router.post('/scrape', async (req, res) => {
  try {
    const scrapedProducts = await scrape(); // funkcja ze scraper.js
    const inserted = await Product.insertMany(scrapedProducts);
    res.json(inserted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/selected-products", async (req, res) => {
  const selected = req.body;
  console.log(" Otrzymano produkty:", selected);
  res.status(200).json({ message: "Produkty otrzymane" });
});

module.exports = router;
