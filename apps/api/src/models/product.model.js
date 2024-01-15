import { Model, DataTypes } from 'sequelize';

export default class product extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    product.belongsTo(models.categories, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    product.hasMany(models.inventory, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    product.hasMany(models.product_image, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
};

export const init = (sequelize) => {
  product.init({
    categoryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.STRING,
    weight: DataTypes.INTEGER,
    unit: DataTypes.ENUM(['g', 'ml']),
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'product',
    paranoid: true,
  });
};
