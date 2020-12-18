var express = require('express');
var router = express.Router();
const { getDirectory } = require('./secured/getDirectory');
const { userAuthentication } = require('./open-service/user-authentication');

const options = {
    username: 'user2',
    password: 'qweqweasd',
};

router.get('/getDirectory',getDirectory );



router.post('/userAuthentication', userAuthentication );
module.exports = router;