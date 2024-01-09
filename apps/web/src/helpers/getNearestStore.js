import API_CALL from './API';

export default async function getNearestStore(lat = null, lon = null) {
  try {
    const result = await API_CALL.get('/utils/store/nearest', {
      params: {
        lat: lat,
        lon: lon,
      },
    });
    const payload = {
      UUID: result.data.result.UUID,
      name: result.data.result.name,
      address: result.data.result.address,
      postalCode: result.data.result.postalCode,
      district: result.data.result.district.districtName,
      city: result.data.result.city.cityName,
      province: result.data.result.province.provinceName,
      distance: result.data.result.distance,
      lat: result.data.result.lat,
      lon: result.data.result.lon,
    };
    return { message: result.data.message, payload };
  } catch (error) {
    return false;
  }
}
