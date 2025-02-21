import { Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

const MainLayout = () => {
    return (
        <div>
            <Navbar onAddTask={(task) => console.log("New Task Added:", task)} />
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;