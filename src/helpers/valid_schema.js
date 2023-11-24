

const fs = require('fs');

const Ajv = require('ajv');
const apply = require('ajv-formats-draft2019');
const response = require('../utils/response');
const ajv = new Ajv({allErrors: true})
require("ajv-errors")(ajv /*, {singleError: true} */)
apply(ajv); // returns ajv instance, allowing chaining


function validateData(data, schema) 
{
    
    const rutaActual = process.cwd();
    //const rutaAbsoluta = path.resolve(rutaActual)
    
    var schema 			= JSON.parse(fs.readFileSync(rutaActual+"/src/schemas/"+schema+".json", 'utf8'));
    const validate = ajv.compile(schema)

    const valid = validate(data);

    response.data = null;
    response.message ="Error en los datos de entrada";
    response.errorMessage =ajv.errorsText(validate.errors);
    response.status = valid;
    response.statusCode = 400;
    return response;

}
module.exports = {validateData}