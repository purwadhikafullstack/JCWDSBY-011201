import axios from 'axios';
import { BITESHIP_API_KEY, BITESHIP_API_URL } from '../../config';

export default async function (req, res, next) {
  try {
    const items = req.body.items;
    const storePostal = req.body.storePostal;
    const userPostal = req.body.userPostal;
    const result = await axios.post(
      BITESHIP_API_URL,
      {
        origin_postal_code: Number(storePostal),
        destination_postal_code: Number(userPostal),
        couriers: 'anteraja,jne,tiki',
        items: items,
      },
      {
        headers: {
          Authorization: BITESHIP_API_KEY,
        },
      },
    );
    const finalResult = result.data.pricing.map((value, idx) => {
      return {
        courier_id: value.courier_code + '_' + value.courier_service_code,
        courier_name: value.courier_name,
        courier_service: value.courier_service_name,
        duration: value.duration,
        price: value.price,
      };
    });
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Success get couriers list',
      result: finalResult,
    });
  } catch (error) {
    next(error);
  }
}
