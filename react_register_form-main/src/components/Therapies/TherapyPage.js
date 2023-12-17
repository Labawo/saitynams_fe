import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../NavBar";

const TherapyPage = () => {
    const { therapyId } = useParams(); // Get the therapyId from the URL params
    const [therapy, setTherapy] = useState(null);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchTherapy = async () => {
            try {
                const response = await axiosPrivate.get(`/therapies/${therapyId}`);
                setTherapy(response.data.resource);
            } catch (error) {
                console.error(error);
                // Handle error, e.g., show a message or navigate to an error page
            }
        };

        fetchTherapy();
    }, [axiosPrivate, therapyId]);

    return (
        <section>
            <NavBar />
            <h2>Therapy Details</h2>
            {therapy ? (
                <div>
                    <p>Name: {therapy.name}</p>
                    <p>Description: {therapy.description}</p>
                    {/* Add other details you want to display */}
                    <Link to={`/therapies/${therapyId}/appointments`}>
                        <button>See Appointments</button>
                    </Link>
                </div>
            ) : (
                <p>Loading therapy details...</p>
            )}
        </section>
    );
};

export default TherapyPage;