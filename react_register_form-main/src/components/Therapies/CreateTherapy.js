import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../NavBar";
import useAuth from "../../hooks/UseAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const CreateTherapy = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    doctorId: "",
  });

  const [doctors, setDoctors] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const canAccessAdmin = auth.roles.includes("Admin");

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This will navigate back one step in the history
  };

  useEffect(() => {
    if (canAccessAdmin) {
      const fetchDoctors = async () => {
        try {
          const response = await axiosPrivate.get("/doctors");
          setDoctors(response.data);
        } catch (error) {
          console.error("Error fetching doctors:", error);
          // Handle error
        }
      };

      fetchDoctors();
    }
  }, [axiosPrivate, canAccessAdmin]);

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

      const response = await axiosPrivate.post("/therapies", formData); // Adjust the API endpoint and payload as per your backend

      // Handle successful API response
      setSuccessMessage("Therapy created successfully!");
      // Clear form fields
      setFormData({ name: "", description: "" });
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
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Therapy Name"
              required
              className="input-field"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
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
          {canAccessAdmin && ( // Show the dropdown only if the user is an admin
            <div className="form-group">
              <label htmlFor="doctorId">Doctor:</label>
              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleInputChange}
                className="select-field"
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.userName}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button type="submit" className="submit-button">
            Create
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateTherapy;