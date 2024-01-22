'use strict';
/** @type {import('sequelize-cli').Migration} */

  export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      storeId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      discountId: {
        type: Sequelize.INTEGER
      },
      productId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'products',
          key: 'id'
        }
      },
      stock: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      deletedAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  };
  export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('inventories');
  };
