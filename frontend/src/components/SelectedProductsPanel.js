import React from "react";

const SelectedProductsPanel = ({ selectedProducts, handleSend, onRemove }) => {
  const total = selectedProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2);

  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "1rem",
      marginBottom: "1rem",
      background: "#e3f2fd",
      borderRadius: "8px"
    }}>
      <h3>Zaznaczone produkty: {selectedProducts.length}</h3>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {selectedProducts.map(p => (
          <li key={p._id} style={{ marginBottom: "0.3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{p.name} – {p.price.toFixed(2)} zł</span>
            <button onClick={() => onRemove(p._id)} style={{ marginLeft: "1rem", background: "#f44336", color: "#fff", border: "none", padding: "0.3rem 0.5rem", borderRadius: "4px", cursor: "pointer" }}>
              ✖
            </button>
          </li>
        ))}
      </ul>
      <p><strong>🧾 Suma zakupów: {total} zł</strong></p>
      <button onClick={handleSend} disabled={selectedProducts.length === 0}
        style={{
          padding: "0.5rem 1rem",
          background: "#2196f3",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "1rem"
        }}>
        🔍 Pokaż przepisy z tych składników
      </button>
    </div>
  );
};

export default SelectedProductsPanel;
