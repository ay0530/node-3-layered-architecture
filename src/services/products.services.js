import { CustomError, ErrorTypes } from '../error-handlers/custom.errors.js'; // custom 에러
import ProductRepository from '../repositories/products.repositories.js';

class ProductService {
  productsRepository = new ProductRepository();

  // 상품 저장
  createProduct = async (login_id, name, description) => {
    // 조회 : 회원 번호  
    const userId = await this.productsRepository.getUserId(login_id);

    // 저장 : 상품 정보
    const product = await this.productsRepository.createProduct(userId, name, description);
    return product;
  };

  // 상품 전체 조회
  getProducts = async (orderBy) => {
    const products = await this.productsRepository.getProducts(orderBy);
    return products;
  };

  // 상품 상세 조회
  getProduct = async (id) => {
    // 조회 : 상품 정보 
    const existsProduct = await this.productsRepository.getProduct(id);

    // ERR 404 : 상품 id가 존재하지 않은 경우
    if (!existsProduct) {
      throw new CustomError(ErrorTypes.ProductDoesNotExistError);
    }

    const product = await this.productsRepository.getProduct(id);
    return product;
  };

  // 상품 수정
  updateProduct = async (login_id, id, name, description, status) => {
    // 조회 : 회원 번호 
    const userId = await this.productsRepository.getUserId(login_id);

    // 조회 : 상품 정보
    const existsProduct = await this.productsRepository.getProduct(id);

    // ERR 404 : 상품 id가 존재하지 않은 경우
    if (!existsProduct.length) {
      throw new CustomError(ErrorTypes.ProductDoesNotExistError);
    }

    // ERR 403 : 상품을 등록한 계정이 아닌 경우
    if (userId !== existsProduct[0].user_id) {
      throw new CustomError(ErrorTypes.TokenUserDoesNotExistError);
    }

    // 수정 : 상품 정보
    const product = await this.productsRepository.updateProduct(id, name, description, status);
    return product;
  };

  // 상품 삭제
  deleteProduct = async (login_id, id) => {
    // 조회 : 회원 번호 
    const userId = await this.productsRepository.getUserId(login_id);

    // ERR 404 : 상품 id가 존재하지 않은 경우
    const existsProduct = await this.productsRepository.getProduct(id);
    if (existsProduct.length === 0) {
      throw new CustomError(ErrorTypes.ProductDoesNotExistError);
    }

    // ERR 403 : 상품을 등록한 계정이 아닌 경우
    if (userId !== existsProduct[0].user_id) {
      throw new CustomError(ErrorTypes.TokenUserDoesNotExistError);
    }

    // 삭제 : 상품 정보
    await this.productsRepository.deleteProduct(id);

  };
}

export default ProductService;