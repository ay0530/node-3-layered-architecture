import { body } from 'express-validator';

const productValidate = [
  body('name').trim().isLength({ min: 1 }),
  body('description').trim().isLength({ min: 1 }),
];

const productUpdateValidate = [
  body('status').custom((value, { req }) => {
    if (value !== 'FOR_SALE' && value !== 'SOLD_OUT') {
      throw new Error('Invalid status value');
    }
    return true; // 유효성 검사 통과
  }),
];

export { productValidate, productUpdateValidate };
