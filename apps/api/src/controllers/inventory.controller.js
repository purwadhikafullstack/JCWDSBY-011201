import resTemplate from "../helper/resTemplate";
import { getInventoryDetailService, getInventoryService } from "../services/inventory/getInventory.service";
import { createInventoryService, deleteInventoryService, updateInventoryService } from "../services/inventory/inventory.service";
import jwt from 'jsonwebtoken'

export const getInventory = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if(token) {
      const decodedToken = jwt.decode(token);
      if(decodedToken?.storeUUID) req.query.store = decodedToken.storeUUID;
    }
    const result = await getInventoryService(req.query);
    return res.status(200).json(resTemplate(200, true, 'Get Inventory Success', result));
  } catch (error) {
    next(error);
  }
};

export const getInventoryDetail = async (req, res, next) => {
  try {
    const result = await getInventoryDetailService(req.params.name, req.query);
    return res.status(200).json(resTemplate(200, true, 'Get Inventory Detail Success', result));
  } catch (error) {
    next(error);
  }
};

export const createInventory = async (req, res, next) => {
  try {
    const result = await createInventoryService(req.body, req.tokenData);
    return res.status(201).json(resTemplate(201, true, 'Create Inventory Success', result));
  } catch (error) {
    next(error);
  }
};

export const updateInventory = async (req, res, next) => {
  try {
    const result = await updateInventoryService(req.params.id, req.body, req.tokenData);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteInventory = async (req,res,next) => {
  try {
    await deleteInventoryService(req.params.id, req.tokenData);
    return res.status(204).json(resTemplate(204, true, 'Delete Inventory Success'));
  } catch (error) {
    next(error);
  }
};