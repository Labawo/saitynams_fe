import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../NavBar";
import useAuth from "../../hooks/UseAuth";

const AppointmentPage = () => {
    const { therapyId, appointmentId } = useParams(); // Get the therapyId from the URL params
    const [appointment, setAppointment] = useState(null);
    const axiosPrivate = useAxiosPrivate();

    const { auth } = useAuth();

    const canAccessDoctor = auth.roles.includes("Doctor") || auth.roles.includes("Admin");

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
                <p>Loading therapy details...</p>
            )}
        </section>
    );
};

export default AppointmentPage;