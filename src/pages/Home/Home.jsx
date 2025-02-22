import { useContext } from 'react';
import Task from "../Task/TaskLayout/Task";
import Banner from "./Banner";
import { AuthContext } from '../../providers/AuthProvider';

const Home = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    
    if (authLoading || user === undefined) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-bars loading-xl"></span>
            </div>
        );
    }

    return (
        <div>
            {user ? <Task /> : <Banner />}
        </div>
    );
};

export default Home;