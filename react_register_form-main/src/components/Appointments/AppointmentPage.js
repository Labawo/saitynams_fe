import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../NavBar";
import useAuth from "../../hooks/UseAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const AppointmentPage = () => {
    const { therapyId, appointmentId } = useParams(); // Get the therapyId from the URL params
    const [appointment, setAppointment] = useState(null);
    const axiosPrivate = useAxiosPrivate();

    const { auth } = useAuth();

    const canAccessDoctor = auth.roles.includes("Doctor") || auth.roles.includes("Admin");

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // This will navigate back one step in the history
    };

    useEffect(() => {
        const fetchTherapy = async () => {
            try {
                const response = await axiosPrivate.get(`/therapies/${therapyId}/appointments/${appointmentId}`);
                setAppointment(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
                // Handle error, e.g., show a message or navigate to an error page
            }
        };

        fetchTherapy();
    }, [axiosPrivate, therapyId, appointmentId]);

    return (
        <section>
            <NavBar />
            <button onClick={handleGoBack} className="back-button">
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h2>Appointment Details</h2>
            {appointment ? (
                <div>
                    <p>Name: {appointment.time}</p>
                    <p>Description: {appointment.price}</p>
                    {/* Add other details you want to display */}
                    {canAccessDoctor && (
                        <Link to={`/therapies/${therapyId}/appointments/${appointmentId}/recommendations`}>
                            <button>See Recommendations</button>
                        </Link>
                    )}
                    
                </div>
            ) : (
                <p>Loading appointment details...</p>
            )}
        </section>
    );
};

export default AppointmentPage;