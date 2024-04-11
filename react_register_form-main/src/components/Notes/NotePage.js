import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import NavBar from "../Main/NavBar";
//import "./NotePage.css"; // Import a CSS file for styling (create NotePage.css in the same directory)

const NotePage = () => {
    const { noteId } = useParams(); // Get the noteId from the URL params
    const [note, setNote] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await axiosPrivate.get(`/notes/${noteId}`);
                setNote(response.data);
            } catch (error) {
                console.error(error);
                // Handle error, e.g., show a message or navigate to an error page
            }
        };

        fetchNote();
    }, [axiosPrivate, noteId]);

    return (
        <section className="note-page">
            <NavBar />
            {note ? (
                <div className="note-details">
                    <h2>{note.title}</h2>
                    <p>{note.content}</p>
                </div>
            ) : (
                <p>Loading note details...</p>
            )}
        </section>
    );
};

export default NotePage;
