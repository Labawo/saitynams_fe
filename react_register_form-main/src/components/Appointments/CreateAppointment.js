import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useParams } from "react-router-dom";
import NavBar from "../Main/NavBar";

const CreateAppointment = () => {

  const { therapyId } = useParams();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    price: 0,
  });

  const axiosPrivate = useAxiosPrivate();

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Prevent negative price input
    if (name === "price" && value < 0) {
      updatedValue = 0;
    }

    // Prevent choosing a date in the past
    if (name === "date") {
      const currentDate = new Date().toISOString().split("T")[0];
      if (value < currentDate) {
        updatedValue = currentDate;
      }
    }

    if (name === "price" && isNaN(value)) {
      return; // Don't update state if input is not numeric
    }

    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const datetime = `${formData.date} ${formData.time}:00`; // Add ":00" for seconds
      const combinedDateTime = new Date(datetime).toISOString();
      console.log(datetime);

      const payload = {
        time: datetime,
        price: formData.price,
      };

      const response = await axiosPrivate.post(`therapies/${therapyId}/appointments`, payload);

      setSuccessMessage("Appointment created successfully!");
      setFormData({ date: "", time: "", price: 0 });
    } catch (error) {
        if (error.response && error.response.status === 400) {
        // Handle specific error case (BadRequest)
            console.error('Bad request: ', error.response.data);
        } else {
            console.error(`Error removing therapy ${therapyId}:`, error);
        }
        console.error("Error creating appointment:", error);
    }
  };

  return (
    <section>
      <NavBar />
      <div className="form-container">
        <h2>Create New Appointment</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="input-field"
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="time">Time:</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
              className="input-field"
              step="60" // Set step to 60 (one minute)
            />
            {errors.time && <span className="error-message">{errors.time}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              className="input-field"
            />
            {errors.price && (
              <span className="error-message">{errors.price}</span>
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

export default CreateAppointment;