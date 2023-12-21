import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../NavBar";
import { useParams, useNavigate } from "react-router-dom";

const EditRecommendation = () => {

  const { therapyId, appointmentId, recommendationId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    description: "",
  });

  const axiosPrivate = useAxiosPrivate();

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
      const response = await axiosPrivate.put(`/therapies/${therapyId}/appointments/${appointmentId}/recommendations/${recommendationId}`, formData);
      setSuccessMessage("Appointment updated successfully!");
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  useEffect(() => {
    const fetchRecommendationData = async () => {
      try {
        const response = await axiosPrivate.get(`/therapies/${therapyId}/appointments/${appointmentId}/recommendations/${recommendationId}`);
        const { description } = response.data;
        setFormData({ description });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching recommendation:", error);
        if (error.response && error.response.status === 403) {
          navigate("/therapies"); // Redirect to unauthorized page
        }
      }
    };
    fetchRecommendationData();
    }, [axiosPrivate, therapyId, appointmentId, recommendationId, navigate]);

    if (isLoading) {
        return <p>Loading...</p>;
      }

  return (
    <section>
      <NavBar />
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
              required
              className="textarea-field"
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>
          <button type="submit" className="submit-button">
            Update
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditRecommendation;