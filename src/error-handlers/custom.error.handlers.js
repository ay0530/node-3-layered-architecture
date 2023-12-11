
const CustomErrorHandler = async (err, req, res, next) => {
  // custom.errors.js 에서 설정해준 err.name, err.type을 기준으로 실행
  if (err.name === 'CustomError') {
    // // USERS
    // SIGNUP
    if (err.type === 'UserLoginIdExistError') {
      return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
    }
    if (err.type === 'UserEmailExistError') {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    // LOGIN
    if (err.type === 'UserloginIdNotExistError') {
      return res.status(404).json({ message: '해당 아이디가 존재하지 않습니다.' });
    }
    if (err.type === 'UserPasswordMismatchError') {
      return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // AUTH
    if (err.type === 'LoginRequiredError') {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    if (err.type === 'TokenTypeMismatchError') {
      return res.status(401).json({ message: '토큰 타입이 일치하지 않습니다.' });
    }
    if (err.type === 'TokenUserDoesNotExistError') {
      return res.status(401).json({ message: '권한이 없습니다.' });
    }

    // // PRODUCTS
    if (err.type === 'ProductDoesNotExistError') {
      return res.status(404).json({ message: '상품이 존재하지 않습니다.' });
    }
  }
  next(err);
};

export { CustomErrorHandler };
