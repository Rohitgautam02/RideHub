const express = require('express');
const {
  getShops,
  getShop,
  createShop,
  updateShop,
  deleteShop,
  getMyShop
} = require('../controllers/shopController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getShops)
  .post(protect, authorize('shop_owner', 'admin'), createShop);

router
  .route('/me/myshop')
  .get(protect, authorize('shop_owner'), getMyShop);

router
  .route('/:id')
  .get(getShop)
  .put(protect, authorize('shop_owner', 'admin'), updateShop)
  .delete(protect, authorize('shop_owner', 'admin'), deleteShop);

module.exports = router;
