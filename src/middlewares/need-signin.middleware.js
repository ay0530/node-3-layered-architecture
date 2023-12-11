import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken'; // 패키지를 default로 가져옵니다.
const { verify } = jwt;
import { prisma } from '../utils/prisma/index.js';
import { CustomError, ErrorTypes } from '../error-handlers/custom.errors.js'; // custom 에러


// 사용자 인증 미들웨어
export default async (req, res, next) => {
  try {
    // 토큰 정보 조회
    const { Authorization } = req.cookies;
    const [authType, authToken] = (Authorization ?? "").split(" ");

    // ERR 401 : 로그인 전일 경우
    if (!authToken) {
      throw new CustomError(ErrorTypes.LoginRequiredError);
    }

    // ERR 401 : 토큰이 Bearer이 아닐 경우
    if (authType !== "Bearer") {
      throw new CustomError(ErrorTypes.TokenTypeMismatchError);
    }

    // 조회 : 회원 정보
    const decoded = await verify(authToken, process.env.PRIVATE_KEY);
    const { login_id } = decoded;

    const user = await prisma.USER.findMany({
      where: {
        OR: [
          { login_id: { contains: login_id, } },
          { email: { contains: login_id, } }
        ]
      }
    });
    res.locals.user = user[0];    // localStorage에 user 값 저장
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error("403-토큰유효기간만료");
    }
    next(error);
  }
};