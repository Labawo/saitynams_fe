import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../Main/NavBar";
import { useParams } from "react-router-dom";

const CreateRecommendation = () => {

  const { therapyId, appointmentId } = useParams();

  const [formData, setFormData] = useState({
    description: "",
  });

  const axiosPrivate = useAxiosPrivate();

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

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
      <div className="form-container">
        <h2>Create new recommendation</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="description">Description:</label><br />
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