const { mysqlConnection } = require("../../../db/config");
const response = require("../../utils/response");

async function disableUserbyId(user)
{
    try {
        const query =`UPDATE person SET status = 0 WHERE id = ?`;
        
        const queryRsp = await mysqlConnection(query, user.id);

        response.data = null;
        response.errorMessage ="";
        response.message ="Usuario desactivado";
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

module.exports= {disableUserbyId};