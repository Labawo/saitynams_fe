import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../NavBar";

const EditTherapy = () => {
  const { therapyId } = useParams(); // Get the therapyId from the URL params
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const axiosPrivate = useAxiosPrivate();

  const [isLoading, setIsLoading] = useState(true);

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchTherapyData = async () => {
      try {
        const response = await axiosPrivate.get(`/therapies/${therapyId}`);
        const { name, description } = response.data.resource;
        setFormData({ name, description });
        setIsLoading(false);
        console.log(name);
      } catch (error) {
        console.error("Error fetching therapy:", error);
        if (error.response && error.response.status === 403) {
            // Unauthorized error, redirect to unauthorized page
            navigate("/therapies"); // Replace "/unauthorized" with your unauthorized page route
          }
      }
    };

    fetchTherapyData();
  }, [axiosPrivate, therapyId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setFormData({
      ...formData,
      [name]: sanitizedValue,
    });
  };

  const sanitizeInput = (value) => {
    return value.replace(/(<([^>]+)>)/gi, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.put(`/therapies/${therapyId}`, formData);
      setSuccessMessage("Therapy updated successfully!");
    } catch (error) {
      console.error("Error updating therapy:", error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>; // Render loading indicator while fetching data
  }

  return (
    <section>
      <NavBar />
      <div className="form-container">
        <h2>Edit Therapy</h2>
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
              required
              className="input-field"
            />
          </div>
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
          </div>
          <button type="submit" className="submit-button">
            Update
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditTherapy;