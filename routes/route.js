var express = require('express');
var router = express.Router();
const { getDirectory } = require('./secured/getDirectory');

router.get('/getDirectory',getDirectory );

module.exports = router;