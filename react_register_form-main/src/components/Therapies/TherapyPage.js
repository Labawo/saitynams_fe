import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";

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
        <div>
            <h2>Therapy Details</h2>
            {therapy ? (
                <div>
                    <p>Name: {therapy.name}</p>
                    <p>Description: {therapy.description}</p>
                    {/* Add other details you want to display */}
                </div>
            ) : (
                <p>Loading therapy details...</p>
            )}
        </div>
    );
};

export default TherapyPage;