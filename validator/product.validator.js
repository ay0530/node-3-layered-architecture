const { body } = require('express-validator');

const productValidate = [
  body('name').trim().isLength({ min: 1 }),
  body('description').trim().isLength({ min: 1 }),
  body('status').custom((value, { req }) => {
    if (value !== 'FOR_SALE' && value !== 'SOLD_OUT') {
      return false;
    }
  }),
];

module.exports = { productValidate };
