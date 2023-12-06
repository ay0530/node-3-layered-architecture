const express = require('express');
const router = express.Router();

const membersRouter = require('./members');
const productsRouter = require('./products');

router.use("/members", membersRouter);
router.use("/products", productsRouter);

module.exports = router;