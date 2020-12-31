var express = require('express');
var router = express.Router();
const { getDirectory } = require('./secured/getDirectory');
const { userAuthentication } = require('./open-service/user-authentication');
const { createDirectory } = require('./secured/createDirectory');
const { removeItem } = require('./secured/removeItem');

router.get('/getDirectory',getDirectory ); // POSTA ÇEVİR
router.post('/userAuthentication', userAuthentication );

router.get('/createDirectory',createDirectory);
router.get('/removeItem',removeItem);
module.exports = router;