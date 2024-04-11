import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../Main/NavBar";

const EditTherapy = () => {
  const { therapyId } = useParams(); // Get the therapyId from the URL params
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageData: null, // New field for image
  });

  const axiosPrivate = useAxiosPrivate();

  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchTherapyData = async () => {
      try {
        const response = await axiosPrivate.get(`/therapies/${therapyId}`);
        const { name, description, imageData } = response.data.resource;
        setFormData({ name, description, imageData }); // Set the image data from the response
        setIsLoading(false);
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
    const { name, value, files } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    if (name === "image") {
      const reader = new FileReader();
      const file = files[0];
      
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageData: reader.result, // Convert image to base64 string and set it in formData
        });
      };
      
      reader.readAsDataURL(file); // Read the image file as a data URL
    } else {
      setFormData({
        ...formData,
        [name]: sanitizedValue,
      });
    }
  };

  const sanitizeInput = (value) => {
    return value.replace(/(<([^>]+)>)/gi, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let formDataToSend = { ...formData }; // Copy the formData to prevent modifying the original state
      
      // If imageData is a File object, convert it to base64 string
      if (formDataToSend.imageData instanceof File) {
        const imageDataBase64 = await readFileAsBase64(formDataToSend.imageData);
        formDataToSend = {
          ...formDataToSend,
          imageData: imageDataBase64,
        };
      }

      const response = await axiosPrivate.put(`/therapies/${therapyId}`, formDataToSend);
      setSuccessMessage("Therapy updated successfully!");
    } catch (error) {
      console.error("Error updating therapy:", error);
    }
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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
          <div className="form-group">
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleInputChange}
              accept="image/*"
              className="input-field"
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
