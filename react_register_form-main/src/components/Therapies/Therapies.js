import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";

const Therapies = () => {
    const [therapies, setTherapies] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();

    const handleInspect = (therapyId) => {
        // Navigate to the InspectPage with the therapyId parameter
        navigate(`/therapies/${therapyId}`);
    };

    const canAccessDoctor = auth.roles.includes("Doctor") && !auth.roles.includes("Admin");

    const fetchTherapies = useCallback(async (pageNumber) => {
        try {
            const response = await axiosPrivate.get('/therapies', {
                params: { pageNumber : pageNumber }, // Pass the page number as a query parameter
            });
            return response.data;
        } catch (err) {
            console.error(err);
            navigate('/login', { state: { from: location }, replace: true });
            return [];
        }
    }, [axiosPrivate, navigate, location]);

    const loadTherapies = async () => {
        if (isLoading) return;

        setIsLoading(true);
        const data = await fetchTherapies(page);
        setTherapies(prevTherapies => [...prevTherapies, ...data]);
        setPage(prevPage => prevPage + 1); // Move to the next page for the next load
        setIsLoading(false);
    };

    useEffect(() => {
        loadTherapies();
    }, []); // Load therapies only once on initial mount

    const createTherapy = async () => {
        // Logic to create a new therapy
        // This function will be triggered when the "Create Therapy" button is clicked
        // Implement the logic to create a new therapy using your API
    };

    return (
        <article>
            <div className="table-container">
                <h2>Therapies List</h2>
                {canAccessDoctor && (
                    <button onClick={createTherapy}>Create Therapy</button>
                )}
                {therapies.length ? (
                    <table className="my-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {therapies.map((therapy, i) => (
                                <tr key={i}>
                                    <td>{therapy?.name}</td>
                                    <td>{therapy?.id}</td>
                                    <td>
                                        <button 
                                            className="table_buttons_blue"
                                            onClick={() => handleInspect(therapy.id)}
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
                    <p>No therapies to display</p>
                )}
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <button onClick={loadTherapies}>Load More</button>
                )}
            </div>
        </article>
    );
};

export default Therapies;