import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import AIAssistant from './components/AIAssistant';
import Home from './pages/Home.jsx';  // This is your landing page
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
// ✅ FIXED: Changed this import from 'Products.js' to 'Home.js'
import Products from './pages/Home.js'; 
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.js';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <AIAssistant />
      </Router>
    </CartProvider>
  );
}

export default App;


