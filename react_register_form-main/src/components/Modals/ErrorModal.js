import React from "react";
import "./ModalStyles.css"; // Import the CSS file

const ErrorModal = ({ show, onClose, message }) => {
  return (
    <div className={`modal ${show ? "show" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Error</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="primary-button" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
