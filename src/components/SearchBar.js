import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './SearchBar.css';

const SearchBar = ({ onSearchResults }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!searchQuery.trim()) {
            toast.warning('Please enter a search term');
            return;
        }

        setIsSearching(true);

        try {
            const response = await axios.get(
                `http://localhost:8080/api/products/search?query=${searchQuery}`
            );
            
            onSearchResults(response.data);
            toast.success(`Found ${response.data.length} products`);
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Search feature coming soon!');
            // For now, just keep showing all products
            onSearchResults(null);
        } finally {
            setIsSearching(false);
        }
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleClear = () => {
        setSearchQuery('');
        onSearchResults(null);
    };

    return (
        <div className="search-bar-container">
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search for clothing, categories..."
                    value={searchQuery}
                    onChange={handleInputChange}
                />
                {searchQuery && (
                    <button 
                        type="button"
                        className="clear-button"
                        onClick={handleClear}
                    >
                        ✕
                    </button>
                )}
                <button 
                    type="submit" 
                    className="search-button"
                    disabled={isSearching}
                >
                    {isSearching ? (
                        <span className="spinner"></span>
                    ) : (
                        <span className="search-icon">🔍</span>
                    )}
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
