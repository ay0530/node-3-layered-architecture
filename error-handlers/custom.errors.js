const ErrorTypes = {
  // // USER, SIGNUP
  // 아이디(login_id) 중복
  UserLoginIdExistError: 'UserLoginIdExistError',

  // 이메일 중복
  UserEmailExistError: 'UserEmailExistError',

  // // LOGIN
  // 아이디 존재 하지 않음
  UserloginIdNotExistError: 'UserloginIdNotExistError',

  // 비밀번호 일치하지 않음
  UserPasswordMismatchError: 'UserPasswordMismatchError',

  // // AUTHMIDDLEWARE
  // !authorization, 로그인 필요 시
  LoginRequiredError: 'LoginRequiredError',

  // 토큰 타입 일치하지 않을 떄
  TokenTypeMismatchError: 'TokenTypeMismatchError',

  // 토큰 사용자가 존재하지 않을 때, 권한이 없을 때
  TokenUserDoesNotExistError: 'TokenUserDoesNotExistError',

  //// PRODUCT
  ProductDoesNotExistError: 'ProductDoesNotExistError',
  AllPostsNotExistError: 'AllPostsNotExistError',
};

class CustomError extends Error {
  constructor(type) {
    super(type);
    this.name = 'CustomError';
    this.type = type;
  }
}

class UserValidError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserValidError';
  }
}

class ProductValidError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProductValidError';
  }
}

module.exports = { CustomError, ErrorTypes, UserValidError, ProductValidError };
