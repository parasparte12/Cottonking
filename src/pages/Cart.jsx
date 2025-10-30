import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Load cart items when page opens
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  // Remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert('Item removed from cart');
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate total items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Handle checkout - THIS IS THE FIX
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        <p className="empty-cart-message">Add some items to get started!</p>
        <button onClick={() => navigate('/')} className="continue-shopping">
          ← Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-container">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>{item.category}</p>
                <p className="price">₹{item.price}</p>
              </div>
              <div className="quantity-control">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <input type="number" value={item.quantity} readOnly />
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <p className="item-total">₹{item.price * item.quantity}</p>
              <button onClick={() => removeFromCart(item.id)} className="remove-btn">Remove</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <span>Subtotal ({getTotalItems()} items):</span>
            <span>₹{calculateTotal().toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Shipping:</span>
            <span className="free">FREE</span>
          </div>
          <div className="summary-item">
            <span>Tax:</span>
            <span>₹{(calculateTotal() * 0.18).toFixed(2)}</span>
          </div>
          <div className="summary-item total">
            <span>Total:</span>
            <span>₹{(calculateTotal() * 1.18).toFixed(2)}</span>
          </div>

          {/* THIS IS THE BUTTON THAT NEEDS THE CLICK HANDLER */}
          <button 
            onClick={handleProceedToCheckout} 
            className="checkout-btn"
          >
            Proceed to Checkout
          </button>

          <button 
            onClick={() => navigate('/')} 
            className="continue-shopping-btn"
          >
            ← Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;

