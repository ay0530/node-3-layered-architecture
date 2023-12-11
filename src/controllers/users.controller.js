import dotenv from 'dotenv'; // dotenv 패키지
dotenv.config();
import { validationResult } from 'express-validator'; // express 유효성 검사 패키지
import { UsersValidError } from '../error-handlers/custom.errors.js'; // custom 에러
import UsersService from '../services/users.services.js'; // 서비스

class UsersController {
  UsersService = new UsersService();

  // 회원 정보 저장(CREATE)
  createUser = async (req, res, next) => {
    // validationResult : express-validator 유효성 검사 실행
    const errors = validationResult(req);
    try {
      const { login_id, password, confirmPassword, name, email } = req.body; // body 값 조회

      // ERR 400 : 필수 값들이 입력되지 않은 경우
      if (!errors.isEmpty()) {
        throw new UsersValidError();
      }

      // 저장 : 회원 정보
      await this.UsersService.createUser(login_id, password, confirmPassword, name, email);

      // response 반환
      res.status(201).json({ message: "회원가입이 완료되었습니다.", data: { login_id, name, email } });
    } catch (error) {
      next(error);
    }
  };

  // 내 정보 조회(Read)
  getUser = async (req, res, next) => {
    try {
      const { login_id, email, name } = res.locals.user; // localstroage 값 조회
      // response 반환
      res.status(200).json({ message: "내 정보 조회가 완료되었습니다.", data: { login_id, name, email } });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;