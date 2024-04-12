import React, { useState, useEffect } from 'react';
import Tests from './Tests';
import { useNavigate } from 'react-router-dom';
import NavBar from "../Main/NavBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons'; // Import the plus icon
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import useAuth from "../../hooks/UseAuth";

const TestsPage = () => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [tests, setTests] = useState([]);
    const { auth } = useAuth();

    const canAccess = () => {
        const currentDate = new Date();
        let lastTestDateTime = null;

        // Find the creation date of the last test
        if (tests.length > 0) {
            lastTestDateTime = new Date(tests[0].Time); // Assuming createdAt contains the creation date
        }

        const differenceInDays = lastTestDateTime
            ? Math.floor((currentDate - lastTestDateTime) / (1000 * 60 * 60 * 24))
            : null;

        return !auth.roles.includes("Admin") && (differenceInDays === null || differenceInDays >= 7);
    };

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await axiosPrivate.get('/tests');
                setTests(response.data);
            } catch (error) {
                console.error("Error fetching tests:", error);
            }
        };

        fetchTests();
    }, [axiosPrivate]);

    const createTest = () => {
        // Navigate to the Create Test page
        navigate('/tests/newTest');
    };

    // Calculate average score and display corresponding message
    const calculateAverageScoreMessage = () => {
        if (tests.length === 0) return null;

        const totalScore = tests.reduce((acc, test) => acc + test.score, 0);
        const averageScore = totalScore / tests.length;

        if (averageScore <= 10) {
            return "1-10: These ups and downs are considered normal";
        } else if (averageScore <= 16) {
            return "11-16: Mild mood disturbance";
        } else if (averageScore <= 20) {
            return "17-20: Borderline clinical depression";
        } else if (averageScore <= 30) {
            return "21-30: Moderate depression";
        } else if (averageScore <= 40) {
            return "31-40: Severe depression";
        } else {
            return "over 40: Extreme depression";
        }
    };

    return (
        <section>
            <NavBar />
            <div className="page-header">
                <h1>Tests</h1>
                {canAccess() && (
                    <button onClick={createTest} className="create-button-v1"> {/* Button to create a test */}
                        <FontAwesomeIcon icon={faPlus} /> {/* Plus icon */}
                    </button>
                )}
            </div>
            {tests.length > 0 && (
                <div>
                    <h2>Average Score Analysis:</h2>
                    <p>{calculateAverageScoreMessage()}</p>
                </div>
            )}
            <Tests />
        </section>
    );
};

export default TestsPage;
