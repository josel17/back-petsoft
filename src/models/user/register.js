const { mysqlConnection } = require("../../../db/config");
const response = require("../../utils/response");

async function registerUser(params) {
    try {
        //const data = Object.values(params);
        const data = [
            params.id ==''?0:0,
            params.fullName,
            params.lastName1,
            params.lastName2,
            params.documentTypeId,
            params.documentNumber,
            params.genderId,
            params.email,
            params.phoneNumber,
            params.companyId,
            params.status
        ]
        const query = `INSERT INTO person(id, full_name, last_name_1, last_name_2, document_type_id, document_number, gender_id, email, phone_number, company_id, status) VALUES (?) 
        ON DUPLICATE KEY UPDATE full_name="${params.fullName}", last_name_1="${params.lastName1}", last_name_2="${params.lastName2}", document_type_id=${params.documentTypeId}, document_number="${params.documentNumber}", gender_id=${params.genderId}, email="${params.email}", phone_number = "${params.phoneNumber}}",company_id=${params.companyId}, status=${params.status}`;
        const queryrsp =await mysqlConnection(query,[data]);

        response.data ={ "userId":queryrsp.affectedRows == 1&& queryrsp.insertId != 0 ? queryrsp.insertId: params.id};
        response.errorMessage = "";
        response.message = queryrsp.affectedRows == 1 && queryrsp.insertId != 0? "Se ha creado el usuario correctamente": "Se ha actualizado el usuario correctamente";
        response.status = true;
        response.statusCode = 200;

    } catch (error) {
        response.data = null;
        response.errorMessage = error.message;
        response.message = "Error en el servicio";
        response.status = true;
        response.statusCode = 500;
    }
    return response;
}
module.exports = {registerUser}

