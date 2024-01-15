'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      token: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      method: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isValid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      validUntil: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tokens');
  },
};
