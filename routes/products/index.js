const express = require("express"); // express 받아오기
const router = express.Router();
const jwt = require('jsonwebtoken'); // jwt 패키지 - 인증
const authMiddleware = require('../../middlewares/auth-middleware.js'); // auth-middleware.js 조회
const { PrismaClient } = require('@prisma/client'); // prisma 패키지
const prisma = new PrismaClient();

// // 상품 정보 저장
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;    // body 값 조회
    const { login_id } = res.locals.user;

    // 조회 : 회원 번호
    const userId = await prisma.USER.findUnique({
      select: { id: true },
      where: { login_id }
    });

    // ERR 400 : 데이터가 하나라도 입력되지 않은 경우
    if (!name || !description) { throw new Error("400-데이터입력err"); }

    // 저장 : 상품정보
    const product = await prisma.PRODUCT.create({
      data: {
        user_id: userId.id,
        name,
        description
      }
    });
    await prisma.$disconnect(); // prisma 연결 끊기
    res.status(201).json({ message: "판매 상품을 등록하였습니다." });
  } catch (error) {
    if (error.message === "400-데이터입력err") {
      return res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    } else {
      console.log(error);
    }
  }
});

// //  상품 정보 수정
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params; // params 값 조회
    const { name, description, status } = req.body; // body 값 조회
    const { login_id } = res.locals.user;

    // 조회 : 회원 번호 
    const user = await prisma.USER.findUnique({
      where: { login_id }
    });
    const userId = user.id;

    // ERR 404 : DB에 해당 상품의 Id 값이 존재하지 않은 경우
    const existsProduct = await prisma.PRODUCT.findUnique({
      where: {
        id: +id
      }
    });
    if (!existsProduct) { throw new Error("404-상품미저장err"); }

    // ERR 400 : 데이터가 하나라도 입력되지 않은 경우
    if (!name || !description || !status) { throw new Error("400-데이터입력err"); }
    // ERR 403 : 상품을 등록한 계정이 아닌 경우
    if (userId !== existsProduct.user_id) { throw new Error("403-권한미존재"); }

    // 수정 : 상품 정보
    await prisma.PRODUCT.update({
      where: {
        id: +id
      },
      data: {
        name,
        description,
        status,
        updated_at: new Date()
      }
    });
    await prisma.$disconnect(); // prisma 연결 끊기
    res.status(200).json({ message: "상품 정보를 수정하였습니다." });
  } catch (error) {
    // SequelizeValidationError : Models의 유효성 검사 에러
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message.replace('Validation error: ', ''));
      return res.status(400).json({ errorMessage: validationErrors });
    }
    else if (error.message === "400-데이터입력err") {
      res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    } else if (error.message === "403-권한미존재") {
      res.status(403).json({ errorMessage: "수정 권한이 없습니다." });
    } else if (error.message === "404-상품미저장err") {
      res.status(404).json({ errorMessage: "상품 조회에 실패하였습니다." });
    } else {
      console.log(error);
    }
  }
});

// //  상품 정보 삭제
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params; // params 값 조회
    const { login_id } = res.locals.user;

    // 조회 : 회원 번호
    const user = await prisma.USER.findUnique({
      where: { login_id }
    });
    const userId = user.id;

    // ERR 404 : DB에 해당 상품의 Id 값이 존재하지 않은 경우
    const existsProduct = await prisma.PRODUCT.findUnique({
      where: { id: +id }
    });
    if (!existsProduct) { throw new Error("404-상품미저장err"); }

    // ERR 403 : 상품을 등록한 계정이 아닌 경우
    if (userId !== existsProduct.user_id) { throw new Error("403-권한미존재"); }

    // 삭제 : 상품 정보
    await prisma.PRODUCT.delete({
      where: { id: +id }
    });
    await prisma.$disconnect(); // prisma 연결 끊기
    res.status(200).json({ message: "상품을 삭제하였습니다." });
  } catch (error) {
    if (error.message === "403-권한미존재") {
      res.status(403).json({ errorMessage: "권한이 없습니다." });
    } else if (error.message === "404-상품미저장err") {
      res.status(404).json({ errorMessage: "상품 조회에 실패하였습니다." });
    } else {
      console.log(error);
    }
  }
});

// //  상품 정보 전체 조회
router.get("/", async (req, res) => {
  const { category, order } = req.query; // req 조회
  const orderByField = {}; // 동적 정렬 필드를 담을 빈 객체 생성
  orderByField[category] = order === 'desc' ? 'desc' : 'asc'; // 동적으로 정렬 필드를 설정
  // 조회 : 상품 전체
  const products = await prisma.PRODUCT.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      user: {
        select: {
          login_id: true,
        },
      },
    },
    orderBy: orderByField
  });
  await prisma.$disconnect(); // prisma 연결 끊기
  return res.status(200).json({ products });
});

// //  상품 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // params 값 조회
    // 조회 : 상품 상세
    const product = await prisma.PRODUCT.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        user: {
          select: {
            login_id: true,
          },
        },
      },
      where: { id: +id }
    });
    // ERR 404 : DB에 해당 상품의 Id 값이 존재하지 않은 경우
    if (!product) {
      throw new Error("404-상품미저장err");
    }
    await prisma.$disconnect(); // prisma 연결 끊기
    res.status(200).json({ product: product });
  } catch (error) {
    if (error.message === "404-상품미저장err") {
      return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
    } else {
      console.log(error);
    }
  }
});

module.exports = router; // router 내보내기