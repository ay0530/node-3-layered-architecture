const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');
const { Members } = require("../models/index");

require('dotenv').config();
const env = process.env;

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
  try {
    // 토큰 정보 조회
    const { Authorization } = req.cookies;
    const [authType, authToken] = (Authorization ?? "").split(" ");

    // ERR 401 : 로그인 전
    if (!authToken || authType !== "Bearer") { throw new Error("401-로그인전"); }

    // 조회 : 회원 정보
    const { m_id } = jwt.verify(authToken, env.PRIVATE_KEY, (err, decoded) => {
      if (err) {
        console.log(err + "!");
        // ERR 401 : 토큰 유효기간 만료
        if (err.name === 'TokenExpiredError') { throw new Error("401-토큰유효기간만료"); }
      }
    });
    const member = await Members.findOne({
      where: {
        [Op.or]: [
          { m_id: m_id },
          { m_email: m_id }
        ]
      }
    });

    res.locals.member = member;    // localStorage에 member 값 저장
    next();
  } catch (err) {
    console.log(err);
    if (err.code === "401-로그인전") {
      res.status(401).send({ errorMessage: "로그인 후 이용 가능한 기능입니다." });
    } else if (err.message = "401-토큰유효기간만료") {
      return res.status(401).json({ message: '토큰이 만료되었습니다.' });
    } else {
      console.log(err);
      res.status(404).send({ errorMessage: "예상치 못한 에러가 발생하였습니다. 관리자에게 문의 바랍니다." });
    }
  }
};