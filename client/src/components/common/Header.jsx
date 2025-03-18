import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaThinkPeaks, FaBars, FaTimes } from "react-icons/fa";
import { useClerk, useUser } from "@clerk/clerk-react";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext";
import "./Header.css";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut } = useClerk();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();

  const handleSignOut = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const scrollToFooter = (e) => {
    e.preventDefault();
    document.querySelector("footer")?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <header className="site-header">
        <div className="container">
          <div className="header-inner">
            <div className="logo-container">
              <Link to="/" className="logo-link">
                <FaThinkPeaks className="logo-icon" />
                <span className="logo-text">
                  Ink<span className="highlight">Spire</span>
                </span>
              </Link>
            </div>
            
            <nav className="desktop-nav">
              {!isSignedIn ? (
                <>
                  <Link to="/signin" className="nav-button signin">Sign In</Link>
                  <Link to="/signup" className="nav-button signup">Sign Up</Link>
                  <a href="#footer" onClick={scrollToFooter} className="nav-button about">About Us</a>
                </>
              ) : (
                <div className="user-info">
                  <div className="user-avatar-container">
                    <img src={user.imageUrl} alt="Profile" className="user-avatar" />
                    <span className="username">{user.firstName}</span>
                  </div>
                  <button onClick={handleSignOut} className="nav-button signout">Sign Out</button>
                </div>
              )}
            </nav>
            
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <div className="container">
          <nav className="mobile-nav">
            {!isSignedIn ? (
              <>
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                  Admin
                </Link>
              </>
            ) : (
              <div className="user-info-mobile">
                <div className="user-avatar-container">
                  <img src={user.imageUrl} alt="Profile" className="user-avatar" />
                  <span className="username">{user.firstName}</span>
                </div>
                <button onClick={handleSignOut} className="nav-button signout">Sign Out</button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}

export default Header;