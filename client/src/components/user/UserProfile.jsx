import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './UserProfile.css'; // Import custom styles

function UserProfile() {
  return (
    <div className='UserProfile'>
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent">
        <div className="container-fluid nav-container">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to="articles" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                Articles
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

export default UserProfile;