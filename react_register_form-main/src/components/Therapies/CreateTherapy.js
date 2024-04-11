import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../Main/NavBar";
import useAuth from "../../hooks/UseAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const CreateTherapy = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    doctorId: "",
    image: null, // New field for image
  });

  const [doctors, setDoctors] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const canAccessAdmin = auth.roles.includes("Admin");

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

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
    const { name, value, files } = e.target;
    // Validate input to prevent HTML or script injections
    const sanitizedValue = sanitizeInput(value);
    setFormData({
      ...formData,
      [name]: name === "image" ? files[0] : sanitizedValue,
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
  
      // Initialize imageData as null
      let imageData1 = null;
  
      // Check if formData.image is not null
      if (formData.image) {
        // Convert the image file to a base64 string asynchronously
        imageData1 = await readFileAsBase64(formData.image);
      }
  
      // Include the base64 string in the JSON payload
      const therapyData = {
        name: formData.name,
        description: formData.description,
        doctorId: formData.doctorId,
        imageData: imageData1, // Base64 string of the image or null if no image is selected
      };
  
      // Send therapyData as JSON payload
      const response = await axiosPrivate.post("/therapies", therapyData);
  
      // Handle successful API response
      setSuccessMessage("Therapy created successfully!");
      // Clear form fields
      setFormData({ name: "", description: "", doctorId: "", image: null });
      document.getElementById("image").value = "";
    } catch (error) {
      // Handle API call errors
      console.error("Error creating therapy:", error);
      // Update state to display error messages or handle errors appropriately
    }
  };  
  
  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };  
  

  return (
    <section>
      <NavBar />
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
                required
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
            {errors.image && <span className="error-message">{errors.image}</span>}
          </div>
          <button type="submit" className="submit-button">
            Create
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateTherapy;
