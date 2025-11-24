import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaHome, FaCar, FaStore, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated, isCustomer, isShopOwner } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isHomePage = location.pathname === '/';

  return (
    <>
      <motion.nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled || !isHomePage
            ? 'bg-luxury-dark/95 backdrop-blur-lg shadow-2xl border-b border-luxury-charcoal/50' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <motion.div 
                className="text-3xl font-display font-black bg-gradient-gold bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                RIDEHUB
              </motion.div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-white hover:text-luxury-gold transition-colors font-medium relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-luxury-gold group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                to="/vehicles" 
                className="text-white hover:text-luxury-gold transition-colors font-medium relative group"
              >
                Browse Vehicles
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-luxury-gold group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                to="/search" 
                className="text-white hover:text-luxury-gold transition-colors font-medium relative group"
              >
                Search
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-luxury-gold group-hover:w-full transition-all duration-300"></span>
              </Link>
              
              {isShopOwner && (
                <Link 
                  to="/shop/dashboard" 
                  className="text-white hover:text-luxury-gold transition-colors font-medium relative group"
                >
                  My Shop
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-luxury-gold group-hover:w-full transition-all duration-300"></span>
                </Link>
              )}
            </div>

            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-300">
                    Welcome, <span className="font-semibold text-luxury-gold">{user?.name}</span>
                  </span>
                  <Link
                    to={
                      user?.role === 'admin' ? '/admin/dashboard' :
                      user?.role === 'shop_owner' ? '/shop/dashboard' :
                      '/customer/dashboard'
                    }
                    className="glass-morphism px-5 py-2.5 rounded-full hover:border-luxury-gold/50 transition-all inline-flex items-center gap-2 text-white font-medium"
                  >
                    <FaUser />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600/80 backdrop-blur-sm px-5 py-2.5 rounded-full hover:bg-red-600 transition-all inline-flex items-center gap-2 text-white font-medium"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white hover:text-luxury-gold transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-luxury"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2 hover:text-luxury-gold transition-colors"
            >
              {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-luxury-black/95 backdrop-blur-xl"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <motion.div
              className="relative h-full flex flex-col items-center justify-center space-y-8 pt-20"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-display font-bold text-white hover:text-luxury-gold transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/vehicles" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-display font-bold text-white hover:text-luxury-gold transition-colors"
              >
                Browse Vehicles
              </Link>
              
              {isShopOwner && (
                <Link 
                  to="/shop/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-3xl font-display font-bold text-white hover:text-luxury-gold transition-colors"
                >
                  My Shop
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <Link
                    to={isShopOwner ? '/shop/dashboard' : '/customer/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-luxury text-lg"
                  >
                    <FaUser />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 px-8 py-4 rounded-full text-white font-semibold text-lg inline-flex items-center gap-2 hover:bg-red-700 transition-all"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-luxury-outline text-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-luxury text-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
