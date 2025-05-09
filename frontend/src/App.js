import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductList from "./components/ProductList";
import Filter from "./components/Filter";
import SelectedProductsPanel from "./components/SelectedProductsPanel";

const App = () => {
  const [products, setProducts] = useState([]);
  const [categories] = useState([
    "owoce", "warzywa", "piekarnia", "nabial", "mieso", "dania-gotowe",
    "napoje", "mrozone", "artykuly-spozywcze", "drogeria", "dla-domu",
    "dla-dzieci", "dla-zwierzat"
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [recipes, setRecipes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showProductList, setShowProductList] = useState(true);
  const [showRecipes, setShowRecipes] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const toggleProductSelection = (product) => {
    const isSelected = selectedProducts.find((p) => p._id === product._id);
    if (isSelected) {
      setSelectedProducts((prev) => prev.filter((p) => p._id !== product._id));
    } else {
      setSelectedProducts((prev) => [...prev, product]);
    }
  };

  const handleSendSelected = async () => {
    try {
      setLoading(true);
      setRecipes("");
      const res = await axios.post("http://localhost:5000/api/recipes", selectedProducts);
      console.log("✅ Odpowiedź z backendu:", res.data);
      setRecipes(res.data.recipes);
      setShowRecipes(true); // automatycznie pokaż przepisy po otrzymaniu
    } catch (error) {
      console.error("❌ Błąd podczas pobierania przepisów:", error);
      alert("Wystąpił błąd podczas pobierania przepisów.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>🛒 Lista Produktów</h1>

      <Filter categories={categories} setSelectedCategory={setSelectedCategory} />

      <SelectedProductsPanel
        selectedProducts={selectedProducts}
        handleSend={handleSendSelected}
      />

      <button onClick={() => setShowProductList(!showProductList)} style={{ marginBottom: "1rem" }}>
        {showProductList ? "⬆️ Ukryj listę produktów" : "⬇️ Pokaż listę produktów"}
      </button>

      {showProductList && (
        <ProductList
          products={filteredProducts}
          selectedProducts={selectedProducts}
          toggleProductSelection={toggleProductSelection}
        />
      )}

      {loading && <p>⏳ Ładowanie przepisów...</p>}

      {recipes && (
        <>
          <button onClick={() => setShowRecipes(!showRecipes)} style={{ marginTop: "2rem" }}>
            {showRecipes ? "⬆️ Ukryj przepisy" : "⬇️ Pokaż przepisy"}
          </button>

          {showRecipes && (
            <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap", border: "1px solid #ccc", padding: "1rem", background: "#f0f0f0" }}>
              <h2>🍽️ Propozycje przepisów:</h2>
              <p>{recipes}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
