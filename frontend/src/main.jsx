import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Set global base URL for all API requests to point to backend server
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
