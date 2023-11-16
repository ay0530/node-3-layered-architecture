const express = require('express');
const router = express.Router();
const sequelize = require('../models').sequelize;
const authMiddleware = require('../middlewares/auth-middleware');

// db연결
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

const membersRouter = require('./members');
const productsRouter = require('./products');

router.use("/products", authMiddleware);
router.use("/members", membersRouter);

router.use("/products", productsRouter);

module.exports = router;