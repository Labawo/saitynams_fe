import React from "react";
import { useNavigate } from "react-router-dom";
import "./ModalStyles.css"; // Import the CSS file

const SuccessModal = ({ show, onClose, message, buttonText, destination }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(destination);
    onClose(); // Close the modal after navigation
  };

  return (
    <div className={`modal ${show ? "show" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Success!</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="primary-button" onClick={onClose}>Stay</button>
          <button className="secondary-button" onClick={handleNavigation}>{buttonText}</button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
