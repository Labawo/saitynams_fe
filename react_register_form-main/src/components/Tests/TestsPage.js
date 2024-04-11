import Tests from './Tests';
import NavBar from "../Main/NavBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const TestsPage = () => {

    return (
        <section>
            <NavBar />
            <Tests />
        </section>
    )
}

export default TestsPage