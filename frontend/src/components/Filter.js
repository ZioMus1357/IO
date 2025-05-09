import React from "react";

const Filter = ({ categories, setSelectedCategory }) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <select onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">Wszystkie kategorie</option>
        {categories.map((category, idx) => (
          <option key={idx} value={category}>{category}</option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
