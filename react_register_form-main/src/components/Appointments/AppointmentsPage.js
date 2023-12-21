import Appintments from './Appointments';
import { useParams } from 'react-router-dom';
import NavBar from "../NavBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const AppointmentsPage = () => {
    const { therapyId } = useParams();

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // This will navigate back one step in the history
    };

    return (
        <section>
            <NavBar />
            <button onClick={handleGoBack} className="back-button">
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <br />
            <Appintments therapyId = {therapyId} />
            <br />
        </section>
    )
}

export default AppointmentsPage