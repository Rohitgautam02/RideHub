import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { vehicleService, shopService } from '../services/api.service';
import ImageCarousel from '../components/ImageCarousel';
import Loading from '../components/Loading';
import { 
  FaMotorcycle, FaCar, FaSearch, FaMapMarkerAlt, FaShieldAlt, 
  FaClock, FaUsers, FaStar, FaArrowRight, FaPhone 
} from 'react-icons/fa';
import { GiScooter } from 'react-icons/gi';

const Home = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState({
    city: '',
    type: '',
  });

  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [featuredRef, featuredInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    loadFeaturedVehicles();
    loadShops();
  }, []);

  const loadFeaturedVehicles = async () => {
    try {
      const response = await vehicleService.getVehicles({ available: true });
      setFeaturedVehicles(response.data.slice(0, 6));
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadShops = async () => {
    try {
      const response = await shopService.getShops();
      setShops(response.data.slice(0, 3)); // Show only first 3 shops
    } catch (error) {
      console.error('Error loading shops:', error);
    }
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchData.city) queryParams.append('city', searchData.city);
    if (searchData.type) queryParams.append('type', searchData.type);
    window.location.href = `/vehicles?${queryParams.toString()}`;
  };

  const stats = [
    { label: 'Registered Users', value: 100, suffix: '+' },
    { label: 'Available Vehicles', value: 50, suffix: '+' },
    { label: 'Cities Served', value: 10, suffix: '+' },
    { label: 'Partner Shops', value: 20, suffix: '+' },
  ];

  const categories = [
    {
      icon: <GiScooter className="text-6xl" />,
      title: 'Scooters',
      description: 'Perfect for city commutes',
      link: '/vehicles?type=scooter',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: <FaMotorcycle className="text-6xl" />,
      title: 'Bikes',
      description: 'Thrill of the open road',
      link: '/vehicles?type=bike',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: <FaCar className="text-6xl" />,
      title: 'Cars',
      description: 'Comfort for family trips',
      link: '/vehicles?type=car',
      color: 'from-green-500 to-teal-600'
    },
  ];

  const whyChooseUs = [
    {
      icon: <FaShieldAlt className="text-4xl text-luxury-gold" />,
      title: 'Verified Vehicles',
      description: 'All vehicles verified and well-maintained'
    },
    {
      icon: <FaClock className="text-4xl text-luxury-gold" />,
      title: 'Flexible Booking',
      description: 'Hourly and daily rental options available'
    },
    {
      icon: <FaUsers className="text-4xl text-luxury-gold" />,
      title: 'Easy Process',
      description: 'Simple booking and payment process'
    },
    {
      icon: <FaStar className="text-4xl text-luxury-gold" />,
      title: 'Best Prices',
      description: 'Competitive rates with transparent pricing'
    },
  ];

  const [shops, setShops] = useState([]);

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Hero Section with Luxury Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-luxury">
          <div className="absolute inset-0 opacity-20" 
               style={{
                 backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.2) 0%, transparent 50%)',
               }}
          />
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-luxury-gold rounded-full opacity-30"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-6xl md:text-7xl lg:text-8xl font-display font-black mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="text-white">Let Your Mood</span>
              <br />
              <span className="bg-gradient-gold bg-clip-text text-transparent">
                Decide your wheels
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-12 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Premium Vehicle Rentals Across India
            </motion.p>

            {/* Premium Search Box */}
            <motion.div 
              className="glass-morphism rounded-3xl p-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5 relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-luxury-gold" />
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={searchData.city}
                    onChange={(e) => setSearchData({ ...searchData, city: e.target.value })}
                    className="w-full pl-14 pr-4 py-4 bg-luxury-dark border border-luxury-charcoal/50 rounded-2xl focus:ring-2 focus:ring-luxury-gold focus:border-transparent text-white placeholder-gray-500 transition-all"
                  />
                </div>

                <div className="md:col-span-4">
                  <select
                    value={searchData.type}
                    onChange={(e) => setSearchData({ ...searchData, type: e.target.value })}
                    className="w-full px-4 py-4 bg-luxury-dark border border-luxury-charcoal/50 rounded-2xl focus:ring-2 focus:ring-luxury-gold focus:border-transparent text-white appearance-none cursor-pointer transition-all"
                  >
                    <option value="">All Vehicle Types</option>
                    <option value="scooter">Scooters</option>
                    <option value="bike">Bikes</option>
                    <option value="car">Cars</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <button
                    onClick={handleSearch}
                    className="btn-luxury w-full justify-center py-4 text-lg font-bold"
                  >
                    <FaSearch className="mr-2" />
                    Search
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-luxury-gold rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-luxury-gold rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Vehicle Categories */}
      <section className="py-24 bg-luxury-darker">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-heading">Explore by Category</h2>
            <p className="section-subheading">Choose your perfect ride</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Link
                  to={category.link}
                  className="block group relative overflow-hidden rounded-3xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                  
                  <div className="relative p-12 text-center text-white">
                    <motion.div
                      className="mb-6"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {category.icon}
                    </motion.div>
                    <h3 className="text-3xl font-display font-bold mb-3">{category.title}</h3>
                    <p className="text-lg opacity-90 mb-6">{category.description}</p>
                    <div className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all">
                      Explore Now
                      <FaArrowRight />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Parked - Featured Vehicles */}
      <section className="py-24 bg-luxury-black" ref={featuredRef}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-heading">Recently Parked</h2>
            <p className="section-subheading">Our latest premium vehicles</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loading size="large" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={featuredInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Link to={`/vehicles/${vehicle._id}`}>
                    <div className="card-luxury group cursor-pointer h-full">
                      {/* Vehicle Image */}
                      <div className="relative overflow-hidden h-64">
                        {vehicle.images && vehicle.images.length > 0 ? (
                          <ImageCarousel images={vehicle.images} />
                        ) : (
                          <div className="w-full h-full bg-luxury-charcoal flex items-center justify-center">
                            <FaCar className="text-6xl text-gray-600" />
                          </div>
                        )}
                        
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Registration Year Badge */}
                        <div className="absolute top-4 right-4 bg-luxury-black/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-luxury-gold border border-luxury-gold/30">
                          Reg.Year: {new Date().getFullYear() - Math.floor(Math.random() * 3)}
                        </div>
                      </div>

                      {/* Vehicle Info */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-display font-bold text-white mb-1 group-hover:text-luxury-gold transition-colors">
                              {vehicle.brand} {vehicle.name}
                            </h3>
                            <p className="text-gray-400 text-sm">{vehicle.shop?.city || 'India'}</p>
                          </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                          <div className="flex flex-col items-center p-2 bg-luxury-black rounded-lg">
                            <span className="text-gray-500 text-xs mb-1">Kilometers</span>
                            <span className="text-white font-semibold">{vehicle.odoReadingKm || 0} km</span>
                          </div>
                          <div className="flex flex-col items-center p-2 bg-luxury-black rounded-lg">
                            <span className="text-gray-500 text-xs mb-1">Fuel</span>
                            <span className="text-white font-semibold capitalize">{vehicle.fuelType}</span>
                          </div>
                          <div className="flex flex-col items-center p-2 bg-luxury-black rounded-lg">
                            <span className="text-gray-500 text-xs mb-1">Type</span>
                            <span className="text-white font-semibold capitalize">{vehicle.transmission}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between pt-4 border-t border-luxury-charcoal/50">
                          <div>
                            <div className="text-3xl font-bold text-luxury-gold">
                              ₹{vehicle.dailyRentInINR.toLocaleString('en-IN')}
                            </div>
                            <div className="text-xs text-gray-500">per day</div>
                          </div>
                          <button className="btn-luxury-outline text-sm px-6 py-2">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/vehicles" className="btn-luxury text-lg">
              Explore All Vehicles
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-luxury-darker" ref={statsRef}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-heading">Why Choose RideHub</h2>
            <p className="section-subheading">The best when it comes to vehicle rentals</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                className="text-center p-8 rounded-2xl bg-luxury-black/50 border border-luxury-charcoal/30 hover:border-luxury-gold/50 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <motion.div
                  className="mb-4 inline-block"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-luxury-gold transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Partner Shops */}
      {shops.length > 0 && (
        <section className="py-24 bg-luxury-black">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-heading">Our Partner Shops</h2>
              <p className="section-subheading">Trusted rental shops across India</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {shops.map((shop, index) => (
                <motion.div
                  key={shop._id}
                  className="glass-morphism p-8 rounded-3xl text-center group hover:border-luxury-gold/50 transition-all"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="text-5xl font-bold text-luxury-gold mb-4 font-display">
                    {shop.city.substring(0, 3).toUpperCase()}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{shop.name}</h3>
                  <p className="text-gray-400 text-sm mb-1">{shop.city}</p>
                  <p className="text-gray-500 text-xs mb-4">{shop.address}</p>
                  <a 
                    href={`tel:${shop.phone}`}
                    className="inline-flex items-center gap-2 text-luxury-gold hover:text-luxury-gold-light transition-colors text-sm mb-6"
                  >
                    <FaPhone />
                    {shop.phone}
                  </a>
                  <div className="mt-6">
                    <Link 
                      to={`/vehicles?city=${shop.city}`}
                      className="btn-luxury-outline text-sm w-full"
                    >
                      View Vehicles
                      <FaArrowRight />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-luxury relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/10 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Own a Shop? Partner with Us
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join India's fastest-growing vehicle rental platform and expand your business
            </p>
            <Link to="/register" className="btn-luxury text-lg">
              Become a Partner
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
