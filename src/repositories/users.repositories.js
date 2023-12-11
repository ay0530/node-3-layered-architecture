// src/repositories/users.repositories.js

import { prisma } from '../utils/prisma/index.js';

class UsersRepository {
  getLoginId = async (login_id) => {
    const existsLoginId = await prisma.USER.findUnique({
      where: { login_id }
    });
    return existsLoginId;
  };

  getEmail = async (email) => {
    const existsEmail = await prisma.USER.findUnique({
      where: { email }
    });
    return existsEmail;
  };

  createUser = async (login_id, newPassword, name, email) => {
    await prisma.USER.create({
      data: {
        login_id,
        password: newPassword,
        name,
        email,
      },
    });
  };

  getUser = async (login_id) => {
    const user = await prisma.USER.findMany({
      where: {
        OR: [
          { login_id: { contains: login_id } },
          { email: { contains: login_id } }
        ]
      }
    });
    return user;
  };
}

export default UsersRepository;
