import { body } from 'express-validator';

const userSignupValidate = [
  body('login_id').trim().isLength({ min: 1 }),
  body('name').trim().isLength({ min: 1 }),
  body('email').trim().isEmail(),
  body('password').trim().isLength({ min: 6 }),
  body('confirmPassword')
    .trim()
    .isLength({ min: 6 })
    .custom((value, { req }) => {
      return value === req.body.password;
    }),
];

export { userSignupValidate };
