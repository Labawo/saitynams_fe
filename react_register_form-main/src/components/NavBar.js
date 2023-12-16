import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import useAuth from "../hooks/UseAuth";

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

    return (
        <nav className="navbar">
            <div className="navbar-links">
                <Link to="/" className='nav-link white-bg'>Home</Link>
                <Link to="/therapies" className='nav-link white-bg'>Therapies</Link>
                <Link to="/editor" className={canAccessDoctor ? 'nav-link white-bg' : 'hidden'}>Editor</Link>
                <Link to="/admin" className={canAccessAdmin ? 'nav-link white-bg' : 'hidden'}>Admin</Link>
                <Link to="/lounge" className={canAccessAdminDoctor ? 'nav-link white-bg' : 'hidden'}>Lounge</Link>
            </div>
            
            <button onClick={logout} className="logout-btn">Sign Out</button>
        </nav>
    );
};

export default NavBar;