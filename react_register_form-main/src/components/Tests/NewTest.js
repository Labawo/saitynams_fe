import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../Main/NavBar";
import useAuth from "../../hooks/UseAuth";
import questionsData from "./questionsData"; // Import questionsData

const NewTest = () => {
  const [formData, setFormData] = useState({});
  const [score, setScore] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

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
      // Clear form fields
      setFormData({});
    } catch (error) {
      console.error("Error creating test:", error);
      // Update state to display error messages or handle errors appropriately
    }
  };

  return (
    <section>
      <NavBar />
      <div className="form-container">
        <h2>New Test</h2>
        {successMessage && (
          <p className="success-message">{successMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          {questionsData.map((question, questionIndex) => (
            <div className="form-group" key={questionIndex}>
              <label>{question.question}</label>
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
      </div>
    </section>
  );
};

export default NewTest;
