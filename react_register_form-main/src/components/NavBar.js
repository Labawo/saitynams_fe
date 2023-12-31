import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import useAuth from "../hooks/UseAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {

    const { setAuth } = useContext(AuthContext);
    const { auth } = useAuth();
    const navigate = useNavigate();

    const logout = async () => {
        // if used in more components, this should be in context 
        // axios to /logout endpoint 
        setAuth({});
        navigate('/login');
    }

    const canAccessAdmin = auth.roles.includes("Admin");
    const canAccessDoctor = auth.roles.includes("Doctor") && !auth.roles.includes("Admin");
    const canAccessAdminDoctor = auth.roles.includes("Doctor") && auth.roles.includes("Admin");
    const canAccessPatient = auth.roles.includes("Patient");

    return (
        <nav className="navbar">
            <div className="navbar-links">
                <Link to="/" className='nav-link white-bg'>Home</Link>
                <Link to="/therapies" className='nav-link white-bg'>Therapies</Link>
                <Link to="/editor" className={canAccessDoctor ? 'nav-link white-bg' : 'hidden'}>Weekly Appointments</Link>
                <Link to="/admin" className={canAccessAdmin ? 'nav-link white-bg' : 'hidden'}>Admin</Link>
                <Link to="/registerDoctor" className={canAccessAdmin ? 'nav-link white-bg' : 'hidden'}>Register Doctor</Link>
                <Link to="/myAppointments" className={canAccessPatient ? 'nav-link white-bg' : 'hidden'}>My Appointments</Link>
            </div>
            
            <button onClick={logout} className="logout-btn">
                <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
        </nav>
    );
};

export default NavBar;