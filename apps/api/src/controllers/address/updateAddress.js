import { DB } from '../../db';
import geocode from '../../helper/geocode';
import resTemplate from '../../helper/resTemplate';
import {
  findOneCityService,
  findOneDistrictService,
  findOneProvinceService,
  updateUserAddressService,
} from '../../services/address/address.service';

const updateAddress = async (req, res, next) => {
  await DB.initialize();
  const t = await DB.db.sequelize.transaction();
  try {
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
      address: req.body.address,
      districtId: req.body.district,
      cityId: req.body.city,
      provinceId: req.body.province,
      postalCode: req.body.postalCode,
      lat: latLon.lat,
      lon: latLon.lng,
    };
    const result = await updateUserAddressService(data, req.params.id, t);
    if (!result[0]) {
      throw { rc: 404, message: 'Address not found' };
    }
    await t.commit();
    return res
      .status(201)
      .json(resTemplate(201, true, 'Success edit address', null));
  } catch (error) {
    await t.rollback();
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default updateAddress;
