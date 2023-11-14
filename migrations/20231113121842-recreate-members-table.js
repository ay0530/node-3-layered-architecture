'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Members', {
      m_num: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      m_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      m_password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      m_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      m_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      m_created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now")
      },
      m_updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now")
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Members');
  }
};
