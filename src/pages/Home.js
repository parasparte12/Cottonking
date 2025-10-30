import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Home.css';

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  const allProducts = [
    { 
      id: 1, name: 'Cotton Casual Shirt', category: 'MEN', subCategory: 'WESTERN', 
      price: 999, originalPrice: 1299, discount: 23, rating: 4.5, reviews: 120, 
      imageUrl: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400&h=500',
      description: 'Comfortable cotton shirt for casual wear'
    },
    { 
      id: 2, name: 'Formal Trouser', category: 'MEN', subCategory: 'WESTERN', 
      price: 1199, originalPrice: 1499, discount: 20, rating: 4.2, reviews: 85, 
      imageUrl: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400&h=500',
      description: 'Formal trouser for office and parties'
    },
    { 
      id: 3, name: 'Traditional Kurta', category: 'MEN', subCategory: 'TRADITIONAL', 
      price: 1399, originalPrice: 1799, discount: 22, rating: 4.7, reviews: 150, 
      imageUrl: 'https://images.pexels.com/photos/6069857/pexels-photo-6069857.jpeg?auto=compress&cs=tinysrgb&w=400&h=500',
      description: 'Traditional cotton kurta for festivals'
    },
    { 
      id: 4, name: 'Indo Western Sherwani', category: 'MEN', subCategory: 'INDO_WESTERN', 
      price: 2999, originalPrice: 3999, discount: 25, rating: 4.8, reviews: 95, 
      imageUrl: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400&h=500',
      description: 'Designer sherwani for weddings'
    },
    { 
      id: 5, name: 'Cotton Kurti', category: 'WOMEN', subCategory: 'WESTERN', 
      price: 899, originalPrice: 1199, discount: 25, rating: 4.6, reviews: 200, 
      imageUrl: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=400&h=500',
      description: 'Comfortable cotton kurti for daily wear'
    },
    { 
      id: 6, name: 'Palazzo Pants', category: 'WOMEN', subCategory: 'WESTERN', 
      price: 799, originalPrice: 999, discount: 20, rating: 4.4, reviews: 150, 
      imageUrl: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400&h=500',
      description: 'Flowy palazzo pants for comfort'
    },
    { 
      id: 7, name: 'Traditional Saree', category: 'WOMEN', subCategory: 'TRADITIONAL', 
      price: 2499, originalPrice: 3199, discount: 22, rating: 4.8, reviews: 180, 
      imageUrl: 'https://images.pexels.com/photos/3472614/pexels-photo-3472614.jpeg?auto=compress&cs=tinysrgb&w=400&h=500',
      description: 'Elegant traditional cotton saree'
    },
    { 
      id: 8, name: 'Designer Anarkali', category: 'WOMEN', subCategory: 'INDO_WESTERN', 
      price: 1899, originalPrice: 2499, discount: 24, rating: 4.7, reviews: 130, 
      imageUrl: 'https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg?auto=compress&cs=tinysrgb&w=400&h=500',
      description: 'Beautiful anarkali dress for special occasions'
    },
    { 
      id: 9, name: 'Kids Cotton T-Shirt', category: 'KIDS', subCategory: 'WESTERN', 
      price: 499, originalPrice: 699, discount: 28, rating: 4.5, reviews: 95, 
      imageUrl: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400&h=500',
      description: 'Soft cotton t-shirt for kids'
    },
    { 
      id: 10, name: 'Kids Shorts', category: 'KIDS', subCategory: 'WESTERN', 
      price: 399, originalPrice: 599, discount: 33, rating: 4.3, reviews: 80, 
      imageUrl: 'https://images.pexels.com/photos/1620766/pexels-photo-1620766.jpeg?auto=compress&cs=tinysrgb&w=400&h=500',
      description: 'Comfortable shorts for active kids'
    },
    { 
      id: 11, name: 'Kids Ethnic Kurta', category: 'KIDS', subCategory: 'TRADITIONAL', 
      price: 799, originalPrice: 1099, discount: 27, rating: 4.6, reviews: 110, 
      imageUrl: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400&h=500',
      description: 'Traditional kurta for kids festivals'
    },
    { 
      id: 12, name: 'Kids Party Wear', category: 'KIDS', subCategory: 'INDO_WESTERN', 
      price: 1299, originalPrice: 1799, discount: 28, rating: 4.7, reviews: 90, 
      imageUrl: 'https://images.pexels.com/photos/1148999/pexels-photo-1148999.jpeg?auto=compress&cs=tinysrgb&w=400&h=500',
      description: 'Stylish party wear for kids'
    },
  ];

  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [imageErrors, setImageErrors] = useState({});

  const getFallbackImage = (productName) => {
    return `https://via.placeholder.com/400x500/2d5f3a/ffffff?text=${encodeURIComponent(productName)}`;
  };

  // ✅ SIMPLE ADD TO CART - NO REDIRECT DELAY
  const handleAddToCart = (product) => {
    console.log('🛒 ADD TO CART CLICKED FOR:', product.name);
    
    try {
      const cartData = localStorage.getItem('cart');
      let cart = cartData ? JSON.parse(cartData) : [];
      
      const existingIndex = cart.findIndex(item => item.id === product.id);
      
      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
        toast.info(`${product.name} quantity increased!`);
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.imageUrl,
          category: `${product.category}`,
          quantity: 1
        });
        toast.success(`${product.name} added to cart!`);
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('✅ Cart saved, now navigating to /cart');
      
      // DIRECT NAVIGATION - NO TIMEOUT
      navigate('/cart');
      
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Failed to add to cart!');
    }
  };

  useEffect(() => {
    let filtered = allProducts;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subCategory.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryQuery) {
      filtered = filtered.filter(product =>
        product.category === categoryQuery
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, categoryQuery]);

  const handleImageError = (productId, productName) => {
    console.log('Image failed to load for:', productName);
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  return (
    <div className="home">
      <div className="hero-section">
        <h1>🌿 CottonKing</h1>
        <p>Premium Cotton Clothing for Everyone</p>
      </div>

      <div className="filter-buttons">
        <a href="/" className={!categoryQuery ? 'active' : ''}>All Products</a>
        <a href="/?category=MEN">Men</a>
        <a href="/?category=WOMEN">Women</a>
        <a href="/?category=KIDS">Kids</a>
      </div>

      {searchQuery && (
        <div className="search-info">
          <h3>🔍 Search results for: "{searchQuery}"</h3>
          <p>Found {filteredProducts.length} product(s)</p>
        </div>
      )}

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img 
                  src={imageErrors[product.id] ? getFallbackImage(product.name) : product.imageUrl}
                  alt={product.name}
                  onError={() => handleImageError(product.id, product.name)}
                  loading="lazy"
                />
              </div>
              <span className="discount-badge">{product.discount}% OFF</span>
              <h3>{product.name}</h3>
              <p className="category-info">{product.category} • {product.subCategory}</p>
              <div className="price-section">
                <span className="current-price">₹{product.price}</span>
                <span className="old-price">₹{product.originalPrice}</span>
              </div>
              <div className="rating-section">⭐ {product.rating} ({product.reviews} reviews)</div>
              
              {/* ✅ BUTTON ONCLICK DIRECTLY CALLS handleAddToCart */}
              <button 
                className="add-cart-btn" 
                onClick={() => handleAddToCart(product)}
                type="button"
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <div className="no-results">
            <h2>😞 No products found</h2>
            <p>No results for "{searchQuery}"</p>
            <a href="/" className="back-btn">← Back to all products</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
