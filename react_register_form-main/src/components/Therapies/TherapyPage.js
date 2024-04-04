import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../Main/NavBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import "./TherapyPage.css"; // Import a CSS file for styling (create TherapyPage.css in the same directory)

const TherapyPage = () => {
    const { therapyId } = useParams(); // Get the therapyId from the URL params
    const [therapy, setTherapy] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // This will navigate back one step in the history
    };

    useEffect(() => {
        const fetchTherapy = async () => {
            try {
                const response = await axiosPrivate.get(`/therapies/${therapyId}`);
                setTherapy(response.data.resource);
            } catch (error) {
                console.error(error);
                // Handle error, e.g., show a message or navigate to an error page
            }
        };

        fetchTherapy();
    }, [axiosPrivate, therapyId]);

    return (
        <section className="therapy-page">
            <NavBar />
            <button onClick={handleGoBack} className="back-button">
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            {therapy ? (
                <div className="therapy-details">
                    <h2>{therapy.name}</h2>
                    <p>{therapy.description}</p>
                    {/* Display the image if available */}
                    {therapy.imageData && (
                        <img src={therapy.imageData} alt="Therapy" className="therapy-image" />
                    )}
                    <Link to={`/therapies/${therapyId}/appointments`}>
                        <button className="appointments-button">See Appointments</button>
                    </Link>
                </div>
            ) : (
                <p>Loading therapy details...</p>
            )}
        </section>
    );
};

export default TherapyPage;
