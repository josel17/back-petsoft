const { Router } = require('express');
const { registerUser, encrypt, decrypt } = require('../controller/cryptography/cryptography');

const router = Router();


//login de usuario
router.post('/encrypt',encrypt);
router.post('/decrypt',decrypt);



module.exports = router;