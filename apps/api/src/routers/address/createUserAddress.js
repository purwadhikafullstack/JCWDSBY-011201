import {
  createUserAddress,
  findOneUserAddress,
} from '../../controllers/address.controller';
import { findOneCity } from '../../controllers/city.controller';
import { findOneDistrict } from '../../controllers/district.controller';
import { findOneProvince } from '../../controllers/province.controller';
import { DB } from '../../db';
import geocode from '../../helper/geocode';
import { nanoid } from 'nanoid';

export default async function (req, res, next) {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
    const district = await findOneDistrict({ id: req.body.district });
    const city = await findOneCity({ id: req.body.city });
    const province = await findOneProvince({ id: req.body.province });
    const latLon = await geocode(
      district.dataValues.districtName,
      city.dataValues.cityName,
      province.dataValues.provinceName,
    );
    if (!latLon) {
      throw { rc: 404, message: 'Address not found' };
    }
    const data = {
      UUID: nanoid(40),
      address: req.body.address,
      districtId: req.body.district,
      cityId: req.body.city,
      provinceId: req.body.province,
      postalCode: req.body.postalCode,
      lat: latLon.lat,
      lon: latLon.lng,
      userId: req.tokenData.id,
    };
    const isExist = await findOneUserAddress({
      where: {
        userId: req.tokenData.id,
        isDefault: true,
      },
    });
    if (!isExist) {
      data.isDefault = true;
    }
    const result = await createUserAddress(data, { transaction: t });
    await t.commit();
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Success add address',
      result: null,
    });
  } catch (error) {
    await t.rollback();
    return res.status(error.rc || 500).json({
      rc: error.rc || 500,
      success: false,
      message: error.message,
      result: null,
    });
  }
}
