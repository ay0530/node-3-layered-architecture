require('dotenv').config();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client'); // prisma 패키지
const prisma = new PrismaClient();

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
  try {
    // 토큰 정보 조회
    const { Authorization } = req.cookies;
    const [authType, authToken] = (Authorization ?? "").split(" ");

    // ERR 401 : 로그인 전
    if (!authToken || authType !== "Bearer") { throw new Error("401-로그인전"); }

    // 조회 : 회원 정보
    const decoded = await jwt.verify(authToken, process.env.PRIVATE_KEY);
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
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error("403-토큰유효기간만료");
    } else if (err.message === "401-로그인전") {
      res.status(401).send({ errorMessage: "로그인 후 이용 가능한 기능입니다." });
    } else if (err.message = "403-토큰유효기간만료") {
      return res.status(403).json({ message: '토큰이 만료되었습니다.' });
    } else {
      console.log(err);
      res.status(404).send({ errorMessage: "예상치 못한 에러가 발생하였습니다. 관리자에게 문의 바랍니다." });
    }
  }
};