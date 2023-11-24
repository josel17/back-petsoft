
const jwt = require('jsonwebtoken');
const response = require('../utils/response');
const { error } = require('ajv/dist/vocabularies/applicator/dependencies');
const cryptoTools = require('../utils/crypto-tools');

const generarJWT = async (data) =>
{
    return new Promise((resolve,reject) =>
    {
        const payload = ({data});
        jwt.sign(payload, process.env.SECRET_JWT_SEED,{
            expiresIn:'24h',
        }, (err, token) => {
            if(!err)
            {
                response.data = token;
                response.errorMessage = "";
                response.message ="Ok";
                response.status = true;
                response.statusCode = 200;
                resolve(response);
            }else{
               response.data = null;
               response.errorMessage = err;
               response.message ="Error en el servicio";
               response.status = false;
               response.statusCode = 500;
               reject(response);
            }
        })
    });
    
}

const verify = async (req, res, next) =>
{
   
    return new Promise((resolve,reject) =>
    {
            const bearerHeader = req.headers['authorization'];
            if(typeof bearerHeader !== 'undefined')
            {
                const bearerToken = bearerHeader.split(" ")[1];
                req.token = bearerToken;
        
                 jwt.verify(req.token,  process.env.SECRET_JWT_SEED,(error,data) =>
                {
                    if(error)
                    {
                       reject ({statusCode:200,status:false, data: null, message:'El token no es valido'});
                    }else{              
                        const dataToken = cryptoTools.decryptText({bodyData:data.data});
                        resolve ({statusCode:200,status:true, data: dataToken, message:'El token es valido'});
                    }
                })
            }else{
                reject ({statusCode:400, status:false, data: null, message:'No se encontro un token valido'});;
            }  
        }).catch((error) =>
        {
            return ({statusCode:403,status:false, data: null, message:'El token no es valido'});
        });
        
   
}

module.exports = {generarJWT, verify}