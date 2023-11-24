const { response } = require("express");
const {getAllUsers} = require('../../models/user/get_all');
const {decryptText,encryptText} = require('../../utils/crypto-tools');

const getAll = async (req, res = response) =>
{
    const allUsers = await getAllUsers();
    const encryptRsp = encryptText(allUsers);

    return res.status(allUsers.statusCode).json(encryptRsp);
}

module.exports = {getAll};