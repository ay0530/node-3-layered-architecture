const ErrorTypes = {
  // // // USER
  // // SIGN UP
  // ERR 400 : 아이디 중복
  UserLoginIdExistError: 'UserLoginIdExistError',

  // ERR 400 : 이메일 중복
  UserEmailExistError: 'UserEmailExistError',

  // // LOGIN
  // ERR 400 : 아이디, 이메일 미존재
  UserloginIdNotExistError: 'UserloginIdNotExistError',

  // ERR 400 : 비밀번호 불일치
  UserPasswordMismatchError: 'UserPasswordMismatchError',

  // // AUTHMIDDLEWARE
  // ERR 401 : 로그인 전일 경우
  LoginRequiredError: 'LoginRequiredError',

  // ERR 401 : 토큰이 Bearer이 아닐 경우
  TokenTypeMismatchError: 'TokenTypeMismatchError',

  // ERR 403 : 상품을 등록한 계정이 아닌 경우
  TokenUserDoesNotExistError: 'TokenUserDoesNotExistError',

  // // PRODUCT
  // ERR 404 : 상품 id가 존재하지 않은 경우
  ProductDoesNotExistError: 'ProductDoesNotExistError',
};

class CustomError extends Error {
  constructor(type) {
    super(type);
    this.name = 'CustomError';
    this.type = type;
  }
}

class UsersValidError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UsersValidError';
  }
}

class ProductsValidError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProductsValidError';
  }
}

export { CustomError, ErrorTypes, UsersValidError, ProductsValidError };
