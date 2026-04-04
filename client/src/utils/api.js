import axios from 'axios';

const api = axios.create({
  // Buradaki link senin Vercel backend linkin olmalı
  baseURL: 'https://campify-melisa.vercel.app/api' 
});

export default api;