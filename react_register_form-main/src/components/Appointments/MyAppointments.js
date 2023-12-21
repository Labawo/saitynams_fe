import { useState, useEffect, useCallback } from "react";
import NavBar from "../NavBar";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation, useParams  } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";

const AppointmentsPage = () => {

    const [appointments, setAppointments] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [showPopup, setShowPopup] = useState(false); // State to control the popup visibility
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { therapyId } = useParams();
    

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getAppointments = async () => {
            try {
                const [appointmentsResponse] = await Promise.all([
                    axiosPrivate.get(`/getMyAppointments`, {
                        signal: controller.signal,
                    }),
                ]);
                isMounted && setAppointments(appointmentsResponse.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        };

        getAppointments();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate, navigate, location]);

    const handleInspect = async (appointmentId) => {
        try {
            const response = await axiosPrivate.get(`/getMyAppointments/${appointmentId}/getMyRecommendations`);
            console.log("Recommendations:", response.data); // Log the recommendations data
            setRecommendations(response.data);
            setShowPopup(true);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        }
    };

    const closePopup = () => {
        setShowPopup(false); // Close the popup
        setRecommendations([]); // Clear recommendations when closing
    };



    return (
        <section>
            <NavBar />
            <div className="table-container">
                <h2>My Appointments List</h2>
                {appointments.length ? (
                    <table className="my-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment, i) => (
                                <tr key={i}>
                                    <td>{appointment?.time}</td>
                                    <td>{appointment?.id}</td>
                                    <td>
                                        <button 
                                            className="table_buttons_blue"
                                            onClick={() => handleInspect(appointment.id)}
                                        >
                                            Inspect
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No appointments to display</p>
                )}

                {/* Popup for recommendations */}
                {showPopup && (
                    <div className={`popup ${showPopup ? 'active' : ''}`} onClick={closePopup}>
                        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                            <span className="close" onClick={closePopup}>&times;</span>
                            <h3>Recommendations</h3>
                            <table className="recommendations-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recommendations.length === 0 ? (
                                        <tr>
                                            <td colSpan="2">No recommendations available</td>
                                        </tr>
                                    ) : (
                                        recommendations.map((recommendation, index) => (
                                            <tr key={index}>
                                                <td>{recommendation.id}</td>
                                                <td>{recommendation.description}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            
        </section>

        
    )
}

export default AppointmentsPage