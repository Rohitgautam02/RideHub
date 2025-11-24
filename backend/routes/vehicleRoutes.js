const express = require('express');
const {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getMyShopVehicles,
  checkAvailability
} = require('../controllers/vehicleController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router
  .route('/')
  .get(getVehicles)
  .post(
    protect,
    authorize('shop_owner', 'admin'),
    upload.array('images', 5),
    createVehicle
  );

router
  .route('/shop/myvehicles')
  .get(protect, authorize('shop_owner'), getMyShopVehicles);

router
  .route('/:id')
  .get(getVehicle)
  .put(
    protect,
    authorize('shop_owner', 'admin'),
    upload.array('images', 5),
    updateVehicle
  )
  .delete(protect, authorize('shop_owner', 'admin'), deleteVehicle);

router
  .route('/:id/check-availability')
  .post(checkAvailability);

module.exports = router;
