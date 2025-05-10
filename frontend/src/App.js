import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductList from "./components/ProductList";
import Filter from "./components/Filter";
import SelectedProductsPanel from "./components/SelectedProductsPanel";

const App = () => {
  const [products, setProducts] = useState([]);
  const [categories] = useState([
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
    "dla-zwierzat",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [recipes, setRecipes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showProducts, setShowProducts] = useState(true);
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

  const handleRemoveProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const handleSendSelected = async () => {
    try {
      setLoading(true);
      setRecipes("");
      const res = await axios.post(
        "http://localhost:5000/api/recipes",
        selectedProducts
      );
      setRecipes(res.data.recipes);
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
    <div style={{ fontFamily: "Arial", padding: "2rem", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>🛒 Lista Produktów</h1>

      <Filter categories={categories} setSelectedCategory={setSelectedCategory} />

      <SelectedProductsPanel
        selectedProducts={selectedProducts}
        handleSend={handleSendSelected}
        onRemove={handleRemoveProduct}
      />

      <div style={{ margin: "1rem 0" }}>
        <button onClick={() => setShowProducts(!showProducts)} style={{ padding: "0.5rem", marginBottom: "1rem" }}>
          {showProducts ? "🔽 Ukryj listę produktów" : "🔼 Pokaż listę produktów"}
        </button>
      </div>

      {showProducts && (
        <ProductList
          products={filteredProducts}
          selectedProducts={selectedProducts}
          toggleProductSelection={toggleProductSelection}
        />
      )}

      {loading && <p>⏳ Ładowanie przepisów...</p>}

      <div style={{ marginTop: "2rem" }}>
        <button onClick={() => setShowRecipes(!showRecipes)} style={{ padding: "0.5rem", marginBottom: "1rem" }}>
          {showRecipes ? "🔽 Ukryj przepisy" : "🔼 Pokaż przepisy"}
        </button>

        {showRecipes && recipes && (
          <div style={{ background: "#fff", padding: "1rem", borderRadius: "8px", boxShadow: "0 0 8px rgba(0,0,0,0.1)", whiteSpace: "pre-wrap" }}>
            <h2>🍽️ Propozycje przepisów:</h2>
            <p>{recipes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
