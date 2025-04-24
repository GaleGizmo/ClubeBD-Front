import React from "react";
import { motion } from "framer-motion";
import "./RadialSortButton.css";
import { FaStar, FaClock, FaSortAlphaDown } from "react-icons/fa";

const RadialSortButton = ({ onSortChange, activeSort }) => {
  const buttonSize = 26;
  const circleDiameter = 70; // Diámetro del círculo de fondo
  const radius = (circleDiameter - buttonSize) / 2 - 3; // Reducir ligeramente el radio para acercar los botones al centro

  const buttons = [
    { icon: <FaStar />, label: "rating", angle: -90 }, // Ajustar ángulo para el tercio superior
    { icon: <FaSortAlphaDown />, label: "title", angle: 30 }, // Ajustar ángulo para el tercio derecho
    { icon: <FaClock />, label: "date", angle: 150 }, // Ajustar ángulo para el tercio izquierdo
  ];

  const getButtonPosition = (angle) => {
    const angleRad = (angle * Math.PI) / 180;
    return {
      x: Math.cos(angleRad) * radius,
      y: Math.sin(angleRad) * radius,
    };
  };

  return (
    <div className="radial-sort-container">
      <div className="radial-background-circle">
        {/* Líneas divisorias */}
        <div className="divider-line" style={{ transform: 'rotate(0deg)' }} />
        <div className="divider-line" style={{ transform: 'rotate(120deg)' }} />
        <div className="divider-line" style={{ transform: 'rotate(240deg)' }} />
      </div>
      
      {buttons.map((btn, idx) => {
        const pos = getButtonPosition(btn.angle);
        return (
          <motion.button
            key={idx}
            className={`sort-button ${activeSort === btn.label ? 'active' : ''}`}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ 
              x: pos.x,
              y: pos.y,
              opacity: 1
            }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: idx * 0.1
            }}
            whileHover={{ scale: 1.1, color: "#ffffff" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSortChange(btn.label)}
            style={{
              width: buttonSize,
              height: buttonSize,
              position: "absolute", // Asegura que los botones se posicionen correctamente
              left: `calc(50% - ${buttonSize / 2}px)`, // Centra horizontalmente
              top: `calc(50% - ${buttonSize / 2}px)`, // Centra verticalmente
              color: "#000000" // Soluciona la advertencia de animación
            }}
          >
            {btn.icon}
          </motion.button>
        );
      })}
    </div>
  );
};

export default RadialSortButton;