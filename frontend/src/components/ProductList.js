import React from "react";

const ProductList = ({ products, selectedProducts, toggleProductSelection }) => {
  return (
    <div style={{ marginTop: "1rem" }}>
      {products.length === 0 ? (
        <p>Brak produktów w tej kategorii</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map((product) => {
            const isSelected = selectedProducts.some(p => p._id === product._id);
            return (
              <li key={product._id} style={{
                marginBottom: "1rem",
                border: "1px solid #ddd",
                padding: "0.5rem",
                backgroundColor: isSelected ? "#e6f7ff" : "#fff"
              }}>
                <label>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleProductSelection(product)}
                    style={{ marginRight: "0.5rem" }}
                  />
                  <strong>{product.name}</strong> – {product.price} zł ({product.category})
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
