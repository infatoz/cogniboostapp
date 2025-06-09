import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: 'http://localhost:3000', 
    baseURL: 'https://cogniboost-api.onrender.com', 
    headers: {
         Authorization : `Bearer ${localStorage.getItem('token')}`
    }
});

export default axiosInstance;