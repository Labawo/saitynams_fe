import NavBar from "./NavBar";
import useAuth from "../../hooks/UseAuth";

const Home = () => {
    const { auth } = useAuth();

    return (
        <>
            <NavBar />
            <section>                
                <h1>Home</h1>
                <br />
                <p>Hello {auth.user}, we are glad you are here!</p>            
            </section>
        </>
        
    )
}

export default Home