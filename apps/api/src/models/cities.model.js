'use strict';

import { Model, DataTypes } from 'sequelize';
import provinces from './provinces.model';
import user_addresses from './user-addresses.model';
import stores from './stores.model';
import districts from './districts.model';

export default class cities extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    cities.belongsTo(provinces, { foreignKey: 'provinceId' });
    cities.hasMany(districts, { foreignKey: 'cityId' });
    cities.hasMany(user_addresses, { foreignKey: 'cityId' });
    cities.hasMany(stores, { foreignKey: 'cityId' });
  }
}

export const init = (sequelize) => {
  cities.init(
    {
      provinceId: DataTypes.INTEGER,
      cityName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'cities',
    },
  );
};
