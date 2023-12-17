import Appintments from './Appointments';
import { useParams } from 'react-router-dom';
import NavBar from "../NavBar";

const AppointmentsPage = () => {
    const { therapyId } = useParams();

    return (
        <section>
            <NavBar />
            <br />
            <Appintments therapyId = {therapyId} />
            <br />
        </section>
    )
}

export default AppointmentsPage