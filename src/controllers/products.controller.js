
import { validationResult } from 'express-validator'; // express 유효성 검사 패키지
import { CustomError, ErrorTypes, ProductsValidError } from '../error-handlers/custom.errors.js'; // custom 에러
import ProductsService from '../services/products.services.js'; // 서비스

class ProductsController {
  productsService = new ProductsService();

  // // 상품 정보 저장
  createProduct = async (req, res, next) => {
    const errors = validationResult(req);
    try {
      const { name, description } = req.body;    // body 값 조회
      const { login_id } = res.locals.user;

      // ERR 400 : 데이터가 하나라도 입력되지 않은 경우
      if (!errors.isEmpty()) {
        throw new ProductsValidError();
      }

      // 조회 : 회원 번호
      const userId = await this.productsService.getUserId(login_id);

      // 저장 : 상품 정보
      const createProduct = await this.productsService.createProduct(userId, name, description);

      // response 반환
      res.status(201).json({ data: createProduct });
    } catch (error) {
      next(error);
    }
  };

  // //  상품 정보 수정
  updateProduct = async (req, res, next) => {
    const errors = validationResult(req);
    try {
      const { id } = req.params; // params 값 조회
      const { name, description, status } = req.body; // body 값 조회
      const { login_id } = res.locals.user;

      // ERR 400 : 데이터가 하나라도 입력되지 않은 경우
      if (!errors.isEmpty()) {
        throw new ProductsValidError();
      }
      // 조회 : 회원 번호 
      const userId = await this.productsService.getUserId(login_id);
      // const userId = user.id;

      // 조회 : 상품 정보
      const product = await this.productsService.getProduct(id);

      // ERR 404 : DB에 해당 상품의 Id 값이 존재하지 않은 경우
      if (!product) {
        throw new CustomError(ErrorTypes.ProductDoesNotExistError);
      }

      // ERR 403 : 상품을 등록한 계정이 아닌 경우
      if (userId !== product.user_id) {
        throw new CustomError(ErrorTypes.TokenUserDoesNotExistError);
      }

      // 수정 : 상품 정보
      await this.productsService.updateProduct(id, name, description, status);

      res.status(200).json({ message: "상품 정보를 수정하였습니다." });
    } catch (error) {
      next(error);
    }
  };

  // //  상품 정보 삭제
  deleteProduct = async (req, res, next) => {
    try {
      const { id } = req.params; // params 값 조회
      const { login_id } = res.locals.user;

      // 조회 : 회원 번호 
      const userId = await this.productsService.getUserId(login_id);
      // const userId = user.id;

      // ERR 404 : DB에 해당 상품의 Id 값이 존재하지 않은 경우
      const product = await this.productsService.getProduct(id);
      if (!product) {
        throw new CustomError(ErrorTypes.ProductDoesNotExistError);
      }

      // ERR 403 : 상품을 등록한 계정이 아닌 경우
      if (userId !== product.user_id) {
        throw new CustomError(ErrorTypes.TokenUserDoesNotExistError);
      }

      // 삭제 : 상품 정보
      await this.productsService.deleteProduct(id);

      res.status(200).json({ message: "상품을 삭제하였습니다." });
    } catch (error) {
      next(error);
    }
  };

  // //  상품 정보 전체 조회
  // eslint-disable-next-line no-unused-vars
  getProducts = async (req, res, next) => {
    const { category, order } = req.query; // req 조회
    const orderByField = {}; // 동적 정렬 필드를 담을 빈 객체 생성
    orderByField[category] = order === 'desc' ? 'desc' : 'asc'; // 동적으로 정렬 필드를 설정
    // 조회 : 상품 전체
    const products = await this.productsService.getProducts();
    return res.status(200).json({ products });
  };

  // //  상품 상세 조회
  getProduct = async (req, res, next) => {
    try {
      const { id } = req.params; // params 값 조회
      // 상품 정보 조회
      const product = await this.productsService.getProduct(id);

      // ERR 404 : DB에 해당 상품의 Id 값이 존재하지 않은 경우
      if (!product) {
        throw new CustomError(ErrorTypes.ProductDoesNotExistError);
      }

      res.status(200).json({ product: product });
    } catch (error) {
      next(error);
    }
  };
}



export default ProductsController;  // router 내보내기