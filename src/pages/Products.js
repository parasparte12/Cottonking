import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Men', 'Women', 'Kids', 'Accessories'];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            console.log('📡 Fetching products from backend at http://localhost:8080/api/products...');
            
            const response = await axios.get('http://localhost:8080/api/products', {
                timeout: 5000
            });
            
            console.log('✅ SUCCESS! Loaded', response.data.length, 'products from backend');
            console.log('📦 Sample product:', response.data[0]);
            
            // Set REAL data from backend
            setProducts(response.data);
            setFilteredProducts(response.data);
            setLoading(false);
            
            toast.success(`✅ Loaded ${response.data.length} real products!`);
            
        } catch (error) {
            console.error('❌ ERROR:', error.message);
            console.log('Backend URL:', 'http://localhost:8080/api/products');
            console.log('Is backend running on port 8080?');
            
            // Show error toast but DON'T use demo data
            toast.error('❌ Cannot connect to backend. Make sure Spring Boot is running on port 8080');
            
            setLoading(false);
            setProducts([]);
            setFilteredProducts([]);
        }
    };

    const handleSearchResults = (results) => {
        if (results) {
            setFilteredProducts(results);
        } else {
            setFilteredProducts(products);
        }
    };

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
        if (category === 'All') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(p => p.category === category);
            setFilteredProducts(filtered);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-large"></div>
                <p>Loading products from backend...</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="no-products" style={{padding: '100px 20px', textAlign: 'center'}}>
                <h2>❌ No Products Available</h2>
                <p>Make sure your Spring Boot backend is running on http://localhost:8080</p>
                <p>Check the browser console (F12) for error messages.</p>
                <button 
                    onClick={() => window.location.reload()}
                    style={{
                        padding: '10px 30px',
                        fontSize: '16px',
                        backgroundColor: '#2d5f3a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    🔄 Retry
                </button>
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="products-header">
                <h1>Our Collection</h1>
                <p>Discover the finest cotton clothing for everyone</p>
            </div>

            <SearchBar onSearchResults={handleSearchResults} />

            <div className="category-filter">
                {categories.map(category => (
                    <button
                        key={category}
                        className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => handleCategoryFilter(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {filteredProducts.length === 0 ? (
                <div className="no-products">
                    <h2>No products found</h2>
                    <p>Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="products-grid">
                    <p style={{gridColumn: '1 / -1', color: '#666', textAlign: 'center', marginBottom: '10px'}}>
                        ✅ Showing {filteredProducts.length} real products from backend
                    </p>
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;

