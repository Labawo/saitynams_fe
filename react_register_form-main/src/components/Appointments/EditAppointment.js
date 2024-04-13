import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../Main/NavBar";

const EditAppointment = () => {
  const { therapyId } = useParams();
  const { appointmentId } = useParams(); // Get the appointmentId from the URL params
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    price: 0,
  });

  const axiosPrivate = useAxiosPrivate();

  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await axiosPrivate.get(`/therapies/${therapyId}/appointments/${appointmentId}`);
        const { time: datetime, price } = response.data;
        console.log(response.data);
        const formattedDateTime = new Date(datetime).toISOString().split('T');
        const date = formattedDateTime[0];
        const time = formattedDateTime[1].slice(0, 5);
        setFormData({ date, time, price });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching appointment:", error);
        if (error.response && error.response.status === 403) {
          navigate("/therapies"); // Redirect to unauthorized page
        }
      }
    };

    fetchAppointmentData();
  }, [axiosPrivate, therapyId, appointmentId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const datetime = `${formData.date} ${formData.time}:00`;

      const payload = {
        time: datetime,
        price: formData.price,
      };

      const response = await axiosPrivate.put(`/therapies/${therapyId}/appointments/${appointmentId}`, payload);
      setSuccessMessage("Appointment updated successfully!");
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <section>
      <NavBar />
      <div className="form-container">
        <h2>Edit Appointment</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="date">Date:</label><br />
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time:</label><br />
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
              className="input-field"
              step="60"
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label><br />
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
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

export default EditAppointment;