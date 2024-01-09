import { findAllEvent } from '../../controllers/event.controller';

export default async function (req, res, next) {
  try {
    const result = await findAllEvent({
      attributes: ['name', 'image', 'url'],
    });
    return res.status(200).json({
      rc: 200,
      success: true,
      message: 'Success get all event',
      result: result,
    });
  } catch (error) {
    next(error);
  }
}
