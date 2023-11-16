const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');
const { Members } = require("../../models/index");

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;
  const [authType, authToken] = (Authorization ?? "").split(" ");

  console.log("미들웨어 실행");
  if (!authToken || authType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }

  try {
    const { m_id } = jwt.verify(authToken, "lay-secret-key");
    const member = await Members.findOne({
      where: {
        [Op.or]: [
          { m_id: m_id },
          { m_email: m_id }
        ]
      }
    });
    res.locals.member = member;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};