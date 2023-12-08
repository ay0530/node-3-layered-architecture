import { validationResult } from 'express-validator';

const ValidationErrorHandler = (err, req, res, next) => {
  const errors = validationResult(req);
  const path = errors.array()[0].path;
  if (err.name === 'UsersValidError') {
    if (path === 'name') {
      res
        .status(404)
        .json({ message: '이름은 1글자 이상 입력해주세요.' });
    }
    if (path === 'login_id') {
      res
        .status(404)
        .json({ message: '아이디는 1글자 이상 입력해주세요.' });
    }
    if (path === 'email') {
      res
        .status(404)
        .json({ message: '이메일 형식에 올바르지 않습니다.' });
    }
    if (path === 'password') {
      res
        .status(404)
        .json({ message: '비밀번호는 6자 이상 필요합니다.' });
    }
    if (path === 'confirmPassword') {
      res
        .status(404)
        .json({ message: '동일한 비밀번호를 입력해주세요.' });
    }
  }
  if (err.name === 'ProductsValidError') {
    if (path === 'name') {
      res.status(404).json({ message: '상품명을 입력해주세요.' });
    }
    if (path === 'description') {
      res.status(404).json({ message: '상품 설명을 입력해주세요.' });
    }
    if (path === 'status') {
      res.status(404).json({ message: '상품 상태를 입력해주세요.(FOR_SALE/SOLD_OUT)' });
    }
  }
  next(err);
};

export { ValidationErrorHandler };
