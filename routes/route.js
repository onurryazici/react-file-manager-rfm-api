var express = require('express');
var router = express.Router();
const { getDirectory } = require('./secured/getDirectory');
const { userAuthentication } = require('./open-service/user-authentication');
const { createDirectory } = require('./secured/createDirectory');
const { removeItemPermanently } = require('./secured/removeItemPermanently');
const { renameItem } = require('./secured/renameItem');
const { shareItem } = require('./secured/shareItem');
const { newShareItem } = require('./secured/newShareItem');
const { isUserExist } = require('./secured/isUserExist');
const { removePermission } = require('./secured/removePermission');
const { moveItems } = require('./secured/moveItems');
const { createCopy } = require('./secured/createCopy');
const { uploadItem } = require('./secured/uploadItem');
const { moveToTrash } = require('./secured/moveToTrash');
const { emptyTrash } = require('./secured/emptyTrash');
const multer = require('multer');
const { restoreItems } = require('./secured/restoreItems');
const { getImage } = require('./secured/getImage');
const { encryptItems } = require('./secured/encryptItems');
const upload = multer();

router.post('/secured/getDirectory',getDirectory ); // POSTA ÇEVİR
router.post('/open-service/userAuthentication', userAuthentication );
router.post('/secured/uploadItem', upload.single('file'), uploadItem);
router.post('/secured/createDirectory', createDirectory);
router.post('/secured/removeItemPermanently', removeItemPermanently);
router.post('/secured/renameItem', renameItem);
router.post('/secured/shareItem', shareItem);
router.post('/secured/newShareItem', newShareItem);
router.post('/secured/isUserExist', isUserExist);
router.post('/secured/removePermission', removePermission);
router.post('/secured/moveItems',moveItems);
router.post('/secured/createCopy',createCopy);
router.post('/secured/moveToTrash', moveToTrash);
router.get('/secured/emptyTrash',emptyTrash);
router.post('/secured/restoreItems',restoreItems);
router.get('/secured/getImage',getImage);
router.get('/secured/encryptItems',encryptItems);
module.exports = router;