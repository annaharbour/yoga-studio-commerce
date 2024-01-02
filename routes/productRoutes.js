const { Router } = require('express');
const {} = require('../controllers/productController');
const router = Router();

router.get('/items', getProducts);
router.post('/items', addProduct);
router.put('/items/:id', updateProduct);
router.delete('/items/:id', deleteProduct);

module.exports = router;