import bcrypt from 'bcrypt'; // bcrypt 패키지
const { hash } = bcrypt;
import { CustomError, ErrorTypes } from '../error-handlers/custom.errors.js'; // custom 에러
import UsersRepository from '../repositories/users.repositories.js';

class UsersService {
  usersRepository = new UsersRepository();

  createUser = async (login_id, password, confirmPassword, name, email) => {
    // ERR 400 : 아이디 중복
    const existsLoginId = await this.usersRepository.getLoginId(login_id);
    if (existsLoginId) {
      throw new CustomError(ErrorTypes.UserLoginIdExistError);
    }

    // ERR 400 : 이메일 중복
    const existsEmail = await this.usersRepository.getEmail(email);
    if (existsEmail) {
      throw new CustomError(ErrorTypes.UserEmailExistError);
    }

    // ERR 400 : 비밀번호 불일치
    if (password !== confirmPassword) {
      throw new CustomError(ErrorTypes.UserConfirmPwMismatchError);
    }

    // 비밀번호 암호화
    const newPassword = await hash(password, 10);

    // 저장 : 회원 정보
    await this.usersRepository.createUser(login_id, newPassword, name, email);
  };
}

export default UsersService;
