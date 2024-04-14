import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../Main/NavBar";

const TherapyPage = () => {
    const { therapyId } = useParams(); // Get the therapyId from the URL params
    const [therapy, setTherapy] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTherapy = async () => {
            try {
                const response = await axiosPrivate.get(`/therapies/${therapyId}`);
                setTherapy(response.data.resource);
            } catch (error) {
                console.error(error);
                // Handle error, e.g., show a message or navigate to an error page
                if (error.response && error.response.status === 404) {
                    navigate(-1);
                }
            }
        };

        fetchTherapy();
    }, [axiosPrivate, therapyId]);

    return (
        <section className="therapy-page">
            <NavBar />
            {therapy ? (
                <div className="therapy-details">
                    <h2>{therapy.name}</h2>
                    <p>{therapy.description}</p>
                    {/* Display the image if available */}
                    {therapy.imageData && (
                        <img src={therapy.imageData} alt="Therapy" className="therapy-image" />
                    )}
                    <Link to={`/therapies/${therapyId}/appointments`}>
                        <button className="appointments-button">See Appointments</button>
                    </Link>
                </div>
            ) : (
                <p>Loading therapy details...</p>
            )}
        </section>
    );
};

export default TherapyPage;
