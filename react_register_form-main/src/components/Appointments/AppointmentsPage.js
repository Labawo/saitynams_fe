import Appintments from './Appointments';
import { useParams } from 'react-router-dom';
import NavBar from "../Main/NavBar";
import Footer from "../Main/Footer";

const AppointmentsPage = () => {
    const { therapyId } = useParams();

    return (
        <>
            <NavBar />
            <section>
                <Appintments therapyId = {therapyId} />
            </section>
            <Footer />
        </>
        
    )
}

export default AppointmentsPage