'use strict';

import { Model, DataTypes } from 'sequelize';
import cities from './cities.model';
import stores from './stores.model';
import user_addresses from './user-addresses.model';

export default class provinces extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    provinces.hasMany(cities, { foreignKey: 'provinceId' });
    provinces.hasMany(stores, { foreignKey: 'provinceId' });
    provinces.hasMany(user_addresses, { foreignKey: 'provinceId' });
  }
}

export const init = (sequelize) => {
  provinces.init(
    {
      provinceName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'provinces',
    },
  );
};
