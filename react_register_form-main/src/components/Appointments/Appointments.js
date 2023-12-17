import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation, useParams  } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();
    const { therapyId } = useParams();

    const handleInspect = (appintmentId) => {
        // Navigate to the InspectPage with the therapyId parameter
        navigate(`/therapies/${therapyId}/appointments/${appintmentId}`);
    };

    const canAccessDoctor = auth.roles.includes("Doctor") && !auth.roles.includes("Admin");

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getAppointments = async () => {
            try {
                const response = await axiosPrivate.get(`/therapies/${therapyId}/appointments`, {
                    signal: controller.signal
                });
                console.log(response.data);
                isMounted && setAppointments(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getAppointments();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    const createAppointment = async () => {
        // Logic to create a new therapy
        // This function will be triggered when the "Create Therapy" button is clicked
        // Implement the logic to create a new therapy using your API
    };

    return (
        <article>
            <div className="table-container">
                <h2>Appointments List</h2>
                {canAccessDoctor && (
                    <button onClick={createAppointment}>Create Appointment</button>
                )}
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
                    <p>No appointments to display</p>
                )}
            </div>
        </article>
    );
};

export default Appointments;