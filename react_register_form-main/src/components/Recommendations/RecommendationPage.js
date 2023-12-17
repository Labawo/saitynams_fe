import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../NavBar";

const RecommendationPage = () => {
    const { therapyId, appointmentId, recommendationId } = useParams(); // Get the therapyId from the URL params
    const [recommendation, setRecommendation] = useState(null);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchTherapy = async () => {
            try {
                const response = await axiosPrivate.get(`/therapies/${therapyId}/appointments/${appointmentId}/recomendations/${recommendationId}`);
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
            <h2>Therapy Details</h2>
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