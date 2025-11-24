import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vehicleService } from '../../services/api.service';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import { FaCar, FaUpload, FaTimes } from 'react-icons/fa';

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  
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
    newImages: [],
    available: true
  });

  useEffect(() => {
    loadVehicle();
  }, [id]);

  const loadVehicle = async () => {
    try {
      const response = await vehicleService.getVehicle(id);
      const vehicle = response.data;
      
      setFormData({
        name: vehicle.name,
        brand: vehicle.brand,
        type: vehicle.type,
        engineCapacityCc: vehicle.engineCapacityCc,
        transmission: vehicle.transmission,
        fuelType: vehicle.fuelType,
        dailyRentInINR: vehicle.dailyRentInINR,
        hourlyRentInINR: vehicle.hourlyRentInINR || '',
        seatingCapacity: vehicle.seatingCapacity,
        odoReadingKm: vehicle.odoReadingKm,
        features: vehicle.features ? vehicle.features.join(', ') : '',
        newImages: [],
        available: vehicle.available
      });
      
      setExistingImages(vehicle.images || []);
    } catch (error) {
      toast.error('Failed to load vehicle details');
      navigate('/shop/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + imagePreview.length + files.length;
    
    if (totalImages > 5) {
      toast.error(`Maximum 5 images allowed. You can add ${5 - existingImages.length - imagePreview.length} more.`);
      e.target.value = '';
      return;
    }

    // Create previews using FileReader
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
    
    setFormData(prev => ({
      ...prev,
      newImages: [...prev.newImages, ...files]
    }));
    
    // Reset input
    e.target.value = '';
  };

  const removeNewImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index)
    }));
  };

  const removeExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    console.log('Removing existing image:', imageToRemove);
    setExistingImages(prev => prev.filter((_, i) => i !== index));
    toast.info('Image will be removed when you save changes');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (existingImages.length === 0 && formData.newImages.length === 0) {
      toast.error('Please keep at least one image');
      return;
    }

    setSubmitting(true);

    try {
      const vehicleData = new FormData();
      
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
      vehicleData.append('available', formData.available);
      
      if (formData.features) {
        const featuresArray = formData.features.split(',').map(f => f.trim());
        vehicleData.append('features', JSON.stringify(featuresArray));
      }
      
      vehicleData.append('existingImages', JSON.stringify(existingImages));
      
      formData.newImages.forEach((image) => {
        vehicleData.append('images', image);
      });

      await vehicleService.updateVehicle(id, vehicleData);
      toast.success('Vehicle updated successfully!');
      navigate('/shop/dashboard', { state: { refresh: true } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-luxury-black py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <button
            onClick={() => navigate('/shop/dashboard')}
            className="text-luxury-gold hover:text-luxury-gold-light mb-4 inline-flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Edit Vehicle</h1>
          <p className="text-gray-400">Update vehicle details and pricing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Vehicle Images */}
          <div className="card-luxury p-6">
            <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
              <FaUpload className="text-luxury-gold" />
              Vehicle Images
            </h2>
            
            <div className="space-y-6">
              {/* Total Images Counter */}
              <div className="bg-luxury-darker p-4 rounded-lg">
                <p className="text-luxury-gold font-semibold">
                  Total Images: {existingImages.length + imagePreview.length} / 5
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {existingImages.length > 0 && `${existingImages.length} existing, `}
                  {imagePreview.length > 0 && `${imagePreview.length} new`}
                </p>
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <p className="text-gray-300 font-semibold mb-3 flex items-center gap-2">
                    📷 Current Images ({existingImages.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <img
                          src={image}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg border-2 border-green-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all shadow-lg"
                          title="Remove this image"
                        >
                          <FaTimes />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          Existing
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Image Previews */}
              {imagePreview.length > 0 && (
                <div>
                  <p className="text-gray-300 font-semibold mb-3 flex items-center gap-2">
                    ✨ New Images ({imagePreview.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreview.map((preview, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <img
                          src={preview}
                          alt={`New ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg border-2 border-blue-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all shadow-lg"
                          title="Remove this image"
                        >
                          <FaTimes />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          New
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Images Button */}
              {(existingImages.length + imagePreview.length) < 5 && (
                <div className="border-2 border-dashed border-luxury-charcoal rounded-lg p-8 text-center hover:border-luxury-gold transition-colors">
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="images" className="cursor-pointer flex flex-col items-center gap-3">
                    <FaCar className="text-5xl text-luxury-gold" />
                    <div>
                      <p className="text-white font-semibold mb-1">Click to add more images</p>
                      <p className="text-gray-400 text-sm">
                        You can add {5 - existingImages.length - imagePreview.length} more image(s)
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Warning if at max capacity */}
              {(existingImages.length + imagePreview.length) >= 5 && (
                <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
                  <p className="text-yellow-500 font-semibold">
                    ⚠️ Maximum 5 images reached. Delete an image to add more.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="card-luxury p-6">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Vehicle Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Brand *</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="w-full" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Vehicle Type *</label>
                <select name="type" value={formData.type} onChange={handleChange} required className="w-full">
                  <option value="scooter">Scooter</option>
                  <option value="bike">Bike</option>
                  <option value="car">Car</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Engine Capacity (CC) *</label>
                <input type="number" name="engineCapacityCc" value={formData.engineCapacityCc} onChange={handleChange} required className="w-full" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Transmission *</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange} required className="w-full">
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                  <option value="semi-automatic">Semi-Automatic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Fuel Type *</label>
                <select name="fuelType" value={formData.fuelType} onChange={handleChange} required className="w-full">
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="cng">CNG</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Seating Capacity *</label>
                <input type="number" name="seatingCapacity" value={formData.seatingCapacity} onChange={handleChange} required min="1" max="10" className="w-full" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Current Odometer (KM)</label>
                <input type="number" name="odoReadingKm" value={formData.odoReadingKm} onChange={handleChange} className="w-full" />
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="mt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-luxury-charcoal bg-luxury-dark text-luxury-gold focus:ring-luxury-gold focus:ring-offset-luxury-black"
                />
                <span className="text-white font-semibold">Vehicle is available for rent</span>
              </label>
            </div>
          </div>

          {/* Pricing */}
          <div className="card-luxury p-6">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Daily Rent (₹) *</label>
                <input type="number" name="dailyRentInINR" value={formData.dailyRentInINR} onChange={handleChange} required min="0" className="w-full" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Hourly Rent (₹) <span className="text-gray-500">(Optional)</span></label>
                <input type="number" name="hourlyRentInINR" value={formData.hourlyRentInINR} onChange={handleChange} min="0" className="w-full" />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="card-luxury p-6">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Features</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Vehicle Features <span className="text-gray-500">(Comma separated)</span></label>
              <textarea name="features" value={formData.features} onChange={handleChange} rows="4" className="w-full" />
              <p className="text-gray-500 text-sm mt-2">Separate each feature with a comma</p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <button type="button" onClick={() => navigate('/shop/dashboard')} className="btn-luxury-outline" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-luxury" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicle;
