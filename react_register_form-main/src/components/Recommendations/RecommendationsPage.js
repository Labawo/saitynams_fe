import Recommendations from './Recommendations';
import { useParams } from 'react-router-dom';
import NavBar from "../NavBar";

const RecommendationsPage = () => {
    const { therapyId, appointmentId } = useParams();

    return (
        <section>
            <NavBar />
            <br />
            <Recommendations therapyId = {therapyId} appointmentId = {appointmentId} />
            <br />
        </section>
    )
}

export default RecommendationsPage