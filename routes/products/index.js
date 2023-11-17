const express = require("express"); // express 받아오기
const router = express.Router(); // router 받아오기
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
const { Products, Members } = require("../../models/index");
Members.hasMany(Products, { as: 'p', foreignKey: 'm_num' });
Products.belongsTo(Members, { as: 'm', foreignKey: 'm_num' });



// // 1. 상품 작성 API (Create / POST)
router.post("/", async (req, res) => {
  try {
    console.log("test");

    const { Authorization } = req.cookies;
    const [authType, authToken] = (Authorization ?? "").split(" ");
    const { m_id } = jwt.verify(authToken, "lay-secret-key");

    const m_num = await Members.findOne({
      attributes: ["m_num"],
      where: { m_id: m_id }
    });
    const m_num_value = m_num.get("m_num");

    // body 값 조회
    const { p_name, p_description } = req.body;

    // ERR 400 : 데이터가 하나라도 입력되지 않은 경우
    if (!p_name || !p_description) {
      throw new Error("400-데이터입력err");
    }

    // 저장(CREATE)
    await Products.create({ m_num_value, p_name, p_description });
    res.status(201).json({ message: "판매 상품을 등록하였습니다." });
  } catch (error) {
    if (error.message === "400-데이터입력err") {
      return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    } else {
      console.log(error);
    }
  }
});

// //  상품 정보 수정 API (Update / PUT)
router.put("/:p_num", async (req, res) => {
  try {
    const { p_num } = req.params; // params 값 조회
    const { p_name, p_description, p_status } = req.body; // body 값 조회

    // ERR 404 : DB에 해당 상품의 Id 값이 존재하지 않은 경우
    const existsProduct = await Products.findOne({ where: { p_num: p_num } });
    if (!existsProduct) {
      throw new Error("404-상품미저장err");
    }

    // ERR 400 : 데이터가 하나라도 입력되지 않은 경우;
    if (!p_name || !p_description || !p_status) {
      throw new Error("400-데이터입력err");
    }

    // 수정(UPDATE)
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
    // 오류를 클라이언트에게 반환
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message.replace('Validation error: ', ''));
      return res.status(400).json({ errorMessage: validationErrors });
    }
    else if (error.message === "400-데이터입력err") {
      res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    } else if (error.message === "404-상품미저장err") {
      res.status(404).json({ errorMessage: "상품 조회에 실패하였습니다." });
    }
  }
});

// //  5. 상품 삭제 API (Delete / DELETE)
router.delete("/:p_id", async (req, res) => {
  try {
    const { p_id } = req.params; // params 값 조회

    // ERR 404 : DB에 해당 상품의 Id 값이 존재하지 않은 경우
    const existsProduct = await Products.findByPk({ p_id });
    if (!existsProduct) {
      throw new Error("404-상품미저장err");
    }

    // 삭제(DELETE)
    await Products.deleteOne({ p_id });
    res.status(200).json({ message: "상품을 삭제하였습니다." });
  } catch (error) {
    if (error.message === "400-데이터입력err") {
      res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    } else if (error.message === "404-상품미저장err") {
      res.status(403).json({ errorMessage: "상품 조회에 실패하였습니다." });
    }
  }
});

// //  상품 목록 조회 API (Read / GET)
router.get("/", async (req, res) => {
  const { category, order } = req.query;

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
    raw: true // 결과를 JSON 객체로 반환하려면 raw: true 옵션을 사용합니다.
  });

  // 조회 (READ)
  return res.status(200).json({ allProduct });
});

// //  상품 상세 조회 API (Read / GET)
router.get("/:p_num", async (req, res) => {
  try {
    const { p_num } = req.params; // params 값 조회

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

    res.status(200).json({ detail: product });
  } catch (error) {
    if (error.message === "404-상품미저장err") {
      return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
    }
  }
});

module.exports = router; // router 내보내기