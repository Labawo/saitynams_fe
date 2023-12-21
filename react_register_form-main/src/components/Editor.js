import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import useAxiosPrivate from "./../hooks/UseAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Editor = () => {
    const [appointments, setAppointments] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getAppointments = async () => {
            try {
                const [appointmentsResponse] = await Promise.all([
                    axiosPrivate.get(`/getWeeklyAppointments`, {
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


    return (
        <section>
            <NavBar />
            <div className="table-container">
                <h2>My Appointments List</h2>
                {appointments.length ? (
                    <table className="my-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment, i) => (
                                <tr key={i}>
                                    <td>{appointment?.time.split('T')[0]}</td>
                                    <td>{appointment?.time.split('T')[1].slice(0, 5)}</td>
                                    <td></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No appointments to display</p>
                )}
            </div>
        </section>
    )
}

export default Editor