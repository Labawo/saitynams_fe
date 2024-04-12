import NavBar from "./NavBar";
import useAuth from "../../hooks/UseAuth";

const Home = () => {
    const { auth } = useAuth();

    return (
        <section>
            <NavBar />
            <h1>Home</h1>
            <br />
            <p>Hello {auth.user}, we are glad you are here!</p>            
        </section>
    )
}

export default Home