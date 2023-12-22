import jwt from 'jsonwebtoken';
import { SCRT_KEY } from '../config';

export const validateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw { rc: 401, message: 'Missing token' };
    }
    const tokenData = jwt.verify(token, SCRT_KEY);
    req.tokenData = tokenData;
    return next();
  } catch (error) {
    console.log(error.message);
    return res.status(error.rc || 500).json({
      success: false,
      message: error.message,
      result: null,
    });
  }
};

export const validateUser = (req, res, next) => {
  try {
    if (req.tokenData.role === 'user') {
      return next();
    } else {
      throw { rc: 403, message: 'Forbidden action' };
    }
  } catch (error) {
    console.log(error.message);
    return res.status(error.rc || 500).json({
      success: false,
      message: error.message,
      result: null,
    });
  }
};

export const validateAdmin = (req, res, next) => {
  try {
    if (req.tokenData.role === 'admin' || req.tokenData.role === 'super') {
      return next();
    } else {
      throw { rc: 403, message: 'Forbidden action' };
    }
  } catch (error) {
    console.log(error.message);
    return res.status(error.rc || 500).json({
      success: false,
      message: error.message,
      result: null,
    });
  }
};

export const validateAdminOnly = (req, res, next) => {
  try {
    if (req.tokenData.role === 'admin') {
      return next();
    } else {
      throw { rc: 403, message: 'Forbidden action' };
    }
  } catch (error) {
    console.log(error.message);
    return res.status(error.rc || 500).json({
      success: false,
      message: error.message,
      result: null,
    });
  }
};

export const validateSuper = (req, res, next) => {
  try {
    if (req.tokenData.role === 'super') {
      return next();
    } else {
      throw { rc: 403, message: 'Forbidden action' };
    }
  } catch (error) {
    console.log(error.message);
    return res.status(error.rc || 500).json({
      success: false,
      message: error.message,
      result: null,
    });
  }
};
