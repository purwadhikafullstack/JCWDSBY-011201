import resTemplate from '../../helper/resTemplate';
import { getStoreDetailByUUIDService } from '../../services/store/store.service';

const getStoreDetail = async (req, res, next) => {
  try {
    const result = await getStoreDetailByUUIDService(req.params.id);
    return res
      .status(201)
      .json(resTemplate(201, true, 'Success get store detail', result));
  } catch (error) {
    return res
      .status(error.rc || 500)
      .json(resTemplate(error.rc || 500, false, error.message, null));
  }
};

export default getStoreDetail;
