import { validationResult } from 'express-validator';

// ERR 400 : 필수 값들이 입력되지 않은 경우
const ValidationErrorHandler = (err, req, res, next) => {
  // validationResult : express-validator 유효성 검사 실행
  const errors = validationResult(req);
  if (errors.errors.length !== 0) {
    const path = errors.array()[0].path;
    // USERS
    if (err.name === 'UsersValidError') {
      if (path === 'name') {
        return res.status(400).json({ message: '이름은 1글자 이상 입력해주세요.' });
      }
      if (path === 'login_id') {
        return res.status(400).json({ message: '아이디는 1글자 이상 입력해주세요.' });
      }
      if (path === 'email') {
        return res.status(400).json({ message: '이메일 형식에 올바르지 않습니다.' });
      }
      if (path === 'password') {
        res.status(400).json({ message: '비밀번호는 6자 이상 필요합니다.' });
      }
      if (path === 'confirmPassword') {
        res.status(400).json({ message: '동일한 비밀번호를 입력해주세요.' });
      }
    }
    // PRODUCTS
    if (err.name === 'ProductsValidError') {
      if (path === 'name') {
        return res.status(400).json({ message: '상품명을 입력해주세요.' });
      }
      if (path === 'description') {
        return res.status(400).json({ message: '상품 설명을 입력해주세요.' });
      }
      if (path === 'status') {
        return res.status(400).json({ message: '상품 상태를 입력해주세요.(FOR_SALE/SOLD_OUT)' });
      }
    }
  }
  next(err);
};

export { ValidationErrorHandler };
