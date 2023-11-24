const { mysqlConnection } = require("../../../db/config");
const response = require("../../utils/response");

async function validate(params) {
    try {
        const query = `SELECT JSON_OBJECT
        (
            'id',person.id,
            'full_name',person.full_name,
            'last_name_1',person.last_name_1,
            'last_name_2',person.last_name_2,
            'document_type',(JSON_OBJECT('id',person.document_type_id, 'code',person.docTypeCode, 'name', person.dpcTypeName)),
            'document_number',person.document_number,
            'gender',(JSON_OBJECT('id',person.gender_id,'code',person.genderCode, 'name', person.genderName)),
            'email',person.email,
            'company',(JSON_OBJECT('id',person.company_id,'name',person.companyName))
        ) as jsonResponse
        FROM(
        SELECT
            person.id,
            full_name,
            last_name_1,
            last_name_2,
            document_type_id,
            document_type.code AS docTypeCode,
            document_type.name AS dpcTypeName,
            document_number,
            gender_id,
            gender.code AS genderCode,
            gender.name AS genderName,
            email,
            company_id,
            company.name AS companyName,
            person.STATUS 
        FROM
            person
            JOIN document_type ON document_type.id = person.document_type_id
            JOIN gender ON gender.id = person.gender_id
            JOIN company ON company.id = person.company_id 
        WHERE
            document_number = ?
            LIMIT 1) as person`;
        const queryRsp =await mysqlConnection(query,params.documentNumber);

        response.data = queryRsp;
        response.errorMessage ="";
        response.message ="";
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
module.exports = {validate}