import Therapies from './Therapies';
import NavBar from "../Main/NavBar";
import "./TherapyPage.css"; // Import a CSS file for styling

const TherapiesPage = () => {
    return (
        <section className="therapies-page">
            <NavBar />
            <Therapies />
        </section>
    );
}

export default TherapiesPage;
