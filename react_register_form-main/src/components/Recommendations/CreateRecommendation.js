import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../NavBar";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const CreateRecommendation = () => {

  const { therapyId, appointmentId } = useParams();

  const [formData, setFormData] = useState({
    description: "",
  });

  const axiosPrivate = useAxiosPrivate();

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleGoBack = () => {
      navigate(-1); // This will navigate back one step in the history
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Validate input to prevent HTML or script injections
    const sanitizedValue = sanitizeInput(value);
    setFormData({
      ...formData,
      [name]: sanitizedValue,
    });
  };

  const sanitizeInput = (value) => {
    // Basic sanitation function to prevent HTML/script injections
    // Implement according to your security requirements
    return value.replace(/(<([^>]+)>)/gi, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Implement form validation logic here
      // For instance, check if fields are not empty, etc.

      const response = await axiosPrivate.post(`/therapies/${therapyId}/appointments/${appointmentId}/recommendations`, formData); // Adjust the API endpoint and payload as per your backend

      // Handle successful API response
      setSuccessMessage("Recommendation created successfully!");
      // Clear form fields
      setFormData({ description: "" });
    } catch (error) {
      // Handle API call errors
      console.error("Error creating therapy:", error);
      // Update state to display error messages or handle errors appropriately
    }
  };

  return (
    <section>
      <NavBar />
      <button onClick={handleGoBack} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <div className="form-container">
        <h2>Create New Therapy</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter Therapy Description"
              required
              className="textarea-field"
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>
          <button type="submit" className="submit-button">
            Create
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateRecommendation;