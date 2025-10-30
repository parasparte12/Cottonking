import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // ✅ FIXED: REMOVE setTimeout - use direct navigate
  const handleAddToCart = () => {
    console.log('🔴 ADD TO CART CLICKED FOR:', product.name);
    setIsAdding(true);
    
    // Add to CartContext
    addToCart(product);
    
    // Save to localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = existingCart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
      existingCart[existingProductIndex].quantity += 1;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || product.imageUrl,
        category: product.category,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    console.log('🔴 Cart saved to localStorage:', existingCart);
    
    // ✅ DIRECT NAVIGATION - NO TIMEOUT
    setIsAdding(false);
    console.log('🔴 REDIRECTING TO CART...');
    navigate('/cart');
  };

  const imageUrl = product.image || (product.imageUrl ? `http://localhost:8080${product.imageUrl}` : '/images/placeholder.jpg');

  return (
    <div className="product-card">
      <img src={imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="category">{product.category}</p>
      <p className="price">₹{product.price}</p>
      <button 
        className={`add-btn ${isAdding ? 'adding' : ''}`}
        onClick={handleAddToCart}
        disabled={isAdding}
      >
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;
