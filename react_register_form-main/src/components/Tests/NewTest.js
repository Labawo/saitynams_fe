import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../Main/NavBar";
import useAuth from "../../hooks/UseAuth";
import questionsData from "./questionsData";
import RedirectModal from "../Modals/RedirectModal"; // Import the RedirectModal component
import ErrorModal from "../Modals/ErrorModal"; // Import the ErrorModal component

const NewTest = () => {
  const [formData, setFormData] = useState({});
  const [score, setScore] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserTests = async () => {
      try {
        const response = await axiosPrivate.get('/tests', {
          params: { pageNumber: 1, patientId: null },
        });
        const tests = response.data;
        if (tests.length > 0) {
          const latestTestDate = new Date(tests[0].time);
          const currentDate = new Date();
          const differenceInDays = Math.floor((currentDate - latestTestDate) / (1000 * 60 * 60 * 24));
          if (differenceInDays < 7) {
            // If latest test was done less than 7 days ago, redirect to previous page
            navigate(-1);
            return; // Added return to exit early after navigation
          }
        }
      } catch (error) {
        console.error("Error fetching user tests:", error);
      }
    };
  
    fetchUserTests();
  }, [axiosPrivate, navigate]);

  const handleInputChange = (questionIndex, optionIndex) => {
    return () => {
      const newFormData = { ...formData };
      newFormData[questionIndex] = optionIndex;
      setFormData(newFormData);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calculate score based on selected options
      let totalScore = 0;
      for (const questionIndex in formData) {
        const optionIndex = formData[questionIndex];
        totalScore += questionsData[questionIndex].options[optionIndex].points;
      }
      setScore(totalScore);

      // Send score to the API
      const response = await axiosPrivate.post("/tests", { score: totalScore });
      setSuccessMessage("Test created successfully!");
      setShowSuccessMessage(true);
      // Clear form fields
      setFormData({});
    } catch (error) {
      console.error("Error creating test:", error);
      setErrorMessage("Failed to create test. Please try again.");
    }
  };

  return (
    <section>
      <NavBar />
      <div className="form-container">
        <h2>New Test</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <ErrorModal show={errorMessage !== ""} onClose={() => setErrorMessage("")} message={errorMessage} />}
        <form onSubmit={handleSubmit}>
          {questionsData.map((question, questionIndex) => (
            <div className="form-group" key={questionIndex}>
              <label>{question.question}</label><br />
              <div>
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <label>
                      <input
                        type="radio"
                        name={`question${questionIndex}`}
                        value={optionIndex}
                        checked={formData[questionIndex] === optionIndex}
                        onChange={handleInputChange(questionIndex, optionIndex)}
                        required
                      />
                      {option.text}
                    </label>
                    <br />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button type="submit" className="submit-button">
            Submit Test
          </button>
        </form>
        {score !== null && <p>Score: {score}</p>}
        <RedirectModal show={showSuccessMessage} onClose={() => setShowSuccessMessage(false)} message={successMessage} destination="/tests" />
      </div>
    </section>
  );
};

export default NewTest;
