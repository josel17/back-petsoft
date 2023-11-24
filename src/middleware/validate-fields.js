import { response } from "express";
import { validationResult } from "express-validator";

const validateFields = (req, res = response, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      data: errors.mapped(),
      message: "Error en los parametros de entrada",
      statuscode: "1x01",
    });
  }
  next();
};

export default {
  validateFields,
};
