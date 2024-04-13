import React from "react";
import { useNavigate } from "react-router-dom";
import "./ModalStyles.css"; // Import the CSS file

const RedirectModal = ({ show, message, buttonText, destination }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(destination);
  };

  return (
    <div className={`modal ${show ? "show" : ""}`}>
      <div className="modal-content">
        <h2>Notification</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="primary-button" onClick={handleNavigation}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedirectModal;
