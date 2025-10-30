import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('ALL');

  // ✅ PRODUCTS WITH REAL IMAGE URLs
  const defaultProducts = [
    { id: 1, name: 'Cotton Casual Shirt', category: 'MEN', price: 1299, originalPrice: 1699, discount: 23, rating: 4.5, reviews: 120, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=300&fit=crop' },
    { id: 2, name: 'Formal Trouser', category: 'MEN', price: 1499, originalPrice: 1899, discount: 20, rating: 4.2, reviews: 85, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=300&fit=crop' },
    { id: 3, name: 'Traditional Kurta', category: 'MEN', price: 1799, originalPrice: 2299, discount: 22, rating: 4.7, reviews: 150, image: 'https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?w=400&h=300&fit=crop' },
    { id: 4, name: 'Indo Western Sherwani', category: 'MEN', price: 3999, originalPrice: 5299, discount: 25, rating: 4.8, reviews: 95, image: 'https://images.unsplash.com/photo-1633455583793-38db7c6c6f99?w=400&h=300&fit=crop' },
    { id: 5, name: 'Women Cotton Kurti', category: 'WOMEN', price: 1199, originalPrice: 1599, discount: 25, rating: 4.6, reviews: 200, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=400&h=300&fit=crop' },
    { id: 6, name: 'Women Palazzo Set', category: 'WOMEN', price: 999, originalPrice: 1299, discount: 23, rating: 4.4, reviews: 150, image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=300&fit=crop' },
    { id: 7, name: 'Designer Saree', category: 'WOMEN', price: 3199, originalPrice: 4099, discount: 22, rating: 4.8, reviews: 180, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop' },
    { id: 8, name: 'Anarkali Dress', category: 'WOMEN', price: 2499, originalPrice: 3299, discount: 24, rating: 4.7, reviews: 130, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop' },
    { id: 9, name: 'Kids T-Shirt', category: 'KIDS', price: 699, originalPrice: 999, discount: 30, rating: 4.5, reviews: 95, image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=300&fit=crop' },
    { id: 10, name: 'Kids Shorts', category: 'KIDS', price: 599, originalPrice: 899, discount: 33, rating: 4.3, reviews: 80, image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=300&fit=crop' },
    { id: 11, name: 'Kids Ethnic Kurta', category: 'KIDS', price: 1099, originalPrice: 1499, discount: 27, rating: 4.6, reviews: 110, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop' },
    { id: 12, name: 'Kids Party Wear', category: 'KIDS', price: 1799, originalPrice: 2499, discount: 28, rating: 4.7, reviews: 90, image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=300&fit=crop' }
  ];

  // ✅ Set products state directly from defaultProducts, no fetch needed
  const [products, setProducts] = useState(defaultProducts);

  // ❌ Removed loading state, useEffect, and fetchProducts function

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === product.id);
    if (index > -1) {
      cart[index].quantity += 1;
      toast.info('Quantity increased!');
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: 1
      });
      toast.success('Added to cart!');
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/cart');
  };

  // ❌ Removed loading check

  // ✅ This filter now correctly filters the full list of products
  const filtered = category === 'ALL' ? products : products.filter(p => p.category === category);

  return (
    <div className="home">
      <div className="hero-section">
        <h1>🌿 CottonKing</h1>
        <p>Premium Cotton Clothing for Everyone</p>
      </div>

      <div className="filter-buttons">
        <button onClick={() => setCategory('ALL')} className={category === 'ALL' ? 'active' : ''}>All</button>
        <button onClick={() => setCategory('MEN')} className={category === 'MEN' ? 'active' : ''}>Men</button>
        <button onClick={() => setCategory('WOMEN')} className={category === 'WOMEN' ? 'active' : ''}>Women</button>
        <button onClick={() => setCategory('KIDS')} className={category === 'KIDS' ? 'active' : ''}>Kids</button>
      </div>

      {filtered.length > 0 ? (
        <div className="products-grid">
          {filtered.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                {/* This will now have a valid URL from defaultProducts */}
                <img src={product.image} alt={product.name} />
                {product.discount && <span className="discount-badge">{product.discount}%</span>}
              </div>
              <h3>{product.name}</h3>
              <p className="category-info">{product.category}</p>
              <div className="price-section">
                <span className="current-price">₹{product.price}</span>
                <span className="old-price">₹{product.originalPrice}</span>
              </div>
              <div className="rating-section">⭐ {product.rating ? product.rating.toFixed(1) : 0} ({product.reviews} reviews)</div>
              <button className="add-cart-btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results"><h2>No products</h2></div>
      )}
    </div>
  );
};

export default Home;