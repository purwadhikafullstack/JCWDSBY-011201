'use strict';
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'unit',
        {
            allowNull: false,
            type: Sequelize.ENUM,
            values: ['g', 'ml'],
        }
    );
};
export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
};