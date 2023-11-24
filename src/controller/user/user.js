const bcrypt = require("bcryptjs");
const response = require("express");
const { decryptText, encryptText } = require("../../utils/crypto-tools");
const responseObj = require("../../utils/response");
const { registerUser } = require("../../models/user/register");
const { validate } = require("../../models/user/validate");
const cryptoTools = require("../../utils/crypto-tools");
const { activate } = require("../../models/user/activate");
const { validateData } = require("../../helpers/valid_schema");
const { registerRole } = require("../../models/user/register_role");
const { registerBrand } = require("../../models/user/register_brand");
const { disableUserbyId } = require("../../models/user/disable");

const registerPerson = async (req, res = response) => {
  const params = decryptText(req.body);

  const validateRsp = validateData(params, "register_user");
  if (validateRsp.status) {
    const validateUser = await validate(params);
    if (validateUser.status) {
      if (validateUser.data.length > 0 && params.id == 0) {
        responseObj.data = null;
        responseObj.errorMessage = validateUser.errorMessage;
        responseObj.message =
          "Ya se encuentra un usuario registrado con este número de documento";
        responseObj.status = validateUser.status;
        responseObj.statusCode = validateUser.statusCode;
      } else {
        const saveRsp = await registerUser(params);

        responseObj.data = saveRsp.data[0];
        responseObj.errorMessage = saveRsp.errorMessage;
        responseObj.message = saveRsp.message;
        responseObj.status = saveRsp.status;
        responseObj.statusCode = saveRsp.statusCode;
      }
    } else {
      responseObj.data = null;
      responseObj.errorMessage = validateUser.errorMessage;
      responseObj.message = validateUser.message;
      responseObj.status = validateUser.status;
      responseObj.statusCode = validateUser.statusCode;
    }
  } else {
    responseObj.data = null;
    responseObj.errorMessage = validateRsp.errorMessage;
    responseObj.message = validateRsp.message;
    responseObj.status = validateRsp.status;
    responseObj.statusCode = validateRsp.statusCode;
  }

  const encryptRsp = cryptoTools.encryptText(responseObj);
  // const encryptRsp = encryptText(responseObj);
  return res.status(responseObj.statusCode).json(encryptRsp);
};

const activeUser = async (req, res = response) => {
  try {
    const params = decryptText(req.body);

    const validateRsp = validateData(params, "active_user");

    if (validateRsp.status) {
      const salt = bcrypt.genSaltSync();
      params.password = bcrypt.hashSync(params.password, salt);

      const activateRsp = await activate(params);
      const assignRole = await registerRole({
        userId: activateRsp.data.userActivateId,
        roleId: params.roles,
      });
      const assignBrands = await registerBrand({
        userId: activateRsp.data.userActivateId,
        brandsId: params.brands,
      });
      responseObj.data = activateRsp.data;
      responseObj.errorMessage = activateRsp.errorMessage;
      responseObj.message = activateRsp.message;
      responseObj.status = activateRsp.status;
      responseObj.statusCode = activateRsp.statusCode;
    } else {
      responseObj.data = validateRsp.data;
      responseObj.errorMessage = validateRsp.errorMessage;
      responseObj.message = validateRsp.message;
      responseObj.status = validateRsp.status;
      responseObj.statusCode = validateRsp.statusCode;
    }
  } catch (error) {
    responseObj.data = null;
    responseObj.errorMessage = error.message;
    responseObj.message = "Error en el servicio";
    responseObj.status = false;
    responseObj.statusCode = 500;
  }

  const encryptRsp = encryptText(responseObj);
  return res.status(responseObj.statusCode).json(encryptRsp);
};

const disableUser = async (req, res = response) => {
  try {
    const params = decryptText(req.body);
    const disableRsp = await disableUserbyId(params);

    responseObj.data = disableRsp.data;
    responseObj.errorMessage = disableRsp.errorMessage;
    responseObj.message = disableRsp.message;
    responseObj.status = disableRsp.status;
    responseObj.statusCode = disableRsp.statusCode;
  } catch (error) {
    responseObj.data = null;
    responseObj.errorMessage = error.message;
    responseObj.message = "Error en el servicio";
    responseObj.status = false;
    responseObj.statusCode = 500;
  }
  const encryptRsp = encryptText(responseObj);
  return res.status(responseObj.statusCode).json(encryptRsp);
};

module.exports = {
  registerPerson,
  activeUser,
  disableUser,
};
