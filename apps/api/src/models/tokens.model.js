'use strict';
import { Model, DataTypes } from 'sequelize';

export default class tokens extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

export const init = (sequelize) => {
  tokens.init(
    {
      token: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      method: DataTypes.STRING,
      isValid: DataTypes.BOOLEAN,
      validUntil: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'tokens',
    },
  );
};
