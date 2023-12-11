import { body } from 'express-validator';

const userLoginIdValidate = [
  body('login_id').trim().isLength({ min: 1 }),
  body('password').trim().isLength({ min: 6 }),
];

export { userLoginIdValidate };
