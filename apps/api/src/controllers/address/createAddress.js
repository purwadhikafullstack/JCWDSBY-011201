import { nanoid } from 'nanoid';
import { DB } from '../../db';
import geocode from '../../helper/geocode';
import resTemplate from '../../helper/resTemplate';
import {
  createUserAddressService,
  findDefaultUserAddressService,
  findOneCityService,
  findOneDistrictService,
  findOneProvinceService,
} from '../../services/address/address.service';
import { validationResult } from 'express-validator';

const createAddress = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw { rc: 400, message: 'Invalid request' };
    const district = await findOneDistrictService(req.body.district);
    const city = await findOneCityService(req.body.city);
    const province = await findOneProvinceService(req.body.province);
    const latLon = await geocode(
      district.dataValues.districtName,
      city.dataValues.cityName,
      province.dataValues.provinceName,
    );
    if (!latLon) {
      throw { rc: 404, message: 'Address not found' };
    }
    const data = {
      UUID: nanoid(),
      address: req.body.address,
      districtId: req.body.district,
      cityId: req.body.city,
      provinceId: req.body.province,
      postalCode: req.body.postalCode,
      lat: latLon.lat,
      lon: latLon.lng,
      userId: req.tokenData.id,
    };
    const isExist = await findDefaultUserAddressService(req.tokenData.id);
    if (!isExist) {
      data.isDefault = true;
    }
    const result = await createUserAddressService(data, t);
    await t.commit();
    return res
      .status(201)
      .json(resTemplate(201, true, 'Success add address', null));
  } catch (error) {
    await t.rollback();
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default createAddress;
