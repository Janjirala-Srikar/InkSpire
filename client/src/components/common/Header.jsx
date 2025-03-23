import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaThinkPeaks, FaBars, FaTimes, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useClerk, useUser } from "@clerk/clerk-react";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext";
import { GoSignOut } from "react-icons/go";
import "./Header.css";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileCanvasOpen, setProfileCanvasOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isRoleLoaded, setIsRoleLoaded] = useState(false);
  const { signOut } = useClerk();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const profileCanvasRef = useRef(null);

  // Get user info and role on component mount
  useEffect(() => {
    if (isSignedIn) {
      fetchUserRole();
    }
  }, [isSignedIn]);

  // Function to fetch user role from localStorage or API
  const fetchUserRole = async () => {
    try {
      // First check localStorage
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        const parsedInfo = JSON.parse(storedUserInfo);
        if (parsedInfo.role) {
          setUserRole(parsedInfo.role);
          setIsRoleLoaded(true);
          return;
        }
      }
      
      // If role is not in localStorage, you could fetch it from your API
      // Example (replace with your actual API endpoint):
      // const response = await fetch('your-api-endpoint/get-user-role', {
      //   headers: { Authorization: `Bearer ${await getToken()}` }
      // });
      // const data = await response.json();
      // setUserRole(data.role);
      
      // For now, if not found, don't set a default
      setIsRoleLoaded(true);
    } catch (error) {
      console.error("Error fetching user role:", error);
      setIsRoleLoaded(true); // Mark as loaded even if there was an error
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      localStorage.clear();
      setUserRole(null);
      setIsRoleLoaded(false);
      navigate("/");
      setProfileCanvasOpen(false);
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
    if (!isSignedIn) {
      setMobileMenuOpen((prev) => !prev);
      if (profileCanvasOpen) setProfileCanvasOpen(false);
    }
  };

  const toggleProfileCanvas = () => {
    setProfileCanvasOpen((prev) => !prev);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  // Close profile canvas when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileCanvasRef.current && !profileCanvasRef.current.contains(event.target) && 
          !event.target.closest(".user-avatar-container")) {
        setProfileCanvasOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileCanvasRef]);

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
                  {/* <a href="#footer" onClick={scrollToFooter} className="nav-button about">About Us</a> */}
                </>
              ) : (
                <div className="user-info">
                  <div className="user-avatar-wrapper" onClick={toggleProfileCanvas}>
                    <div className="user-avatar-container">
                      <img src={user.imageUrl} alt="Profile" className="user-avatar" />
                      {isRoleLoaded && userRole && (
                        <span className="user-role">{userRole}</span>
                      )}
                    </div>
                  </div>
                  <button onClick={handleSignOut} className="nav-button signout">Sign Out</button>
                </div>
              )}
            </nav>
           
            {/* Modified mobile header controls */}
            {!isSignedIn ? (
              <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                <FaBars />
              </button>
            ) : (
              <div className="mobile-user-controls">
                <div className="mobile-user-icon" onClick={toggleProfileCanvas}>
                  <FaUser />
                </div>
                <div className="mobile-signout-icon" onClick={handleSignOut}>
                  <GoSignOut />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu - only for non-signed in users */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <div className="container">
          <nav className="mobile-nav">
            <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
              Sign In
            </Link>
            <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
              Sign Up
            </Link>
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
              Admin
            </Link>
          </nav>
        </div>
      </div>

      {/* Updated Profile Canvas */}
      <div className={`profile-canvas ${profileCanvasOpen ? "open" : ""}`} ref={profileCanvasRef}>
        <div className="profile-header">
          <h2>Profile Details</h2>
          <button className="close-profile" onClick={() => setProfileCanvasOpen(false)}>
            <FaTimes />
          </button>
        </div>
        
        <div className="profile-content">
          <div className="profile-avatar-section">
            <img src={user?.imageUrl} alt="Profile" className="profile-large-avatar" />
            <div className="profile-name-role">
              <h3>{user?.firstName} {user?.lastName}</h3>
              {isRoleLoaded && userRole && (
                <div className="profile-role">
                  <span>{userRole}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="profile-details">
            <div className="profile-detail-item">
              <div className="detail-content">
                <span className="detail-label">Name</span>
                <span className="detail-value">{user?.firstName} {user?.lastName}</span>
              </div>
            </div>
            
            <div className="profile-detail-item">
              <div className="detail-content">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user?.emailAddresses[0]?.emailAddress || "Not available"}</span>
              </div>
            </div>
            
            {isRoleLoaded && userRole && (
              <div className="profile-detail-item">
                <div className="detail-content">
                  <span className="detail-label">Role</span>
                  <span className="detail-value">{userRole}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="profile-actions">
            <button className="profile-action-button signout" onClick={handleSignOut}>
              <FaSignOutAlt className="action-icon" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;