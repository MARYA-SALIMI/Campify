import axios from 'axios';

// Backend'inin çalıştığı adresi buraya yazıyoruz. 
// Web için genelde backend'ler 5000 veya 8080 portunda çalışır.
const API_URL = 'http://localhost:5000/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;