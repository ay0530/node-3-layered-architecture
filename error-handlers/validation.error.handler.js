const { validationResult } = require('express-validator');

const ValidationErrorHandler = (err, req, res, next) => {
  const errors = validationResult(req);
  const path = errors.array()[0].path;
  console.log("거치니..?");
  if (err.name === 'UserValidError') {
    if (path === 'name') {
      return res
        .status(404)
        .json({ message: '이름은 1글자 이상 입력해주세요.' });
    }
    if (path === 'login_id') {
      return res
        .status(404)
        .json({ message: '아이디는 1글자 이상 입력해주세요.' });
    }
    if (path === 'email') {
      return res
        .status(404)
        .json({ message: '이메일 형식에 올바르지 않습니다.' });
    }
    if (path === 'password') {
      return res
        .status(404)
        .json({ message: '비밀번호는 6자 이상 필요합니다.' });
    }
    if (path === 'confirmPassword') {
      return res
        .status(404)
        .json({ message: '동일한 비밀번호를 입력해주세요.' });
    }
    if (path === 'title') {
      return res.status(404).json({ message: '제목을 입력해주세요.' });
    }
    if (path === 'content') {
      return res.status(404).json({ message: '내용을 입력해주세요.' });
    }
  }
  if (err.name === 'ProductValidError') {
    if (path === 'name') {
      return res.status(404).json({ message: '상품명을 입력해주세요.' });
    }
    if (path === 'description') {
      return res.status(404).json({ message: '상품 설명을 입력해주세요.' });
    }
  }
};

module.exports = { ValidationErrorHandler };
