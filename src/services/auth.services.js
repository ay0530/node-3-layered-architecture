// src/services/users.services.js

import UsersRepository from '../repositories/users.repositories.js';

class UsersService {
  usersRepository = new UsersRepository();

  getLoginId = async (login_id) => {
    const existsLoginId = await this.usersRepository.getLoginId(login_id);
    return existsLoginId;
  };

  getEmail = async (email) => {
    const existsEmail = await this.usersRepository.getEmail(email);
    return existsEmail;
  };

  createUser = async (login_id, newPassword, name, email) => {
    await this.usersRepository.createUser(login_id, newPassword, name, email);
  };

  getUser = async (login_id) => {
    const user = await this.usersRepository.getUser(login_id);
    return user;
  };
}

export default UsersService;
