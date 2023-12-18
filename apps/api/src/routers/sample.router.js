import { Router } from 'express';
import uploader from '../helper/uploader';
import {
  createSampleData,
  getSampleData,
  uploadSampleData,
} from '../controllers/sample.controller';

const sampleRouter = Router();

// GET
sampleRouter.get('/', async (req, res) => {
  const result = await getSampleData();
  res.status(200).json(result);
});

// POST
sampleRouter.post('/', async (req, res) => {
  await createSampleData();
  res.send('Create Sample Data');
});

sampleRouter.post('/upload', uploader('/samples').array('sampleUpload', 2) ,async (req, res) => {
  const bulkImg = [];

  if (req.files) {
    req.files.forEach((file) => {
      bulkImg.push({name: file.filename});
    });
  }

  const result = await uploadSampleData(bulkImg);
  if(result){
    res.status(200).json(result);
  }
});

export { sampleRouter };
