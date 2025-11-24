import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleService } from '../../services/api.service';
import { toast } from 'react-toastify';
import { FaCar, FaUpload, FaTimes } from 'react-icons/fa';

const AddVehicle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    type: 'scooter',
    engineCapacityCc: '',
    transmission: 'manual',
    fuelType: 'petrol',
    dailyRentInINR: '',
    hourlyRentInINR: '',
    seatingCapacity: '',
    odoReadingKm: '0',
    features: '',
    images: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imagePreview.length > 5) {
      toast.error('Maximum 5 images allowed');
      e.target.value = ''; // Reset input
      return;
    }

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
    
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    // Validate numeric fields
    if (parseFloat(formData.dailyRentInINR) <= 0) {
      toast.error('Daily rent must be greater than 0');
      return;
    }

    if (parseFloat(formData.hourlyRentInINR) <= 0) {
      toast.error('Hourly rent must be greater than 0');
      return;
    }

    if (parseInt(formData.seatingCapacity) <= 0) {
      toast.error('Seating capacity must be greater than 0');
      return;
    }

    if (parseInt(formData.engineCapacityCc) <= 0) {
      toast.error('Engine capacity must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      const vehicleData = new FormData();
      
      // Append all fields
      vehicleData.append('name', formData.name);
      vehicleData.append('brand', formData.brand);
      vehicleData.append('type', formData.type);
      vehicleData.append('engineCapacityCc', formData.engineCapacityCc);
      vehicleData.append('transmission', formData.transmission);
      vehicleData.append('fuelType', formData.fuelType);
      vehicleData.append('dailyRentInINR', formData.dailyRentInINR);
      vehicleData.append('hourlyRentInINR', formData.hourlyRentInINR || '0');
      vehicleData.append('seatingCapacity', formData.seatingCapacity);
      vehicleData.append('odoReadingKm', formData.odoReadingKm);
      
      // Convert features string to array
      if (formData.features) {
        const featuresArray = formData.features.split(',').map(f => f.trim());
        vehicleData.append('features', JSON.stringify(featuresArray));
      }
      
      // Append images
      formData.images.forEach((image) => {
        vehicleData.append('images', image);
      });

      await vehicleService.addVehicle(vehicleData);
      toast.success('Vehicle added successfully!');
      navigate('/shop/dashboard', { state: { refresh: true } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/shop/dashboard')}
            className="text-luxury-gold hover:text-luxury-gold-light mb-4 inline-flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Add New Vehicle</h1>
          <p className="text-gray-400">Fill in the details to list your vehicle for rent</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Vehicle Images */}
          <div className="card-luxury p-6">
            <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
              <FaUpload className="text-luxury-gold" />
              Vehicle Images
            </h2>
            
            <div className="space-y-4">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-luxury-charcoal rounded-lg p-8 text-center hover:border-luxury-gold transition-colors">
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  capture="environment"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="images"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <FaCar className="text-5xl text-luxury-gold" />
                  <div>
                    <p className="text-white font-semibold mb-1">Click to upload or capture images</p>
                    <p className="text-gray-400 text-sm">Upload from gallery or take photo with camera</p>
                    <p className="text-gray-500 text-xs mt-1">PNG, JPG up to 5MB (Max 5 images)</p>
                  </div>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreview.length > 0 && (
                <div className="mb-4">
                  <p className="text-gray-300 text-sm mb-3">Selected Images ({imagePreview.length}/5):</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg border-2 border-luxury-charcoal"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all shadow-lg"
                          title="Remove image"
                        >
                          <FaTimes />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          Image {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="card-luxury p-6">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Vehicle Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Activa 6G, Swift VXI"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Honda, Maruti Suzuki"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Vehicle Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full"
                >
                  <option value="scooter">Scooter</option>
                  <option value="bike">Bike</option>
                  <option value="car">Car</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Engine Capacity (CC) *
                </label>
                <input
                  type="number"
                  name="engineCapacityCc"
                  value={formData.engineCapacityCc}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 110, 1197"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Transmission *
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  required
                  className="w-full"
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                  <option value="semi-automatic">Semi-Automatic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Fuel Type *
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  required
                  className="w-full"
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="cng">CNG</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Seating Capacity *
                </label>
                <input
                  type="number"
                  name="seatingCapacity"
                  value={formData.seatingCapacity}
                  onChange={handleChange}
                  required
                  min="1"
                  max="10"
                  placeholder="e.g., 2, 5, 7"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Current Odometer (KM)
                </label>
                <input
                  type="number"
                  name="odoReadingKm"
                  value={formData.odoReadingKm}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="card-luxury p-6">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Daily Rent (₹) *
                </label>
                <input
                  type="number"
                  name="dailyRentInINR"
                  value={formData.dailyRentInINR}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g., 500"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Hourly Rent (₹) <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="number"
                  name="hourlyRentInINR"
                  value={formData.hourlyRentInINR}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 75"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="card-luxury p-6">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Features</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Vehicle Features <span className="text-gray-500">(Comma separated)</span>
              </label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                rows="4"
                placeholder="e.g., AC, Music system, Power steering, Airbags"
                className="w-full"
              />
              <p className="text-gray-500 text-sm mt-2">
                Separate each feature with a comma. Example: AC, Bluetooth, GPS, LED lights
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate('/shop/dashboard')}
              className="btn-luxury-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-luxury"
              disabled={loading}
            >
              {loading ? 'Adding Vehicle...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;
