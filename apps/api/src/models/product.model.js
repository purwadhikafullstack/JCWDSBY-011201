import { Model, DataTypes } from 'sequelize';

export default class product extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    product.belongsTo(models.categories);
    product.hasMany(models.inventory);
  }
};

export const init = (sequelize) => {
  product.init({
    categoryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.STRING,
    weight: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'product',
    paranoid: true,
  });
};
