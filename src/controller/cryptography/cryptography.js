const response = require('express');
const responseBody = require("../../utils/response");
const cryptoTools = require("../../utils/crypto-tools");

const encrypt = (req, res = response) =>{
    cryptoTools.setParams("AES256",process.env.KEY, process.env.IV);
    console.log(req.body);
    
    const dataEncrypt = cryptoTools.encryptText(req.body);
    responseBody.data = dataEncrypt;
    responseBody.errorMessage ="";
    responseBody.message="";
    responseBody.status = true;
    responseBody.statusCode = "Ok";
   

    return res.status(200).json(dataEncrypt);
}

const decrypt = (req, res = response) =>{
    try {
        
        const dataDecrypted = cryptoTools.decryptText(req.body);

        return res.status(200).json(dataDecrypted);
    } catch (error) {
        responseBody.data = null;
        responseBody.errorMessage =error;
        responseBody.message="Error en el servicio";
        responseBody.status = false;
        return res.status(500).json(responseBody);
        
    }
}

module.exports = {
    encrypt,
    decrypt
}