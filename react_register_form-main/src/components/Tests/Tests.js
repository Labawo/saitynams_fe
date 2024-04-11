import React, { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import useAuth from "../../hooks/UseAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Tests = () => {
    const [tests, setTests] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState(""); // State for selected patient
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const isAdmin = auth.roles.includes("Admin");

    const fetchTests = useCallback(async (pageNumber, patientId) => {
        try {
            const response = await axiosPrivate.get('/tests', {
                params: { pageNumber: pageNumber, patientId: patientId },
            });
            return response.data;
        } catch (err) {
            console.error(err);
            return [];
        }
    }, [axiosPrivate]);

    const fetchPatients = useCallback(async () => {
        try {
            const response = await axiosPrivate.get("/patients");
            setPatients(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    }, [axiosPrivate]);

    useEffect(() => {
        if (isAdmin) {
            fetchPatients();
        } else {
            loadTests();
        }
    }, [isAdmin, fetchPatients]);

    useEffect(() => {
        if (selectedPatientId) {
            console.log(selectedPatientId);
            setPage(1); // Reset page number
            setTests([]); // Clear existing tests
            loadTests(); // Load tests for the selected patient
        }
    }, [selectedPatientId]);

    const loadTests = useCallback(async () => {
        if (isLoading) return;
    
        setIsLoading(true);
        
        const data = await fetchTests(1, selectedPatientId); // Fetch data for the first page
        setTests(data); // Replace existing tests with the new ones
        setIsLoading(false);
    }, [fetchTests, isLoading, selectedPatientId]);
    
    const loadNextPageTests = useCallback(async () => {
        if (isLoading) return;
    
        setIsLoading(true);
    
        const data = await fetchTests(page, selectedPatientId); // Fetch data for the current page
        setTests(prevTests => [...prevTests, ...data]); // Append the new tests to the existing ones
        setPage(prevPage => prevPage + 1); // Increment the page number
        setIsLoading(false);
    }, [fetchTests, isLoading, selectedPatientId, page]);

    const removeTest = async (testId) => {
        try {
            await axiosPrivate.delete(`/tests/${testId}`);
            setTests(prevTests =>
                prevTests.filter(test => test.id !== testId)
            );
        } catch (error) {
            console.error(`Error removing test ${testId}:`, error);
        }
    };

    const handlePatientSelect = (e) => {
        const newPatientId = e.target.value;
        setSelectedPatientId(newPatientId);
    }; 

    return (
        <article className="tests-container">
            {isAdmin && patients.length > 0 && ( // Render patient selection only if user is admin and patients data is available
                <div className="patient-selection">
                    <label htmlFor="patientSelect">Select Patient:</label>
                    <select id="patientSelect" onChange={handlePatientSelect}>
                        <option value="">Select Patient</option>
                        {patients.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                                {patient.userName}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <div className="table-container">
                {tests.length ? (
                    <table className="my-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Score</th>
                                {isAdmin && <th>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {tests.map((test, i) => (
                                <tr key={i}>
                                    <td>{test?.name}</td>
                                    <td>{test?.score}</td>
                                    {isAdmin && (
                                        <td>
                                            <button
                                                className="table-buttons-red"
                                                onClick={() => removeTest(test.id)}
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
                    <button onClick={loadNextPageTests} className="load-button-v1">Load More</button>
                )}
            </div>
        </article>
    );
};

export default Tests;
