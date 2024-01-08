import { Model, DataTypes } from 'sequelize';

export default class inventory extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    // inventory.belongsTo(models.stores);
    // inventory.belongsTo(models.discounts);
    inventory.belongsTo(models.product, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    inventory.hasMany(models.cart)
  }
};
export const init = (sequelize) => {
  inventory.init({
    storeId: DataTypes.INTEGER,
    discountId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'inventory',
    paranoid: true,
  });
};
