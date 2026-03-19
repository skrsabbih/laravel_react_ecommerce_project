import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/style.scss'
import { AdminAuthProvider } from './components/context/AdminAuth.jsx';
import { CartProvider } from './components/context/CartContext.jsx';
import { CustomerAuthProvider } from './components/context/CustomerAuth.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminAuthProvider>
      <CustomerAuthProvider >
        <CartProvider>
          <App />
        </CartProvider>
      </CustomerAuthProvider>
    </AdminAuthProvider>
  </StrictMode >,
)
