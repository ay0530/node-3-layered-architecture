const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('/members 호출!');
});

module.exports = router;