const router = require('express').Router();

const baseApi = '/api/v1';

router.use('/', require('./ping'));
router.use(baseApi, require('./docs'));
router.use(baseApi, require('./auth'));
router.use(baseApi, require('./users'));
module.exports = router;
