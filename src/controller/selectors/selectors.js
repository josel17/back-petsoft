const { response } = require("express");
const responseObj = require("../../utils/response");
const cryptoTools = require("../../utils/crypto-tools");
const {loadDocumentType} = require('../../models/selectors/selectors');

const selectors = async(req, res = response) =>
{
    try {
        const dataStart =[];
        
        const data = await loadDocumentType();
        

        responseObj.data = data.data[0].jsonResponse;
        responseObj.errorMessage ="";
        responseObj.message ="Ok";
        responseObj.status= true;
        responseObj.statusCode = 200;  

    } catch (error) {
        responseObj.data = null;
        responseObj.errorMessage =error.message;
        responseObj.message ="Error en el servicio";
        responseObj.status= false;
        responseObj.statusCode = 500;  
    }
    const crypto = cryptoTools.encryptText(responseObj);
    return res.status(responseObj.statusCode).json(crypto);
}

module.exports ={
    selectors
}