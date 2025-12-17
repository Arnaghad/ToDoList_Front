import axios from 'axios';

const instance = axios.create({
    baseURL: `http://${window.location.hostname}:5000/api`, // Dynamic hostname for LAN access
});

// Перехоплювач для додавання токена до запитів
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;