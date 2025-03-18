// AuthorProfile.js
import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ArticleContext } from '../../../contexts/ArticleContext';
import './AuthorProfile.css';

function AuthorProfile() {
  const {
    searchTerm,
    filterOpen,
    mobileMenuOpen,
    filters,
    activeFilterCount,
    setFilterOpen,
    setMobileMenuOpen,
    handleSearch,
    handleFilterChange,
    clearAllFilters
  } = useContext(ArticleContext);

  return (
    <div className='AuthorProfile'>
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent">
        <div className="container-fluid nav-container">
          <div className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
            </svg>
          </div>
          
          <div className={`nav-section ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink 
                  to="articles" 
                  className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Articles
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="article" 
                  className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Post Article
                </NavLink>
              </li>
            </ul>
          </div>
          
          <div className={`search-filter-section ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <div className="search-container">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className="search-button" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </button>
            </div>
            
            <div className="filter-container">
              <button 
                className={`filter-button ${filterOpen ? 'active' : ''}`}
                onClick={() => setFilterOpen(!filterOpen)}
                aria-label="Filter categories"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-funnel" viewBox="0 0 16 16">
                  <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z"/>
                </svg>
                <span>Categories</span>
                {activeFilterCount > 0 && (
                  <span className="filter-count">{activeFilterCount}</span>
                )}
              </button>
              
              {filterOpen && (
                <div className="filter-dropdown">
                  <div className="filter-header">
                    <span>Filter by Category</span>
                  </div>
                  
                  <div className="filter-option">
                    <input 
                      type="checkbox" 
                      id="programming" 
                      checked={filters.programming}
                      onChange={() => handleFilterChange('programming')}
                    />
                    <label htmlFor="programming">Programming</label>
                  </div>
                  
                  <div className="filter-option">
                    <input 
                      type="checkbox" 
                      id="aiml" 
                      checked={filters.aiml}
                      onChange={() => handleFilterChange('aiml')}
                    />
                    <label htmlFor="aiml">AI & ML</label>
                  </div>
                  
                  <div className="filter-option">
                    <input 
                      type="checkbox" 
                      id="database" 
                      checked={filters.database}
                      onChange={() => handleFilterChange('database')}
                    />
                    <label htmlFor="database">Database</label>
                  </div>
                  
                  <div className="filter-option">
                    <input 
                      type="checkbox" 
                      id="webDevelopment" 
                      checked={filters.webDevelopment}
                      onChange={() => handleFilterChange('webDevelopment')}
                    />
                    <label htmlFor="webDevelopment">Web Development</label>
                  </div>
                  
                  <div className="filter-option">
                    <input 
                      type="checkbox" 
                      id="cybersecurity" 
                      checked={filters.cybersecurity}
                      onChange={() => handleFilterChange('cybersecurity')}
                    />
                    <label htmlFor="cybersecurity">Cybersecurity</label>
                  </div>
                  
                  {activeFilterCount > 0 && (
                    <div className="filter-actions">
                      <button 
                        className="clear-filters"
                        onClick={clearAllFilters}
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthorProfile;