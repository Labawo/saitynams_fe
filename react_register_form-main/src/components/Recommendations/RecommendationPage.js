import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../Main/NavBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const RecommendationPage = () => {
    const { therapyId, appointmentId, recommendationId } = useParams(); // Get the therapyId from the URL params
    const [recommendation, setRecommendation] = useState(null);
    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // This will navigate back one step in the history
    };

    useEffect(() => {
        const fetchTherapy = async () => {
            try {
                const response = await axiosPrivate.get(`/therapies/${therapyId}/appointments/${appointmentId}/recommendations/${recommendationId}`);
                setRecommendation(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
                // Handle error, e.g., show a message or navigate to an error page
            }
        };

        fetchTherapy();
    }, [axiosPrivate, therapyId, appointmentId, recommendationId]);

    return (
        <section>
            <NavBar />
            <button onClick={handleGoBack} className="back-button">
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h2>Recommendation Details</h2>
            {recommendation ? (
                <div>
                    <p>Name: {recommendation.id}</p>
                    <p>Description: {recommendation.description}</p>
                    {/* Add other details you want to display */}                    
                </div>
            ) : (
                <p>Loading therapy details...</p>
            )}
        </section>
    );
};

export default RecommendationPage;