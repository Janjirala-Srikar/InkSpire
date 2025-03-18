import { useContext, useEffect, useState } from 'react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
// Import React Icons
import { FaBook, FaPen, FaGithub, FaInstagram, FaLinkedin, FaReact, FaNodeJs, FaSpinner } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiBootstrap, SiClerk} from 'react-icons/si';
import { MdSecurity, MdOutlineContentPaste, MdDashboard} from 'react-icons/md';
import { FaThinkPeaks} from "react-icons/fa";
import './Home.css';

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { isSignedIn, user, isLoaded } = useUser();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function onSelectRole(role) {
    setError('');
    setIsSubmitting(true);
    
    const selectedRole = role;
    const updatedUser = { ...currentUser, role: selectedRole };
    
    try {
      const endpoint = selectedRole === 'author' 
        ? 'https://inkspire-hjlx.onrender.com/author-api/author' 
        : 'https://inkspire-hjlx.onrender.com/user-api/user';
      
      const res = await axios.post(endpoint, updatedUser);
      const { message, payload } = res.data;
      
      if (message === selectedRole) {
        setCurrentUser({ ...currentUser, ...payload });
        localStorage.setItem("currentuser", JSON.stringify(payload));
      } else {
        setError(message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }
  const scrollToFooter = (e) => {
    e.preventDefault();
    document.querySelector("footer")?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };


  useEffect(() => {
    if (isSignedIn && user) {
      setCurrentUser({
        ...currentUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        profileImageUrl: user.imageUrl,
      });
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (currentUser?.role === "user" && error.length === 0) {
      navigate(`/user-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "author" && error.length === 0) {
      navigate(`/author-profile/${currentUser.email}`);
    }
  }, [currentUser]);


  if (!isSignedIn) {
    return (
      <>
        {/* Hero Banner - Enhanced design */}
        <section className="hero-section">
          <div className="animated-background"></div>
          <div className="accent-line accent-line-1"></div>
          <div className="accent-line accent-line-2"></div>
          
          <div className="container">
            <div className="row">
            <div className="col-lg-8 mx-auto text-center hero-content">
                <h1 className="hero-title">
                  <FaThinkPeaks className="logo-icon" />
                  <span className="hero-title-ink">Ink</span>
                  <span className="hero-title-spire">Spire</span>
                </h1>
                
                <div className="hero-description-container">
                  <p className="hero-description">
                    The ultimate platform where ideas flourish and connections thrive. 
                    Discover a world where knowledge meets creativity.
                  </p>
                  
                  <div className="decorative-line"></div>
                </div>
                
                <div className="hero-buttons">
                  <button className="btn btn-lg primary-btn" onClick={()=>{navigate('/signin')}}>Get Started</button>
                  <button className="btn btn-lg btn-outline-light ms-2" onClick={scrollToFooter}>Know More</button>
                </div>
                
                <div className="scroll-indicator">
                  <div className="scroll-indicator-content">
                    <span>Scroll to explore</span><br/>
                    <IoIosArrowDown className="scroll-icon" />
                  </div>
                </div>
            </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container py-5">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-3 text-white">Platform Features</h2>
              <p className="lead text-white-50 mx-auto features-subtitle">Our platform offers specialized features for readers, writers, and administrators</p>
            </div>
            
            <div className="row g-4">
              <div className="col-md-4">
                <div className="feature-card author-card">
                  <div className="card-body text-center p-4 p-lg-5">
                    <div className="feature-icon author-icon">
                      <FaPen />
                    </div>
                    <h3 className="h4 mb-3 text-white">For Authors</h3>
                    <p className="mb-0 text-white-50">Powerful writing tools with SEO optimization, analytics, and audience insights to help grow your readership.</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="feature-card reader-card">
                  <div className="card-body text-center p-4 p-lg-5">
                    <div className="feature-icon reader-icon">
                      <FaBook />
                    </div>
                    <h3 className="h4 mb-3 text-white">For Readers</h3>
                    <p className="mb-0 text-white-50">Personalized content recommendations, bookmarking features, and interactive discussions with your favorite authors.</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="feature-card admin-card">
                  <div className="card-body text-center p-4 p-lg-5">
                    <div className="feature-icon admin-icon">
                      <MdDashboard />
                    </div>
                    <h3 className="h4 mb-3 text-white">For Admins</h3>
                    <p className="mb-0 text-white-50">Comprehensive dashboard with user management, content moderation, and detailed platform analytics.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row g-4 mt-4">
              <div className="col-md-6">
                <div className="feature-card-horizontal">
                  <div className="card-body p-4 p-lg-5">
                    <div className="d-flex align-items-center mb-4">
                      <div className="me-3">
                        <MdSecurity className="feature-icon-small" />
                      </div>
                      <h3 className="h4 mb-0 text-white">Advanced Security</h3>
                    </div>
                    <p className="text-white-50">End-to-end encryption for all communications, secure authentication, and data protection measures to ensure your content stays safe.</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="feature-card-horizontal">
                  <div className="card-body p-4 p-lg-5">
                    <div className="d-flex align-items-center mb-4">
                      <div className="me-3">
                        <MdOutlineContentPaste className="feature-icon-small" />
                      </div>
                      <h3 className="h4 mb-0 text-white">Content Management</h3>
                    </div>
                    <p className="text-white-50">Powerful tools for creating, organizing, and sharing your content. Schedule posts, track engagement, and manage your digital library.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="tech-section">
          <div className="container py-5">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-3 text-white">Our Tech Stack</h2>
              <p className="lead text-white-50 mx-auto features-subtitle">Built with modern technologies for performance, scalability, and reliability</p>
            </div>
            
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="tech-icons-container">
                  <div className="text-center tech-icon-wrapper">
                    <FaReact className="tech-icon react-icon" />
                    <p className="mt-2 mb-0 text-white-50">React</p>
                  </div>
                  <div className="text-center tech-icon-wrapper">
                    <FaNodeJs className="tech-icon node-icon" />
                    <p className="mt-2 mb-0 text-white-50">Node.js</p>
                  </div>
                  <div className="text-center tech-icon-wrapper">
                    <SiExpress className="tech-icon express-icon" />
                    <p className="mt-2 mb-0 text-white-50">Express</p>
                  </div>
                  <div className="text-center tech-icon-wrapper">
                    <SiMongodb className="tech-icon mongodb-icon" />
                    <p className="mt-2 mb-0 text-white-50">MongoDB</p>
                  </div>
                  <div className="text-center tech-icon-wrapper">
                    <SiBootstrap className="tech-icon bootstrap-icon" />
                    <p className="mt-2 mb-0 text-white-50">Bootstrap</p>
                  </div>
                  <div className="text-center tech-icon-wrapper">
                    <SiClerk className="tech-icon clerk-icon" />
                    <p className="mt-2 mb-0 text-white-50">Clerk</p>
                  </div>
                  <div className="text-center tech-icon-wrapper">
                    <FaGithub className="tech-icon github-icon" />
                    <p className="mt-2 mb-0 text-white-50">GitHub</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer-section">
          <div className="container">
            <div className="row gy-4">
              <div className="col-lg-3">
                <h4 className="mb-4 text-white">InkSpire</h4>
                <p className="text-white-50">A platform for writers, readers, and knowledge seekers to connect, share, and grow together.</p>
              </div>
              <div className="col-lg-3">
                <h5 className="mb-4 text-white">Quick Links</h5>
                <ul className="list-unstyled footer-links">
                  <li className="mb-2"><a href="#" className="footer-link">Home</a></li>
                  <li className="mb-2"><a href="#" className="footer-link">Features</a></li>
                  <li className="mb-2"><a href="#" className="footer-link">About</a></li>
                  <li className="mb-2"><a href="#" className="footer-link">Contact</a></li>
                </ul>
              </div>
              <div className="col-lg-3">
                <h5 className="mb-4 text-white">Projects</h5>
                <ul className="list-unstyled footer-links">
                  <li className="mb-2"><a href="https://lumora-web.netlify.app/" className="footer-link">LUMORA</a></li>
                  <li className="mb-2"><a href="#" className="footer-link">PROJ_2</a></li>
          
                </ul>
              </div>
              <div className="col-lg-3">
                <h5 className="mb-4 text-white">Contact</h5>
                <p className="mb-2 text-white-50">Email: janjiralasrikar13@gmail.com</p>
                <div className="social-icons">
                  <a href="https://github.com/Janjirala-Srikar" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaGithub />
                  </a>
                  <a href="https://www.instagram.com/srikar_janjirala/?next=%2F&hl=en" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaInstagram />
                  </a>
                  <a href="https://www.linkedin.com/in/srikar-janjirala/" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </div>
            <hr className="footer-divider" />
            <div className="row">
              <div className="col">
                <p className="copyright-text">
                  &copy; {new Date().getFullYear()} InkSpire. All rights reserved. Designed by Srikar Janjirala
                </p>
              </div>
            </div>
          </div>
        </footer>
      </>
    );
  }

  return (
    <div className="role-selection-container">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <div className="role-selection-card">
              {user && (
                <div className="role-selection-header">
                  <div className="text-center">
                    <img 
                      src={user.imageUrl} 
                      className="user-profile-image"
                      alt={user.firstName}
                    />
                    <h2 className="user-name">{user.firstName} {user.lastName}</h2>
                    <p className="user-email">{user.emailAddresses[0].emailAddress}</p>
                  </div>
                </div>
              )}
              
              <div className="role-selection-body">
                <h3 className="role-selection-title">Select Your Role</h3>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                <div className="row g-4">
                  <div className="col-md-6">
                    <div 
                      className={`role-option author-role ${isSubmitting ? 'disabled' : ''}`}
                      onClick={() => !isSubmitting && onSelectRole('author')}
                    >
                      <div className="role-option-body">
                        <div className="role-icon author-role-icon">
                          <FaPen />
                        </div>
                        <h4 className="role-name">Author</h4>
                        <p className="role-description">Create, share, and inspire others with your expertise and creativity</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div 
                      className={`role-option reader-role ${isSubmitting ? 'disabled' : ''}`}
                      onClick={() => !isSubmitting && onSelectRole('user')}
                    >
                      <div className="role-option-body">
                        <div className="role-icon reader-role-icon">
                          <FaBook />
                        </div>
                        <h4 className="role-name">Reader</h4>
                        <p className="role-description">Explore amazing content and connect with talented authors</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {isSubmitting && (
                  <div className="spinner-container text-center mt-4">
                    <FaSpinner className="spinner-icon" />
                    <p className="spinner-text mt-2">Processing your selection...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;