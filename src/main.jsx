import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/style.scss'
import App from './App.jsx'
import { AdminAuthProvider } from './components/Admin/context/AdminAuth.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   
       <App />
 
   
  </StrictMode>,
)
