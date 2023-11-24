const { mysqlConnection } = require("../../../db/config");
const response = require("../../utils/response");

async function loginValidate(params) {
    try {
        const query = `SELECT
        JSON_OBJECT (
            'user_id', person.user_id,
            'full_name',person.full_name,
            'last_name_1',person.last_name_1,
            'last_name_2',person.last_name_2,
            'document_number',person.document_number,
            'email',person.email,
            'company',( JSON_OBJECT( 'id',person.company_id,  'name', person.companyName, 'brand',(SELECT JSON_ARRAYAGG(JSON_OBJECT('id', brand.id, 'brand', brand.NAME ))
																FROM(SELECT brand.id, brand.name 
																		FROM brand 
																		JOIN user_brand ON user_brand.brand_id = brand.id AND user_brand.user_id = person.user_id
																) AS brand 
															))),
					'user',(SELECT JSON_OBJECT( 'need_change_password', user.need_change_password, 'attemps_login', user.attemps_login, 'status', user.status, 'password',user.password ) AS res 
									FROM (SELECT need_change_password, attemps_login, password, status 
												FROM user 
												WHERE user_id = person.user_id ) AS user ),
          'role',(SELECT JSON_ARRAYAGG(JSON_OBJECT( 'id', role.id, 'name', role.NAME )) 
									FROM (SELECT role.id, role.name
												FROM role
												JOIN user_x_role ON user_x_role.role_id = role.id AND user_x_role.role_id = person.user_id 
												) AS role ),
					'section',(
								SELECT JSON_ARRAYAGG(JSON_OBJECT('title',section.title,'label',section.label,'url',section.url,'icon',section.icon)) 
								FROM (SELECT DISTINCT title, label, url, icon 
												FROM sections
												JOIN section_x_role ON section_x_role.section_id = sections.id
												JOIN user_x_role ON user_x_role.role_id = section_x_role.role_id
												JOIN user ON user.id = user_x_role.user_id
											WHERE user.user_id = person.user_id	
											UNION 
											SELECT DISTINCT title, label, url, icon 
												FROM sections
												JOIN section_x_user ON section_x_user.section_id = sections.id
												JOIN user ON user.id = section_x_user.user_id
												WHERE user.user_id = person.user_id	
												
										) AS section)
                             
            ) AS jsonResponse 
        FROM
            (
            SELECT
                person.id AS user_id,
                full_name,
                last_name_1,
                last_name_2,
                document_number,
                email,
                company_id,
                company.NAME AS companyName,
                user.need_change_password,
                user.attemps_login,
                user.status AS user_status,
                person.STATUS 
            FROM
                person
                LEFT JOIN user ON user.user_id = person.id
                JOIN company ON company.id = person.company_id 
            WHERE
                document_number = ?
            LIMIT 1 
        ) AS person`;
            
        const queryRsp = await mysqlConnection(query,[params.username, params.password]);
        response.data = queryRsp;
        response.errorMessage = "";
        response.message = "";
        response.status = true;
        response.statusCode = 200;
    } catch (error) {
        response.data = null;
        response.errorMessage = error.message;
        response.message = "Error en el servicio";
        response.status = false;
        response.statusCode = 500;
    }
    return response;
}
module.exports = {loginValidate}