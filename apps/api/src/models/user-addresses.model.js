'use strict';

import { Model, DataTypes } from 'sequelize';
import users from './users.model';
import cities from './cities.model';
import provinces from './provinces.model';
import districts from './districts.model';

export default class user_addresses extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    user_addresses.belongsTo(users, { foreignKey: 'userId' });
    user_addresses.belongsTo(cities, { foreignKey: 'cityId' });
    user_addresses.belongsTo(provinces, { foreignKey: 'provinceId' });
    user_addresses.belongsTo(districts, { foreignKey: 'districtId' });
  }
}

export const init = (sequelize) => {
  user_addresses.init(
    {
      userId: DataTypes.INTEGER,
      districtId: DataTypes.INTEGER,
      cityId: DataTypes.INTEGER,
      provinceId: DataTypes.INTEGER,
      address: DataTypes.STRING,
      lat: DataTypes.STRING,
      lon: DataTypes.STRING,
      postalCode: DataTypes.STRING,
      isDefault: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'user_addresses',
      paranoid: true,
    },
  );
};
