import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { vehicleService } from '../services/api.service';
import ImageCarousel from '../components/ImageCarousel';
import Loading from '../components/Loading';
import { FaFilter, FaMapMarkerAlt } from 'react-icons/fa';

const VehicleList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    city: searchParams.get('city') || '',
    minPrice: '',
    maxPrice: '',
    transmission: '',
    fuelType: '',
  });

  useEffect(() => {
    loadVehicles();
  }, [searchParams]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const queryFilters = {
        type: searchParams.get('type') || filters.type,
        city: searchParams.get('city') || filters.city,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        transmission: filters.transmission,
        fuelType: filters.fuelType,
        available: true,
      };
      
      const response = await vehicleService.getVehicles(queryFilters);
      setVehicles(response.data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const applyFilters = () => {
    const params = {};
    Object.keys(filters).forEach(key => {
      if (filters[key]) params[key] = filters[key];
    });
    setSearchParams(params);
    loadVehicles();
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      transmission: '',
      fuelType: '',
    });
    setSearchParams({});
    loadVehicles();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Browse Vehicles</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FaFilter className="mr-2" />
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Vehicle Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Types</option>
                    <option value="scooter">Scooters</option>
                    <option value="bike">Bikes</option>
                    <option value="car">Cars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    placeholder="Enter city"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Transmission
                  </label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Fuel Type
                  </label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>

                <button
                  onClick={applyFilters}
                  className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <Loading />
            ) : vehicles.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-2xl font-bold mb-2">No vehicles found</h3>
                <p className="text-gray-800">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Showing <span className="font-semibold">{vehicles.length}</span> vehicles
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => (
                    <Link
                      key={vehicle._id}
                      to={`/vehicles/${vehicle._id}`}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
                    >
                      <div className="h-48">
                        <ImageCarousel images={vehicle.images} />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{vehicle.name}</h3>
                          <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-semibold uppercase">
                            {vehicle.type}
                          </span>
                        </div>
                        <p className="text-gray-800 font-medium text-sm mb-3">{vehicle.brand} • {vehicle.transmission}</p>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xl font-bold text-primary-600">
                              ₹{vehicle.dailyRentInINR}
                            </span>
                            <span className="text-gray-600 text-xs">/day</span>
                            {vehicle.hourlyRentInINR && (
                              <div className="text-sm text-gray-500">
                                ₹{vehicle.hourlyRentInINR}/hr
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-600">
                            <FaMapMarkerAlt className="inline mr-1" />
                            {vehicle.shop?.city}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleList;
