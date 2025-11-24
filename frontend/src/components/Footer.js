import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaApple, FaGooglePlay
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sections = {
    explore: [
      { label: 'Browse Vehicles', link: '/vehicles' },
      { label: 'Customer Dashboard', link: '/customer/dashboard' },
      { label: 'Shop Owner Dashboard', link: '/shop/dashboard' },
    ],
    categories: [
      { label: 'Scooters', link: '/vehicles?type=scooter' },
      { label: 'Bikes Under 300cc', link: '/vehicles?type=bike&category=under_300cc' },
      { label: 'Bikes 300-450cc', link: '/vehicles?type=bike&category=300_to_450cc' },
      { label: 'Cars', link: '/vehicles?type=car' },
    ],
    forBusiness: [
      { label: 'Become a Partner', link: '/register' },
      { label: 'List Your Vehicles', link: '/register' },
    ],
  };

  const contactNumbers = [
    { label: 'Customer Support', number: '+91 98765-43210' },
    { label: 'Business Inquiries', number: '+91 98765-43211' },
  ];

  return (
    <footer className="bg-luxury-darker border-t border-luxury-charcoal/30 mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div>
            <motion.h3 
              className="text-3xl font-display font-black bg-gradient-gold bg-clip-text text-transparent mb-6"
              whileHover={{ scale: 1.05 }}
            >
              RIDEHUB
            </motion.h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              India's premier vehicle rental platform. Rent scooters, bikes, and cars with ease.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4 mb-6">
              {[
                { icon: <FaFacebook />, link: 'https://facebook.com', label: 'Facebook' },
                { icon: <FaTwitter />, link: 'https://twitter.com', label: 'Twitter' },
                { icon: <FaInstagram />, link: 'https://instagram.com', label: 'Instagram' },
                { icon: <FaLinkedin />, link: 'https://linkedin.com', label: 'LinkedIn' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-luxury-charcoal/50 flex items-center justify-center text-gray-400 hover:bg-luxury-gold hover:text-luxury-black transition-all"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-lg font-display font-bold text-luxury-gold mb-6">Explore</h4>
            <ul className="space-y-3">
              {sections.explore.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.link} 
                    className="text-gray-400 hover:text-luxury-gold transition-colors text-sm inline-flex items-center group"
                  >
                    <span className="w-0 h-px bg-luxury-gold group-hover:w-4 transition-all mr-0 group-hover:mr-2"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-display font-bold text-luxury-gold mb-6">Vehicle Types</h4>
            <ul className="space-y-3">
              {sections.categories.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.link} 
                    className="text-gray-400 hover:text-luxury-gold transition-colors text-sm inline-flex items-center group"
                  >
                    <span className="w-0 h-px bg-luxury-gold group-hover:w-4 transition-all mr-0 group-hover:mr-2"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Business & Contact */}
          <div>
            <h4 className="text-lg font-display font-bold text-luxury-gold mb-6">For Business</h4>
            <ul className="space-y-3 mb-8">
              {sections.forBusiness.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.link} 
                    className="text-gray-400 hover:text-luxury-gold transition-colors text-sm inline-flex items-center group"
                  >
                    <span className="w-0 h-px bg-luxury-gold group-hover:w-4 transition-all mr-0 group-hover:mr-2"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Numbers */}
            <h4 className="text-lg font-display font-bold text-luxury-gold mb-4">Contact Us</h4>
            <div className="space-y-3">
              {contactNumbers.map((contact, index) => (
                <div key={index}>
                  <p className="text-xs text-gray-500 mb-1">{contact.label}</p>
                  <a 
                    href={`tel:${contact.number}`}
                    className="text-white hover:text-luxury-gold transition-colors text-sm inline-flex items-center gap-2"
                  >
                    <FaPhone className="text-xs" />
                    {contact.number}
                  </a>
                </div>
              ))}
              <div className="mt-4">
                <a 
                  href="mailto:support@ridehub.com"
                  className="text-white hover:text-luxury-gold transition-colors text-sm inline-flex items-center gap-2"
                >
                  <FaEnvelope />
                  support@ridehub.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-luxury-black border-t border-luxury-charcoal/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} <span className="text-luxury-gold font-semibold">RideHub</span>. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link to="/privacy" className="hover:text-luxury-gold transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-luxury-gold transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-luxury-gold transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
