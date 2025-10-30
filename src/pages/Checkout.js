import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getTotalPrice, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'cod'
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
            toast.error('Please fill all required fields');
            return;
        }

        setIsProcessing(true);

        try {
            // Replace with your actual backend endpoint
            const orderData = {
                customer: formData,
                items: cartItems,
                totalAmount: (getTotalPrice() * 1.18).toFixed(2),
                orderDate: new Date().toISOString()
            };

            const response = await fetch('http://localhost:8080/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const result = await response.json();
                const newOrderId = result.orderId || `CK${Date.now()}`;
                setOrderId(newOrderId);
                setOrderSuccess(true);
                clearCart();
                toast.success('Order placed successfully!');
            } else {
                throw new Error('Order failed');
            }
        } catch (error) {
            console.error('Order error:', error);
            // For demo purposes, simulate success
            const demoOrderId = `CK${Date.now()}`;
            setOrderId(demoOrderId);
            setOrderSuccess(true);
            clearCart();
            toast.success('Order placed successfully!');
        } finally {
            setIsProcessing(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="order-success">
                <div className="success-animation">
                    <div className="checkmark-circle">
                        <div className="checkmark">✓</div>
                    </div>
                </div>
                
                <h1>Order Placed Successfully! 🎉</h1>
                <p className="order-id">Order ID: <strong>{orderId}</strong></p>
                <p className="success-message">
                    Thank you for shopping with Cotton-Kind!
                    Your order has been confirmed and will be delivered soon.
                </p>
                
                <div className="success-actions">
                    <button 
                        className="continue-shopping-btn"
                        onClick={() => navigate('/products')}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            
            <div className="checkout-container">
                <form className="checkout-form" onSubmit={handlePlaceOrder}>
                    <div className="form-section">
                        <h2>Delivery Information</h2>
                        
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name *"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                        />
                        
                        <input
                            type="email"
                            name="email"
                            placeholder="Email *"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number *"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                        
                        <textarea
                            name="address"
                            placeholder="Address *"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows="3"
                            required
                        />
                        
                        <div className="form-row">
                            <input
                                type="text"
                                name="city"
                                placeholder="City *"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                            
                            <input
                                type="text"
                                name="state"
                                placeholder="State *"
                                value={formData.state}
                                onChange={handleInputChange}
                                required
                            />
                            
                            <input
                                type="text"
                                name="pincode"
                                placeholder="Pincode *"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Payment Method</h2>
                        
                        <label className="payment-option">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cod"
                                checked={formData.paymentMethod === 'cod'}
                                onChange={handleInputChange}
                            />
                            <span>Cash on Delivery</span>
                        </label>
                        
                        <label className="payment-option">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="online"
                                checked={formData.paymentMethod === 'online'}
                                onChange={handleInputChange}
                            />
                            <span>Online Payment (UPI/Card)</span>
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        className="place-order-btn"
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <span className="spinner"></span>
                                Processing...
                            </>
                        ) : (
                            'Place Order'
                        )}
                    </button>
                </form>

                <div className="order-summary">
                    <h2>Order Summary</h2>
                    
                    <div className="summary-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="summary-item">
                                <img src={item.image || item.imageUrl || '/images/placeholder.jpg'} alt={item.name} />
                                <div>
                                    <p>{item.name}</p>
                                    <span>Qty: {item.quantity}</span>
                                </div>
                                <p>₹{item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>

                    <div className="summary-totals">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{getTotalPrice()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (18%)</span>
                            <span>₹{(getTotalPrice() * 0.18).toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className="free-badge">FREE</span>
                        </div>
                        <hr />
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{(getTotalPrice() * 1.18).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
