const { mysqlConnection } = require("../../../db/config");
const response = require("../../utils/response");

async function getAllUsers()
{
    try {
        const query =`SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'id',person.id,
            'fullName',person.full_name,
            'lastName1',person.last_name_1,
            'lastName2',person.last_name_2,
            'documentType',(SELECT JSON_OBJECT('id', dc.id, 'name', dc.NAME, 'code', dc.CODE) FROM (SELECT id, name,code FROM document_type WHERE document_type.id = person.document_type_id) as dc),
            'documentNumber',person.document_number,
            'gender',(SELECT JSON_OBJECT('id', dc.id, 'name', dc.NAME) FROM (SELECT id, name,code FROM gender WHERE gender.id = 1) as dc),
            'email',person.email,
            'phoneNumber',person.phone_number,
            'company',(SELECT JSON_OBJECT('id', c.id, 'name', c.NAME) FROM (SELECT id, name FROM company WHERE company.id = 1) as c),
            'status',(SELECT JSON_OBJECT('id', s.id, 'name', s.NAME) FROM (SELECT id, name FROM status WHERE status.id = person.id) as s),
            'dateRegister',person.date_register
        )) AS jsonResponse
        FROM(
            SELECT
            person.id,
            person.full_name,
            person.last_name_1,
            person.last_name_2,
            person.document_type_id,
            person.document_number,
            person.gender_id,
            person.email,
            person.phone_number,
            person.company_id,
            person.status,
            person.date_register
        FROM
            person
        WHERE
            person.status = 1
            ) AS person
            
            `;
    
    const queryRsp = await mysqlConnection(query, null);

    response.data = queryRsp[0].jsonResponse;
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

module.exports= {getAllUsers};