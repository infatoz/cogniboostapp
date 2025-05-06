import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://cogniboost-api.onrender.com', // Replace with your API base URL
    headers: {
         Authorization : `Bearer ${localStorage.getItem('token')}`
    }
});

export default axiosInstance;