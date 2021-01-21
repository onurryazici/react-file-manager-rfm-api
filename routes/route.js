var express = require('express');
var router = express.Router();
const { getDirectory } = require('./secured/getDirectory');
const { userAuthentication } = require('./open-service/user-authentication');
const { createDirectory } = require('./secured/createDirectory');
const { removeItem } = require('./secured/removeItem');
const { renameItem } = require('./secured/renameItem');
const { shareItem } = require('./secured/shareItem');
const { removePermission } = require('./secured/removePermission');
const { moveItem } = require('./secured/moveItem');
const { createCopy } = require('./secured/createCopy');

router.get('/getDirectory',getDirectory ); // POSTA ÇEVİR
router.post('/userAuthentication', userAuthentication );

router.get('/createDirectory',createDirectory);
router.get('/removeItem',removeItem);
router.get('/renameItem',renameItem);
router.get('/shareItem',shareItem);
router.get('/removePermission', removePermission);
router.get('/moveItem',moveItem);
router.get('/createCopy',createCopy);
module.exports = router;
