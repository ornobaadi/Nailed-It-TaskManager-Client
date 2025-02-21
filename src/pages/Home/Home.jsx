import { useContext } from 'react';
import Task from "../Task/TaskLayout/Task";
import Banner from "./Banner";
import { AuthContext } from '../../providers/AuthProvider';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            {user ? <Task /> : <Banner />}
        </div>
    );
};

export default Home;