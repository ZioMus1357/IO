const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://zakupy.biedronka.pl/";
const categories = [
  "owoce",
  "warzywa",
  "piekarnia",
  "nabial",
  "mieso",
  "dania-gotowe",
  "napoje",
  "mrozone",
  "artykuly-spozywcze",
  "drogeria",
  "dla-domu",
  "dla-dzieci",
  "dla-zwierzat"
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

      // Sprawdzamy, czy na stronie są produkty
      if (productElements.length === 0) {
        console.log(`❌ Brak produktów na stronie ${page}, kończę kategorię "${category}"`);
        break;
      }

      const currentPageProducts = [];

      productElements.each((_, el) => {
        const name = $(el).find(".product-tile__name").text().trim();

        const zl = $(el)
          .find(".price-tile__sales")
          .clone()
          .children()
          .remove()
          .end()
          .text()
          .trim();

        const gr = $(el).find(".price-tile__decimal").text().trim();
        const priceString = zl && gr ? `${zl}.${gr}` : null;

        const price = priceString ? parseFloat(priceString.replace(",", ".")) : null;

        if (name && price !== null) {
          currentPageProducts.push({ name, price, category });
        }
      });

      // Sprawdzamy, czy produkty na tej stronie są takie same jak na poprzedniej
      const duplicateFound = currentPageProducts.every(product =>
        lastPageProducts.some(lastProduct => lastProduct.name === product.name)
      );

      if (duplicateFound) {
        console.log(`🚨 Strona ${page} zawiera te same produkty, kończę kategorię "${category}"`);
        break;
      }

      // Dodajemy nowe produkty do ogólnej listy
      products.push(...currentPageProducts);

      console.log(`✅ Strona ${page} – znaleziono ${currentPageProducts.length} nowych produktów`);
      lastPageProducts = currentPageProducts;

      page++;
    } catch (error) {
      console.error(`❗ Błąd podczas pobierania ${category} strona ${page}:`, error.message);
      break;
    }
  }

  return products;
}

async function scrapeAll() {
  const allProducts = [];

  for (const category of categories) {
    console.log(`\n📦 Kategoria: ${category}`);
    const products = await scrapeCategory(category);
    console.log(`📊 Łącznie w kategorii "${category}": ${products.length} produktów`);
    allProducts.push(...products);
  }

  return allProducts; // Zwracamy dane, które będą zapisane w bazie danych
}

module.exports = scrapeAll;
