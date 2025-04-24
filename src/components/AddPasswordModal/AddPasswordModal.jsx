import React, { useState } from "react";
import "./AddPasswordModal.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AddPasswordModal = ({ isOpen, onClose, onConfirm, userName }) => {
  const [username, setUsername] = useState(userName);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    return regex.test(password);
  };
  const handleConfirm = () => {
    if (password !== confirmPassword) {
      setError("Os contrasinais non coinciden.");
      return;
    } else if (!validatePassword(password)) {
      setError(
        "O contrasinal debe ter alomenos 6 caracteres, cunha maiúscula, unha minúscula e un díxito."
      );
    } else {
      setError("");
      onConfirm(username, password);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal add-password-modal-content">
        <h2>USUARIO E CONTRASINAL:</h2>
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contrasinal:</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="icon-button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirma o contrasinal:</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="icon-button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="modal-buttons">
          <button className="form-button add-button" onClick={onClose}>
            Cancelar
          </button>
          <button className="form-button add-button" onClick={handleConfirm}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPasswordModal;
