const { mysqlConnection } = require("../../../db/config");
const response = require("../../utils/response");


async function registerRole(params) {
    try {
       const roles = [];
       params.roleId.forEach(element => {
        var item = [params.userId, element];
        roles.push(item);

       });
       
        const queryDelete = `DELETE FROM user_x_role WHERE user_id = ?`;
        const queryDeleteRsp = await mysqlConnection(queryDelete,params.userId);
        if(roles.length > 0)
        {
            const queryInsert = `INSERT INTO user_x_role (user_id, role_id) VALUES ?`;
            const queryInsertRsp = await mysqlConnection(queryInsert,[roles]);            
        }

    } catch (error) {
        response.data = null;
        response.errorMessage = error.message;
        response.message ="Error en el servicio";
        response.status = false;
        response.statusCode = 500;
    }
    return response;
}
module.exports = {registerRole};