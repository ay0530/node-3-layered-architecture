const express = require("express"); // express 받아오기
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware.js'); // auth.middleware.js 조회
const { PrismaClient } = require('@prisma/client'); // prisma 패키지
const prisma = new PrismaClient();
// 에러처리
const { CustomError, ErrorTypes, ProductValidError, } = require('../../error-handlers/custom.errors.js');
const { validationResult } = require('express-validator');
const { productValidate } = require('../../validator/product.validator.js'); // auth.middleware.js 조회
// // 상품 정보 저장
router.post("/", authMiddleware, productValidate, async (req, res, next) => {
  const errors = validationResult(req);
  try {
    const { name, description } = req.body;    // body 값 조회
    const { login_id } = res.locals.user;

    // ERR 400 : 데이터가 하나라도 입력되지 않은 경우
    if (!errors.isEmpty()) {
      throw new ProductValidError();
    }

    // 조회 : 회원 번호
    const userId = await prisma.USER.findUnique({
      select: { id: true },
      where: { login_id }
    });

    // 저장 : 상품정보
    await prisma.PRODUCT.create({
      data: {
        user_id: userId.id,
        name,
        description
      }
    });
    await prisma.$disconnect(); // prisma 연결 끊기
    res.status(201).json({ message: "판매 상품을 등록하였습니다." });
  } catch (error) {

    next(error);
  }
});

// //  상품 정보 수정
router.put("/:id", authMiddleware, productValidate, async (req, res, next) => {
  const errors = validationResult(req);
  try {
    const { id } = req.params; // params 값 조회
    const { name, description, status } = req.body; // body 값 조회
    const { login_id } = res.locals.user;

    // ERR 400 : 데이터가 하나라도 입력되지 않은 경우
    if (!errors.isEmpty()) {
      throw new ProductValidError();
    }
    // 조회 : 회원 번호 
    const user = await prisma.USER.findUnique({
      where: { login_id }
    });
    const userId = user.id;

    // 조회 : 상품 정보
    const existsProduct = await prisma.PRODUCT.findUnique({
      where: {
        id: +id
      }
    });
    // ERR 404 : DB에 해당 상품의 Id 값이 존재하지 않은 경우
    if (!existsProduct) {
      throw new CustomError(ErrorTypes.ProductDoesNotExistError);
    }
    // ERR 403 : 상품을 등록한 계정이 아닌 경우
    if (userId !== existsProduct.user_id) {
      throw new CustomError(ErrorTypes.TokenUserDoesNotExistError);
    }

    // 수정 : 상품 정보
    await prisma.PRODUCT.update({
      data: {
        name,
        description,
        status,
        updated_at: new Date()
      }, where: {
        id: +id
      }
    });
    await prisma.$disconnect(); // prisma 연결 끊기
    res.status(200).json({ message: "상품 정보를 수정하였습니다." });
  } catch (error) {
    next(error);
  }
});

// //  상품 정보 삭제
router.delete("/:id", authMiddleware, productValidate, async (req, res, next) => {
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
    if (!existsProduct) {
      throw new CustomError(ErrorTypes.ProductDoesNotExistError);
    }

    // ERR 403 : 상품을 등록한 계정이 아닌 경우
    if (userId !== existsProduct.user_id) {
      throw new CustomError(ErrorTypes.TokenUserDoesNotExistError);
    }

    // 삭제 : 상품 정보
    await prisma.PRODUCT.delete({
      where: { id: +id }
    });
    await prisma.$disconnect(); // prisma 연결 끊기
    res.status(200).json({ message: "상품을 삭제하였습니다." });
  } catch (error) {
    next(error);
  }
});

// //  상품 정보 전체 조회
router.get("/", async (req, res, next) => {
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
router.get("/:id", async (req, res, next) => {
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
      throw new CustomError(ErrorTypes.ProductDoesNotExistError);
    }
    await prisma.$disconnect(); // prisma 연결 끊기
    res.status(200).json({ product: product });
  } catch (error) {

    next(error);
  }
});

module.exports = router; // router 내보내기