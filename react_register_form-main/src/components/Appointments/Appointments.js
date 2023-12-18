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

    const createAppointment = () => {
        // Navigate to the Create Therapy page
        navigate(`/therapies/${therapyId}/appointments/createAppointment`);
    };

    const updateAppointment = (apponitmentId) => {
        // Navigate to the Create Therapy page
        navigate(`/therapies/${therapyId}/appointments/${apponitmentId}/editAppointment`);
    };

    const deleteAppointment = async (appointmentId) => {
        try {
          await axiosPrivate.delete(`/therapies/${therapyId}/appointments/${appointmentId}`);
          // Remove the deleted appointment from the state
          setAppointments(prevAppointments =>
            prevAppointments.filter(appointment => appointment.id !== appointmentId)
          );
        } catch (error) {
          console.error(`Error deleting appointment ${appointmentId}:`, error);
          // Handle deletion error (e.g., show error message)
        }
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
                                                <button 
                                                    className="table_buttons_blue"
                                                    onClick={() => updateAppointment(appointment.id)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="table_buttons"
                                                    onClick={() => deleteAppointment(appointment.id)} // Invoke deleteAppointment on click
                                                >
                                                    Remove
                                                </button>
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