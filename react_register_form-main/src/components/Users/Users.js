import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/UseAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Users = () => {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
                console.log(response.data);
                isMounted && setUsers(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    const deleteUser = async (userId) => {
        try {
          await axiosPrivate.delete(`/users/${userId}`);
          // Remove the deleted appointment from the state
          setUsers(prevUsers =>
            prevUsers.filter(user => user.id !== userId)
          );
        } catch (error) {
          console.error(`Error deleting user ${userId}:`, error);
          // Handle deletion error (e.g., show error message)
        }
      };

    return (
        <article>
            <div className="table-container">
                <h2 className="list-headers">Users List</h2>
                {users?.length
                    ? (
                        <table className="my-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, i) => (
                                    <tr key={i}>
                                        <td>{user?.userName}</td>
                                        <td>{user?.email}</td>
                                        <td>
                                            <button
                                                className="table_buttons"
                                                onClick={() => deleteUser(user.id)} // Invoke deleteAppointment on click
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <p>No users to display</p>
                }
            </div>
            
        </article>
    );
};

export default Users;