import findNearestStore from '../../helper/findNearestStore';
import resTemplate from '../../helper/resTemplate';
import { findMainStoreService } from '../../services/store/store.service';

export default async function (req, res, next) {
  try {
    const lat = req.query.lat ?? null;
    const lon = req.query.lon ?? null;
    const nearest = await findNearestStore(lat, lon);
    const response = {
      rc: 200,
      success: true,
      message: '',
      result: {},
    };
    if (!nearest) {
      const mainBranch = await findMainStoreService();
      response.message = 'Out of range, nearest store set to main branch';
      mainBranch.dataValues.distance = null;
      delete mainBranch.dataValues.id;
      delete mainBranch.dataValues.userId;
      response.result = { ...mainBranch.dataValues };
    } else {
      response.message = `Nearest store set to ${nearest.name}`;
      delete nearest.id;
      delete nearest.userId;
      response.result = nearest;
    }
    return res.status(200).json(resTemplate(...Object.values(response)));
  } catch (error) {
    next(error);
  }
}
