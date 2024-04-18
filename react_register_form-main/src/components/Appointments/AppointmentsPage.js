import Appintments from './Appointments';
import { useParams } from 'react-router-dom';
import NavBar from "../Main/NavBar";

const AppointmentsPage = () => {
    const { therapyId } = useParams();

    return (
        <>
            <NavBar />
            <section>
                <Appintments therapyId = {therapyId} />
            </section>
        </>
        
    )
}

export default AppointmentsPage