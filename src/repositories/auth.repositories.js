// src/repositories/users.repositories.js

import { prisma } from '../utils/prisma/index.js';

class AuthRepository {
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

export default AuthRepository;
