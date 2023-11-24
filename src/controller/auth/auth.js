import response from "express";
import { decryptText } from "../../utils/crypto-tools";
import { validateData } from "../../helpers/valid_schema";
import { generarJWT, verify } from "../../helpers/generarJWT";
import { loginValidate } from "../../models/auth/validate_login";
import { increment } from "../../models/auth/increment_attemps";
import cryptoTools from "../../utils/crypto-tools";
import bcrypt from "bcryptjs";
const responseObj = require("../../utils/response");

const login = async (req, res = response) => {
  try {
    const params = decryptText(req.body);

    const validate = 
    const valid = validateData(params, "login");

    if (valid.status) {
      const dataUser = await loginValidate(params);
      if (dataUser.status) {
        if (dataUser.data.length > 0) {
          const dataLogin = dataUser.data[0].jsonResponse;
          const loginRsp = await validateDataUser(dataLogin, params);

          responseObj.data = loginRsp.data;
          responseObj.errorMessage = dataUser.errorMessage;
          responseObj.message = dataUser.message;
          responseObj.status = dataUser.status;
          responseObj.statusCode = loginRsp.statusCode;
        } else {
          responseObj.data = null;
          responseObj.errorMessage = "Usuario o contraseña incorrectos";
          responseObj.message = "Error de autenticación";
          responseObj.status = dataUser.status;
          responseObj.statusCode = 401;
        }
      } else {
        responseObj.data = null;
        responseObj.errorMessage = dataUser.errorMessage;
        responseObj.message = dataUser.message;
        responseObj.status = dataUser.status;
        responseObj.statusCode = 500;
      }
    } else {
      responseObj.data = null;
      responseObj.errorMessage = valid.errorMessage;
      responseObj.message = valid.message;
      responseObj.status = valid.status;
      responseObj.statusCode = valid.statusCode;
    }
  } catch (error) {
    responseObj.data = null;
    responseObj.errorMessage = error.message;
    responseObj.message = "Error en el servicio";
    responseObj.status = false;
    responseObj.statusCode = 500;
  }
  const crypto = cryptoTools.encryptText(responseObj);
  return res.status(responseObj.statusCode).json(crypto);
};

const verifyToken = async (req, res) => {
  const verifyToken = await verify(req);

  responseObj.data = verifyToken.data;
  responseObj.errorMessage = "";
  responseObj.message = verifyToken.message;
  responseObj.status = verifyToken.status;

  const responsedata = cryptoTools.encryptText(responseObj);

  return res.status(verifyToken.statusCode).json(responsedata);
};

async function validateDataUser(userData, params) {
  try {
    if (userData != null) {
      if (userData.user == null) {
        responseObj.data = null;
        responseObj.errorMessage =
          "Este usuario no se encuentra activo, contacte al administrador";
        responseObj.message = "Error de autenticación";
        responseObj.status = true;
        responseObj.statusCode = 401;
      }

      if (userData.user.attemps_login == 3) {
        responseObj.data = null;
        responseObj.errorMessage =
          "El usuario se encuentra bloqueado por itentos fallidos, contacte al administrador";
        responseObj.message = "Error de autenticación";
        responseObj.status = true;
        responseObj.statusCode = 401;
      } else {
        const passwordCompare = bcrypt.compareSync(
          params.password,
          userData.user.password
        );
        if (!passwordCompare) {
          const incrementAtt = await increment(
            userData.user.attemps_login + 1,
            userData.user_id
          );
          if (incrementAtt.status) {
            responseObj.data = null;
            responseObj.errorMessage =
              2 - userData.user.attemps_login == 0
                ? "El usuario se ha bloqueado por intenteos fallidos, contacte al administrador"
                : `Usuario y/o contraseña incorrectos, te quedan ${
                    2 - userData.user.attemps_login
                  } intentos antes de que se bloquee el usuario`;
            responseObj.message = "Error de autenticación";
            responseObj.status = true;
            responseObj.statusCode = 401;
          } else {
            responseObj.data = incrementAtt.data;
            responseObj.errorMessage = incrementAtt.errorMessage;
            responseObj.message = incrementAtt.message;
            responseObj.status = incrementAtt.status;
            responseObj.statusCode = incrementAtt.statusCode;
          }
        } else {
          const incrementAtt = await increment(0, userData.user_id);
          if (userData.company.brand == null) {
            responseObj.data = null;
            responseObj.errorMessage =
              "El usuario no tiene sedes asignadas, contacte al administrador";
            responseObj.message = "Error de autenticación";
            responseObj.status = true;
            responseObj.statusCode = 403;
          } else {
            const user = {
              role: userData.role,
              email: userData.email,
              user_id: userData.user_id,
              full_name: userData.full_name,
              last_name_1: userData.last_name_1,
              last_name_2: userData.last_name_2,
              sencond_name: userData.sencond_name,
              document_number: userData.document_number,
              menu: userData.section,
            };
            const payload = {
              user: user,
              company: userData.company,
            };
            const data = cryptoTools.encryptText(payload);
            const token = await generarJWT(data);

            const dataResponse = {
              token: token.data,
              user: user,
              menu: userData.menu,
            };
            responseObj.data = dataResponse;
            responseObj.errorMessage = token.errorMessage;
            responseObj.message = token.message;
            responseObj.status = token.status;
            responseObj.statusCode = token.statusCode;
          }
        }
      }
    } else {
      responseObj.data = null;
      responseObj.errorMessage = "Usuario y/o contraseña inocrrectos";
      responseObj.message = "Error de autenticación";
      responseObj.status = true;
      responseObj.statusCode = 401;
    }
  } catch (error) {
    responseObj.data = null;
    responseObj.errorMessage = error.message;
    responseObj.message = "Error en el servicio";
    responseObj.status = false;
    responseObj.statusCode = 500;
  }

  return responseObj;
}

module.exports = {
  login,
  verifyToken,
};
