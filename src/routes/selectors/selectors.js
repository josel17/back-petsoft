const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../../middleware/validate-fields');
const {selectors} = require('../../controller/selectors/selectors');

const router = Router();

//selector document type
router.get('/documentType',selectors);