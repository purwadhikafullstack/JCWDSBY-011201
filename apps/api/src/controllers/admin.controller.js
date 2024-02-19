import { changePasswordAdminService, deleteAdminService, getAdminDetailService, getAdminService, registerAdminService, updateAdminService } from "../services/user/admin.service";
import resTemplate from "../helper/resTemplate";
import { findAllUserService } from "../services/user/user.service";

export const getAdmin = async (req,res,next) => {
  try {
    const result = await getAdminService(req.query);
    return res.status(200).json(resTemplate(200, true, 'Get user admin success!', result));
  } catch (error) {
    next(error);
  }
};

export const getAdminDetail = async (req,res,next) => {
  try {
    const result = await getAdminDetailService(req.params.uuid);
    return res.status(200).json(resTemplate(200, true, 'Get user admin detail success!', result));
  } catch (error) {
    next(error);
  }
};

export const registerAdmin = async (req,res,next) => {
  try {
    const result = await registerAdminService(req.body);
    return res.status(201).json(resTemplate(201, true, 'Register user admin success!', result));
  } catch (error) {
    next(error);
  }
};

export const updateAdmin = async (req,res,next) => {
  try {
    await updateAdminService(req.body, req.params.uuid);
    return res.status(204).json(resTemplate(204, true, 'Update user admin success!'));
  } catch (error) {
    next(error);
  }
};

export const changePasswordAdmin = async (req,res,next) => {
  try {
    await changePasswordAdminService(req.body, req.params.uuid);
    return res.status(204).json(resTemplate(204, true, 'Change Password user admin success!'));
  } catch (error) {
    next(error);
  }
};

export const deleteAdmin = async (req,res,next) => {
  try {
    await deleteAdminService(req.params.uuid);
    return res.status(204).json(resTemplate(204, true, 'Delete user admin success!'));
  } catch (error) {
    next(error);
  }
};

export default async function getUser(req, res, next) {
  try {
    const result = await findAllUserService(req.query);
    if (result) {
      res.status(200).json(resTemplate(200, true, 'Get user account success!', result));
    }
  } catch (error) {
    next(error);
  }
}