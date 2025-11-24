import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { vehicleService } from '../services/api.service';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import { FaSearch, FaFilter, FaStar } from 'react-icons/fa';

const SearchVehicles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    brand: searchParams.get('brand') || '',
    transmission: searchParams.get('transmission') || '',
    fuelType: searchParams.get('fuelType') || '',
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, vehicles]);

  const loadVehicles = async () => {
    try {
      const response = await vehicleService.getVehicles();
      setVehicles(response.data);
    } catch (error) {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(v =>
        v.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        v.brand.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(v => v.type === filters.type);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(v =>
        v.shop?.city?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(v => v.dailyRentInINR >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(v => v.dailyRentInINR <= parseInt(filters.maxPrice));
    }

    // Brand filter
    if (filters.brand) {
      filtered = filtered.filter(v => v.brand === filters.brand);
    }

    // Transmission filter
    if (filters.transmission) {
      filtered = filtered.filter(v => v.transmission === filters.transmission);
    }

    // Fuel type filter
    if (filters.fuelType) {
      filtered = filtered.filter(v => v.fuelType === filters.fuelType);
    }

    setFilteredVehicles(filtered);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      transmission: '',
      fuelType: '',
    });
    setSearchParams(new URLSearchParams());
  };

  const uniqueBrands = [...new Set(vehicles.map(v => v.brand))];
  const uniqueLocations = [...new Set(vehicles.map(v => v.shop?.location?.city).filter(Boolean))];

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-luxury-black py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Search Vehicles
          </h1>
          <p className="text-gray-400">
            Found {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-luxury-dark rounded-2xl p-6 border border-luxury-charcoal/30 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FaFilter className="mr-2" /> Filters
                </h2>
                {Object.values(filters).some(v => v) && (
                  <button
                    onClick={clearFilters}
                    className="text-luxury-gold text-sm hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Search */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Search</label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Vehicle name or brand..."
                      className="w-full bg-luxury-black border border-luxury-charcoal/30 rounded-lg pl-10 pr-4 py-2 text-white"
                    />
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full bg-luxury-black border border-luxury-charcoal/30 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">All Types</option>
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="scooter">Scooter</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Location</label>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full bg-luxury-black border border-luxury-charcoal/30 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Price Range (₹/day)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder="Min"
                      className="w-1/2 bg-luxury-black border border-luxury-charcoal/30 rounded-lg px-3 py-2 text-white"
                    />
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="Max"
                      className="w-1/2 bg-luxury-black border border-luxury-charcoal/30 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full bg-luxury-black border border-luxury-charcoal/30 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">All Brands</option>
                    {uniqueBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Transmission</label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                    className="w-full bg-luxury-black border border-luxury-charcoal/30 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">All</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                    <option value="cvt">CVT</option>
                  </select>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Fuel Type</label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                    className="w-full bg-luxury-black border border-luxury-charcoal/30 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">All</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="lg:col-span-3">
            {filteredVehicles.length === 0 ? (
              <div className="bg-luxury-dark rounded-2xl p-12 text-center border border-luxury-charcoal/30">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No vehicles found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters</p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-gold text-luxury-black px-6 py-3 rounded-full font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <Link
                    key={vehicle._id}
                    to={`/vehicles/${vehicle._id}`}
                    className="bg-luxury-dark rounded-2xl overflow-hidden border border-luxury-charcoal/30 hover:border-luxury-gold/50 transition group"
                  >
                    <div className="relative h-48">
                      <img
                        src={getImageUrl(vehicle.images?.[0])}
                        alt={vehicle.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        onError={handleImageError}
                      />
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-luxury-gold text-sm font-bold flex items-center">
                          <FaStar className="mr-1" />
                          5.0
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-1">{vehicle.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{vehicle.brand}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-luxury-gold font-bold text-xl">
                            ₹{vehicle.dailyRentInINR}
                          </span>
                          <span className="text-gray-500 text-sm">/day</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          vehicle.available
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {vehicle.available ? 'Available' : 'Booked'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchVehicles;
