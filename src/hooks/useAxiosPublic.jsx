import axios from "axios";

const axiosPublic = axios.create({
    baseURL: 'https://nailed-it-server.vercel.app'
})

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;