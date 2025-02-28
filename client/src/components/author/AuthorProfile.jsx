import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './AuthorProfile.css'; // Import custom styles

function AuthorProfile() {
  return (
    <div className='AuthorProfile'>
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent">
        <div className="container-fluid nav-container">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to="articles" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                Articles
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="article" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                Post Article
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthorProfile;