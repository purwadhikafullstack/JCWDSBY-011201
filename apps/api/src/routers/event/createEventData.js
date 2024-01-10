import { createEvent } from '../../controllers/event.controller';

export default async function (req, res, next) {
  try {
    const data = {
      name: req.body.eventName,
      image: req.file.filename,
      url: req.body.url ?? null,
    };
    const result = await createEvent(data);
    return res.status(201).json({
      rc: 201,
      success: true,
      message: 'Success create event',
      result: null,
    });
  } catch (error) {
    next(error);
  }
}
