import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation, useParams  } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSearch, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import ErrorModal from "../Modals/ErrorModal";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();
    const { therapyId } = useParams();
    const [errorMessage, setErrorMessage] = useState("");

    const handleInspect = (appintmentId) => {
        // Navigate to the InspectPage with the therapyId parameter
        navigate(`/therapies/${therapyId}/appointments/${appintmentId}`);
    };

    const [therapy, setTherapy] = useState(null);
    

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getTherapyAndAppointments = async () => {
            try {
                const [therapyResponse, appointmentsResponse] = await Promise.all([
                    axiosPrivate.get(`/therapies/${therapyId}`, {
                        signal: controller.signal,
                    }),
                    axiosPrivate.get(`/therapies/${therapyId}/appointments`, {
                        signal: controller.signal,
                    }),
                ]);
                //console.log(therapyResponse.data.resource);
                //console.log(appointmentsResponse.data);
                isMounted && setTherapy(therapyResponse.data.resource);
                isMounted && setAppointments(appointmentsResponse.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        };

        getTherapyAndAppointments();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate, navigate, location, therapyId]);

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

      const doctorId = therapy ? therapy.doctorId : null;
      const userId = auth.id;
      const canEditDelete = userId === doctorId || auth.roles.includes("Admin");

      const selectAppointment = async (appointmentId) => {
          try {
              await axiosPrivate.put(`/therapies/${therapyId}/appointments/${appointmentId}/select`);
              // Logic for handling after selection if needed
              const updatedAppointmentsResponse = await axiosPrivate.get(`/therapies/${therapyId}/appointments`);
              setAppointments(updatedAppointmentsResponse.data);
          } catch (error) {
              console.error(`Error selecting appointment ${appointmentId}:`, error);
              // Handle selection error (e.g., show error message)
              if (error.response.status === 409) {
                // Handle Conflict error
                setErrorMessage("Appointment time overlaps or you have reached appointment limit.");
              }
          }
      };

      const canSelectAppointment = auth.roles.includes("Patient");

    return (
        <article>
            <div className="table-container">
                <h2 className="list-headers">Appointments List</h2>
                {canEditDelete && (
                    <button onClick={createAppointment} className="create-button-v1"> + </button>
                )}
                {appointments.length ? (
                    <table className="my-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment, i) => (
                                <tr key={i}>
                                    <td>{appointment?.time.split('T')[0]}</td>
                                    <td>{appointment?.time.split('T')[1].slice(0, 5)}</td>
                                    <td>{appointment?.price}€</td>
                                    <td>
                                        {canSelectAppointment && (
                                            <button 
                                                className="table_buttons_green"
                                                onClick={() => selectAppointment(appointment.id)}
                                            >
                                                <FontAwesomeIcon icon={faCheck} />
                                            </button>
                                        )}
                                        {canEditDelete && (
                                            <>
                                                <button 
                                                    className="table_buttons_blue"
                                                    onClick={() => handleInspect(appointment.id)}
                                                >
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </button>
                                                <button 
                                                    className="table_buttons_blue"
                                                    onClick={() => updateAppointment(appointment.id)}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                <button
                                                    className="table_buttons"
                                                    onClick={() => deleteAppointment(appointment.id)} // Invoke deleteAppointment on click
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
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
            {/* Error Modal */}
            <ErrorModal
                show={errorMessage !== ""}
                onClose={() => setErrorMessage("")}
                message={errorMessage}
            />
        </article>
    );
};

export default Appointments;