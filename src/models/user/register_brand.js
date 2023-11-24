const { mysqlConnection } = require("../../../db/config");
const response = require("../../utils/response");


async function registerBrand(params) {
    try {
       const brands = [];
       params.brandsId.forEach(element => {
        var item = [params.userId, element];
        brands.push(item);

       });
       
        const queryDelete = `DELETE FROM user_brand WHERE user_id = ?`;
        const queryDeleteRsp = await mysqlConnection(queryDelete,params.userId);
       if(brands.length > 0)
       {
           const queryInsert = `INSERT INTO user_brand (user_id, brand_id) VALUES ?`;
           const queryInsertRsp = await mysqlConnection(queryInsert,[brands]);
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
module.exports = {registerBrand};