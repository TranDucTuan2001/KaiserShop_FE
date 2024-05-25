import React from "react";
import { useNavigate } from "react-router-dom";

const TypeProduct = ({ name, isActive, onNavigate }) => {
  const navigate = useNavigate();

  const handleNavigateType = (type) => {
    onNavigate(type);
    navigate(
      `/product/${type
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        ?.replace(/ /g, "-")}`,
      { state: type }
    );
  };

  return (
    <div
      style={{
        padding: "10px",
        cursor: "pointer",
        borderRadius: "6px",
        transition: "color 0.3s ease, background-color 0.3s ease",
        color: isActive ? "blue" : "initial",
        backgroundColor: isActive ? "lightblue" : "initial",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = "blue";
          e.currentTarget.style.backgroundColor = "lightgray";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = "initial";
          e.currentTarget.style.backgroundColor = "initial";
        }
      }}
      onClick={() => handleNavigateType(name)}
    >
      {name}
    </div>
  );
};

export default TypeProduct;
