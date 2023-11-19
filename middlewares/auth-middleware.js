const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');
const { Members } = require("../models/index");

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
  try {
    // 토큰 정보 조회
    const { Authorization } = req.cookies;
    const [authType, authToken] = (Authorization ?? "").split(" ");
    const { m_id } = jwt.verify(authToken, "lay-secret-key");

    // ERR 401 : 로그인 전
    if (!authToken || authType !== "Bearer") { throw new Error("401-로그인전"); }

    // 조회 : 회원 정보
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
    if (err.code === "401-로그인전") {
      res.status(401).send({ errorMessage: "로그인 후 이용 가능한 기능입니다." });
    }
  }
};