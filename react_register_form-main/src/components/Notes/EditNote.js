import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../Main/NavBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const EditNote = () => {
  const { noteId } = useParams(); // Get the noteId from the URL params
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    content: ""
  });

  const axiosPrivate = useAxiosPrivate();

  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchNoteData = async () => {
      try {
        const response = await axiosPrivate.get(`/notes/${noteId}`);
        const { name, content } = response.data;
        setFormData({ name, content });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching note:", error);
        if (error.response && error.response.status === 403) {
          navigate("/notes"); // Redirect to notes page if unauthorized
        }
      }
    };

    fetchNoteData();
  }, [axiosPrivate, noteId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setFormData({
      ...formData,
      [name]: sanitizedValue
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
      const response = await axiosPrivate.put(`/notes/${noteId}`, formData);
      setSuccessMessage("Note updated successfully!");
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <section>
      <NavBar />
      <div className="form-container">
        <h2>Edit Note</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Title:</label>
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
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
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

export default EditNote;
