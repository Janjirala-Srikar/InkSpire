// ArticleContext.js
import { createContext, useState, useEffect } from 'react';

export const ArticleContext = createContext();

export function ArticleContextProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    programming: false,
    aiml: false,
    database: false,
    webDevelopment: false,
    cybersecurity: false
  });

  const handleFilterChange = (filterName) => {
    setFilters({
      ...filters,
      [filterName]: !filters[filterName]
    });
  };

  // Click outside to close filter dropdown
  const handleClickOutside = (e) => {
    if (filterOpen && !e.target.closest('.filter-container')) {
      setFilterOpen(false);
    }
    if (mobileMenuOpen && !e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu-toggle')) {
      setMobileMenuOpen(false);
    }
  };

  // Add event listener when filter is open
  useEffect(() => {
    if (filterOpen || mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterOpen, mobileMenuOpen]);

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(value => value).length;

  // Function to handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Reset all filters
  const clearAllFilters = () => {
    setFilters({
      programming: false,
      aiml: false,
      database: false,
      webDevelopment: false,
      cybersecurity: false
    });
  };

  return (
    <ArticleContext.Provider value={{
      searchTerm,
      setSearchTerm,
      filterOpen,
      setFilterOpen,
      mobileMenuOpen,
      setMobileMenuOpen,
      filters,
      setFilters,
      handleFilterChange,
      activeFilterCount,
      handleSearch,
      clearAllFilters
    }}>
      {children}
    </ArticleContext.Provider>
  );
}