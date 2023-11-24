const { mysqlConnection } = require("../../../db/config");
const response = require("../../utils/response");
const moment = require('moment-timezone');

async function activate(params) {
    try {
        //const params = Object.values(params);

        const query = `INSERT INTO user (id,user_id,password, need_change_password, date_register,status) VALUES (?,?,?,?,?,?) 
        ON DUPLICATE KEY UPDATE user_id=${params.userId},password="${params.password}", need_change_password=${params.needChangePassword},status=${params.status}`;
        const queryRsp = await mysqlConnection(query,[params.id,params.userId, params.password, params.needChangePassword,moment().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss"),params.status]);

        response.data = {"userActivateId":queryRsp.affectedRows == 1 ? queryRsp.insertId : params.id};
        response.errorMessage = "";
        response.message = queryRsp.affectedRows ==1 ? "Usuario activado correctamente.":"Usuario actualizado correctamente.";
        response.status = true;
        response.statusCode = 200;

    } catch (error) {
        response.data = null;
        response.errorMessage = error.message;
        response.message ="Error en el servicio";
        response.status = false;
        response.statusCode = 500;
    }
    return response;
}
module.exports = {activate};