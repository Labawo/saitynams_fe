import React, { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Tests = () => {
    const [tests, setTests] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();

    const fetchTests = useCallback(async (pageNumber) => {
        try {
            const response = await axiosPrivate.get('/tests', {
                params: { pageNumber: pageNumber }, // Pass the page number as a query parameter
            });
            return response.data;
        } catch (err) {
            console.error(err);
            navigate('/login', { state: { from: location }, replace: true });
            return [];
        }
    }, [axiosPrivate, navigate, location]);

    const loadTests = async () => {
        if (isLoading) return;

        setIsLoading(true);
        const data = await fetchTests(page);
        setTests(prevTests => [...prevTests, ...data]);
        setPage(prevPage => prevPage + 1); // Move to the next page for the next load
        setIsLoading(false);
    };

    useEffect(() => {
        loadTests();
    }, []); // Load tests only once on initial mount

    const removeTest = async (testId) => {
        try {
            await axiosPrivate.delete(`/tests/${testId}`);
            setTests(prevTests =>
                prevTests.filter(test => test.id !== testId)
            );
        } catch (error) {
            console.error(`Error removing test ${testId}:`, error);
            // Handle error as needed
        }
    };

    const createTest = () => {
        // Navigate to the Create Test page
        navigate(`/tests/createTest`);
    };

    return (
        <article className="tests-container">
            <div className="table-container">
                <h2 className="list-headers">Tests List</h2>
                <button onClick={createTest} className="create-button-v1"> + </button>
                {tests.length ? (
                    <table className="my-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Score</th>
                                {auth.roles.includes("Admin") && <th>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {tests.map((test, i) => (
                                <tr key={i}>
                                    <td>{test?.name}</td>
                                    <td>{test?.score}</td>
                                    {auth.roles.includes("Admin") && (
                                        <td>
                                            <button
                                                className="table-buttons-red"
                                                onClick={() => removeTest(test.id)} // Call remove function on click
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No tests to display</p>
                )}
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <button onClick={loadTests} className="load-button-v1">...</button>
                )}
            </div>
        </article>
    );
};

export default Tests;
