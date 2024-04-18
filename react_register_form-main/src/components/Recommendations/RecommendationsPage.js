import Recommendations from './Recommendations';
import { useParams } from 'react-router-dom';
import NavBar from "../Main/NavBar";

const RecommendationsPage = () => {
    const { therapyId, appointmentId } = useParams();

    return (
        <>
            <NavBar />
            <section>               
                <Recommendations therapyId = {therapyId} appointmentId = {appointmentId} />
            </section>
        </>
        
    )
}

export default RecommendationsPage