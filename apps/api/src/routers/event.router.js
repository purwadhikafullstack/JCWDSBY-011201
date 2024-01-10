import { Router } from 'express';
import createEventData from './event/createEventData';
import getAllEventData from './event/getAllEventData';
import uploader from '../helper/uploader';

const eventRouter = Router();

eventRouter.get('/', getAllEventData);
eventRouter.post(
  '/',
  uploader('/event', 1).single('eventUpload'),
  createEventData,
);

export { eventRouter };
