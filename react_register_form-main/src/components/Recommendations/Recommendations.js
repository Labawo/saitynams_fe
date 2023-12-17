import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation, useParams  } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();
    const { therapyId, appointmentId } = useParams();

    const handleInspect = (recommendationId) => {
        // Navigate to the InspectPage with the therapyId parameter
        navigate(`/therapies/${therapyId}/appointments/${appointmentId}/recommendations/${recommendationId}`);
    };

    const canAccessDoctor = auth.roles.includes("Doctor") && !auth.roles.includes("Admin");

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getRecommendations = async () => {
            try {
                const response = await axiosPrivate.get(`/therapies/${therapyId}/appointments/${appointmentId}/recomendations`, {
                    signal: controller.signal
                });
                console.log(response.data);
                isMounted && setRecommendations(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getRecommendations();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    const createRecommendation = async () => {
        // Logic to create a new therapy
        // This function will be triggered when the "Create Therapy" button is clicked
        // Implement the logic to create a new therapy using your API
    };

    return (
        <article>
            <div className="table-container">
                <h2>Recommendations List</h2>
                {canAccessDoctor && (
                    <button onClick={createRecommendation}>Create Appointment</button>
                )}
                {recommendations.length ? (
                    <table className="my-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recommendations.map((recommendation, i) => (
                                <tr key={i}>
                                    <td>{recommendation?.description}</td>
                                    <td>{recommendation?.id}</td>
                                    <td>
                                        <button 
                                            className="table_buttons_blue"
                                            onClick={() => handleInspect(recommendation.id)}
                                        >
                                            Inspect
                                        </button>
                                        {canAccessDoctor && (
                                            <>
                                                <button className="table_buttons_blue">Edit</button>
                                                <button className="table_buttons">Remove</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No recomendations to display</p>
                )}
            </div>
        </article>
    );
};

export default Recommendations;