import jwt from 'jsonwebtoken'; // jwt 패키지
import bcrypt from 'bcrypt'; // bcrypt 패키지
const { compare } = bcrypt;
import { CustomError, ErrorTypes } from '../error-handlers/custom.errors.js'; // custom 에러
import UsersRepository from '../repositories/users.repositories.js'; // users 레포지토리

class AutoService {
  usersRepository = new UsersRepository();

  loginUser = async (login_id, password) => {
    // 조회 : 회원 정보
    const user = await this.usersRepository.getUser(login_id);

    // ERR 400 : 아이디, 이메일 미존재
    if (!user) {
      throw new CustomError(ErrorTypes.UserloginIdNotExistError);
    }

    // 비밀번호 복호화
    const passwordValue = user[0].password;
    const equalPassword = await compare(password, passwordValue);

    // ERR 400 : 비밀번호 불일치
    if (!equalPassword) {
      throw new CustomError(ErrorTypes.UserPasswordMismatchError);
    }

    // 토큰 생성
    const token = await jwt.sign({ login_id }, process.env.PRIVATE_KEY, { expiresIn: "12h" });
    return token; // controller로 토큰 반환
  };
}

export default AutoService;
