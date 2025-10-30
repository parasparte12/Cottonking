import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);

    // Get existing cart from localStorage (your original logic)
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = existingCart.findIndex(
      item => item.id === product.id
    );
    
    if (existingProductIndex !== -1) {
      // Increase quantity if product exists
      existingCart[existingProductIndex].quantity += 1;
    } else {
      // Add new product with quantity 1
      existingCart.push({ 
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || product.imageUrl,
        category: product.category,
        quantity: 1 
      });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Also add to CartContext for real-time updates
    addToCart(product);
    
    // Reset animation after 1 second
    setTimeout(() => {
      setIsAdding(false);
      // Optional: Navigate to cart after adding
      // navigate('/cart');
    }, 1000);
  };

  // Fix image path - handle both image and imageUrl properties
  const imageUrl = product.image || 
                   (product.imageUrl ? `http://localhost:8080${product.imageUrl}` : '/images/placeholder.jpg');

  // Render star rating if available
  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('⭐');
      } else if (i === fullStars && hasHalfStar) {
        stars.push('⭐');
      } else {
        stars.push('☆');
      }
    }
    return stars.join('');
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={imageUrl}
          alt={product.name}
          onError={(e) => {
            e.target.src = '/images/placeholder.jpg';
          }}
          className="product-image"
        />
        {product.discount && (
          <span className="discount-badge">{product.discount}% OFF</span>
        )}
      </div>
      
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        
        {product.rating && (
          <div className="product-rating">
            <span className="stars">{renderStars(product.rating)}</span>
            <span>({product.reviews || 0} reviews)</span>
          </div>
        )}
        
        <div className="price-section">
          <span className="product-price">₹{product.price}</span>
          {product.originalPrice && (
            <span className="original-price">₹{product.originalPrice}</span>
          )}
        </div>
        
        <button 
          className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <span className="checkmark">✓</span> Added!
            </>
          ) : (
            <>
              <span className="cart-icon">🛒</span> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;

