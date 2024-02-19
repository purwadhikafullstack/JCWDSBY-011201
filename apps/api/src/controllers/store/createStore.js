import { validationResult } from 'express-validator';
import { DB } from '../../db';
import geocode from '../../helper/geocode';
import resTemplate from '../../helper/resTemplate';
import {
  findOneCityService,
  findOneDistrictService,
  findOneProvinceService,
} from '../../services/address/address.service';
import {
  createStoreService,
  findMainStoreService,
} from '../../services/store/store.service';
import { findOneAdminByUUIDService } from '../../services/user/admin.service';

const createStore = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw { rc: 400, message: 'invalid request' };
    const district = await findOneDistrictService(req.body.district);
    const city = await findOneCityService(req.body.city);
    const province = await findOneProvinceService(req.body.province);
    const latLon = await geocode(
      district.dataValues.districtName,
      city.dataValues.cityName,
      province.dataValues.provinceName,
    );
    if (!latLon) {
      throw { rc: 404, message: 'Address for store not found' };
    }
    const user = await findOneAdminByUUIDService(req.body.user);
    if (!user) {
      throw { rc: 404, message: 'User not found' };
    }
    const data = {
      name: req.body.storeName,
      userId: user.dataValues.id,
      address: req.body.address,
      postalCode: req.body.postalCode,
      districtId: req.body.district,
      cityId: req.body.city,
      provinceId: req.body.province,
      lat: latLon.lat,
      lon: latLon.lng,
    };
    const isExist = await findMainStoreService();
    if (!isExist) {
      data.isMain = true;
    }
    const result = await createStoreService(data, t);
    await t.commit();
    resTemplate(201, true, 'Success add store', null);
    return res
      .status(201)
      .json(resTemplate(201, true, 'Success add store', null));
  } catch (error) {
    await t.rollback();
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default createStore;
