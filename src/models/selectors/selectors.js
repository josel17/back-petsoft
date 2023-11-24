const {mysqlConnection} = require('../../../db/config');
const response = require("../../utils/response");

async function loadDocumentType()
{
    try {
        const query = `SELECT
        JSON_OBJECT(
            'documentType',
        (SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT( 'id', dt.id, 'name', dt.NAME, 'code', dt.CODE ))
            FROM
            ( SELECT id, NAME, CODE FROM document_type WHERE status = 1 ) AS dt 
        ),
        'gender',
        (SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT( 'id', g.id, 'name', g.NAME, 'code', g.CODE ))
            FROM
            ( SELECT id, NAME, CODE FROM gender WHERE status = 1 ) AS g 
        ),
        'company',
        (SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT( 'id', c.id, 'name', c.name))
            FROM
            ( SELECT id, NAME FROM company WHERE status = 1 ) AS c
        ),
        'status',
        (SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT( 'id', s.id, 'name', s.name))
            FROM
            ( SELECT id, NAME FROM status WHERE status = 1 ) AS s
        )) as jsonResponse`
        const queryRsp = await mysqlConnection(query, null )
       
        response.data = queryRsp;
        response.errorMessage = "";
        response.message = "";
        response.status = true;
        response.statusCode = 200;
        
    } catch (error) {
       throw(error)
    }
    return response;
}

module.exports ={loadDocumentType};