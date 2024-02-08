import { MAX_DISTANCE } from '../config';
import { findAllStores, findOneStore } from '../controllers/store.controller';
import cities from '../models/cities.model';
import districts from '../models/districts.model';
import provinces from '../models/provinces.model';
import { findAllStoreService } from '../services/store/store.service';
import calculateDistance from './calculateDistance';

const findNearestStore = async (lat, lon) => {
  try {
    const storeData = await findAllStoreService();
    const nearest = { distance: null, data: {} };
    storeData.forEach((value, idx) => {
      const distance = calculateDistance(
        Number(lat),
        Number(lon),
        Number(value.dataValues.lat),
        Number(value.dataValues.lon),
      );
      if (distance <= MAX_DISTANCE) {
        if (idx === 0) {
          nearest.distance = distance;
          nearest.data = value.dataValues;
        } else if (nearest.distance === null || distance < nearest.distance) {
          nearest.distance = distance;
          nearest.data = value.dataValues;
        }
      }
    });
    if (nearest.distance === null) return false;
    nearest.data.distance = nearest.distance;
    return nearest.data;
  } catch (error) {
    return false;
  }
};

export default findNearestStore;
