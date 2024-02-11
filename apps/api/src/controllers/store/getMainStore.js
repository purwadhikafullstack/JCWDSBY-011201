import resTemplate from '../../helper/resTemplate';
import { findMainStoreService } from '../../services/store/store.service';

const getMainStore = async (req, res, next) => {
  try {
    const result = await findMainStoreService();
    return res
      .status(200)
      .json(resTemplate(200, true, 'Success get main store', result));
  } catch (error) {
    next(error);
  }
};

export default getMainStore;
