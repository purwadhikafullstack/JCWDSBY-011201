import { Model, DataTypes } from 'sequelize';

export default class inventory extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    inventory.belongsTo(models.stores);
    inventory.hasMany(models.discount);
    inventory.belongsTo(models.product);
    inventory.hasMany(models.transactionDetails, {
      foreignKey: 'inventoryId',
    });
    inventory.hasMany(models.stock_report);
  }
}
export const init = (sequelize) => {
  inventory.init(
    {
      storeId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      bookedStock: DataTypes.INTEGER,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'inventory',
      paranoid: true,
    },
  );
};
