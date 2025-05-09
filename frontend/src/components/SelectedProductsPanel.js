import React from "react";

const SelectedProductsPanel = ({ selectedProducts, handleSend }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem", background: "#f9f9f9" }}>
      <h3>Zaznaczone produkty: {selectedProducts.length}</h3>
      <ul>
        {selectedProducts.map(p => (
          <li key={p._id}>{p.name} – {p.price} zł</li>
        ))}
      </ul>
      <button onClick={handleSend} disabled={selectedProducts.length === 0}>
        🔍 Pokaż przepisy z tych składników
      </button>
    </div>
  );
};

export default SelectedProductsPanel;
