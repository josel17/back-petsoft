const { mysqlConnection } = require("../../../db/config");
const response = require("../../utils/response");

async function increment(attemps, user) 
{
    try 
    {
        const query = `UPDATE credentials SET attemps_login = ? WHERE user_id = ?`;
        const queryRsp = await mysqlConnection(query, [attemps,user]);
        response.status = true;
    }
     catch (error) {
        response.data = null;
        response.errorMessage = error.message;
        response.message = "Error en el servicio";
        response.status = false;
        response.statusCode = 500;
    }
    return response;
}
module.exports = {increment}