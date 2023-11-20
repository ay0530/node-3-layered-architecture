const express = require("express"); // express 받아오기
const router = express.Router(); // router 받아오기
const jwt = require("jsonwebtoken");

// DB 설정
const sequelize = require("sequelize");
const { Products, Members } = require("../../models/index");
Members.hasMany(Products, { as: 'p', foreignKey: 'm_num' });
Products.belongsTo(Members, { as: 'm', foreignKey: 'm_num' });

// // 상품 정보 저장
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { p_name, p_description } = req.body;    // body 값 조회
    const { Authorization } = req.cookies; // cookie 값 조회
    // 조회 : 쿠키에 저장된 토큰 , payload
    const [authType, authToken] = (Authorization ?? "").split(" ");
    const { m_id } = jwt.verify(authToken, "lay-secret-key");

    // 조회 : 회원 번호
    const m_num = await Members.findOne({
      attributes: ["m_num"],
      where: { m_id: m_id }
    });
    const m_num_value = m_num.get("m_num");

    // ERR 400 : 데이터가 하나라도 입력되지 않은 경우
    if (!p_name || !p_description) { throw new Error("400-데이터입력err"); }

    // 저장 : 상품정보
    await Products.create({ m_num: m_num_value, p_name, p_description });
    res.status(201).json({ message: "판매 상품을 등록하였습니다." });
  } catch (error) {
    if (error.message === "400-데이터입력err") {
      return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }
  }
});

// //  상품 정보 수정
router.put("/:p_num", authMiddleware, async (req, res) => {
  try {
    const { p_num } = req.params; // params 값 조회
    const { p_name, p_description, p_status } = req.body; // body 값 조회
    // 조회 : 쿠키에 저장된 토큰 , payload
    const { Authorization } = req.cookies; // cookie 값 조회
    const [authType, authToken] = (Authorization ?? "").split(" ");
    const { m_id } = jwt.verify(authToken, "lay-secret-key");

    // 조회 : 회원 번호 
    const m_num = await Members.findOne({
      attributes: ["m_num"],
      where: { m_id: m_id }
    });
    const m_num_value = m_num.get("m_num");

    // ERR 404 : DB에 해당 상품의 Id 값이 존재하지 않은 경우
    const existsProduct = await Products.findOne({
      where: { p_num: p_num }
    });
    if (!existsProduct) { throw new Error("404-상품미저장err"); }

    // ERR 400 : 데이터가 하나라도 입력되지 않은 경우
    if (!p_name || !p_description || !p_status) { throw new Error("400-데이터입력err"); }

    // ERR 400 : 상품을 등록한 계정이 아닌 경우
    if (m_num_value !== existsProduct.get("m_num")) { throw new Error("400-권한미존재"); }

    // 수정 : 상품 정보
    await Products.update(
      {
        p_name: p_name,
        p_description: p_description,
        p_status: p_status,
        p_updated_at: Date.now()
      }, {
      where: {
        p_num: p_num
      }
    }
    );
    res.status(200).json({ message: "상품 정보를 수정하였습니다." });
  } catch (error) {
    // SequelizeValidationError : Models의 유효성 검사 에러
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message.replace('Validation error: ', ''));
      return res.status(400).json({ errorMessage: validationErrors });
    }
    else if (error.message === "400-데이터입력err") {
      res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    } else if (error.message === "404-상품미저장err") {
      res.status(404).json({ errorMessage: "상품 조회에 실패하였습니다." });
    } else if (error.message === "400-권한미존재") {
      res.status(404).json({ errorMessage: "수정 권한이 없습니다." });
    }
  }
});

// //  상품 정보 삭제
router.delete("/:p_num", authMiddleware, async (req, res) => {
  try {
    const { p_num } = req.params; // params 값 조회

    // 조회 : 쿠키에 저장된 토큰 , payload
    const { Authorization } = req.cookies; // cookie 값 조회
    const [authType, authToken] = (Authorization ?? "").split(" ");
    const { m_id } = jwt.verify(authToken, "lay-secret-key");

    // 조회 : 회원 번호
    const m_num = await Members.findOne({
      attributes: ["m_num"],
      where: { m_id: m_id }
    });
    const m_num_value = m_num.get("m_num");

    // ERR 404 : DB에 해당 상품의 Id 값이 존재하지 않은 경우
    const existsProduct = await Products.findOne({ where: { p_num: p_num } });
    if (!existsProduct) { throw new Error("404-상품미저장err"); }

    // ERR 404 : 상품을 등록한 계정이 아닌 경우
    if (m_num_value !== existsProduct.get("m_num")) { throw new Error("400-권한미존재"); }

    // 삭제 : 상품 정보
    await Products.destroy({
      where: {
        p_num: p_num
      }
    });

    res.status(200).json({ message: "상품을 삭제하였습니다." });
  } catch (error) {
    if (error.message === "404-상품미저장err") {
      res.status(403).json({ errorMessage: "상품 조회에 실패하였습니다." });
    } else if (error.message === "404-권한미존재") {
      res.status(403).json({ errorMessage: "권한이 없습니다." });
    }
  }
});

// //  상품 정보 전체 조회
router.get("/", async (req, res) => {
  const { category, order } = req.query; // req 조회

  // 조회 : 상품 전체
  const allProduct = await Products.findAll({
    attributes: [
      'p_num',
      'p_name',
      'p_description',
      'p_status',
      [sequelize.col('m.m_name'), 'm_name'],
      'p_created_at',
    ],
    include: [
      {
        model: Members,
        as: 'm',
        attributes: []
      }
    ],
    order: [[category, order]],
    raw: true
  });
  return res.status(200).json({ allProduct });
});

// //  상품 상세 조회
router.get("/:p_num", async (req, res) => {
  try {
    const { p_num } = req.params; // params 값 조회

    // 조회 : 상품 상세
    const product = await Products.findOne({
      attributes: [
        'p_num',
        'p_name',
        'p_description',
        'p_status',
        [sequelize.col('m.m_name'), 'm_name'],
        'p_created_at',
      ],
      include: [
        {
          model: Members,
          as: 'm',
          attributes: []
        }
      ],
      where: { p_num }
    });

    // ERR 404 : DB에 해당 상품의 Id 값이 존재하지 않은 경우
    if (!product) {
      throw new Error("404-상품미저장err");
    }

    res.status(200).json({ product: product });
  } catch (error) {
    if (error.message === "404-상품미저장err") {
      return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
    }
  }
});

module.exports = router; // router 내보내기