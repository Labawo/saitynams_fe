import Appintments from './Appointments';
import { useParams } from 'react-router-dom';
import NavBar from "../Main/NavBar";

const AppointmentsPage = () => {
    const { therapyId } = useParams();

    return (
        <section>
            <NavBar />
            <Appintments therapyId = {therapyId} />
        </section>
    )
}

export default AppointmentsPage