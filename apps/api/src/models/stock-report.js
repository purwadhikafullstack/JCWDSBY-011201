import { Model, DataTypes } from 'sequelize';
import users from './users.model';
import inventory from './inventory.model';

export default class stock_report extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    stock_report.belongsTo(users)
    stock_report.belongsTo(inventory)
  }
};

export const init = (sequelize) => {
  stock_report.init({
    inventoryId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    initialStock: DataTypes.INTEGER,
    stockChange: DataTypes.INTEGER,
    endStock: DataTypes.INTEGER,
    detail: DataTypes.STRING,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'stock_report',
    paranoid: true,
  });
};