import { prisma } from '../utils/prisma/index.js';

class ProductsRepository {
  // 회원 번호 조회
  getUserId = async (login_id) => {
    const userId = await prisma.USER.findUnique({
      select: { id: true },
      where: { login_id }
    });
    return userId;
  };

  // 상품 저장
  createProduct = async (userId, name, description) => {
    const createdPost = await prisma.PRODUCT.create({
      data: {
        user_id: userId,
        name,
        description
      }
    });
    return createdPost;
  };
  // 상품 전체 조회

  getProducts = async (orderByField) => {
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
      }
    });
    return products;
  };
  // 상품 상세 조회
  getProduct = async (id) => {
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

    return product;
  };

  // 상품 수정
  updateProduct = async (id, name, description, status) => {
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
  };

  // 상품 삭제
  deleteProduct = async (id) => {
    await prisma.PRODUCT.delete({
      where: { id: +id }
    });
  };
}

export default ProductsRepository;