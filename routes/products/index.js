const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('/products 호출!');
});

module.exports = router;