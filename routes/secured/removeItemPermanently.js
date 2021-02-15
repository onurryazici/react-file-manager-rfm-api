var API = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
exports.removeItemPermanently = function (req,res) {
    /// INPUTS
    /// "items[]" :  Encoded Item's absolute path with base64
    /// "location":  Location of the items
    var SSH_Connection = API.getSSH();
    var SSH_User       = API.getUsername();
    var encryptedItems = req.query.items;

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
          DecryptItems(encryptedItems,SSH_User).then((decryptedItems)=>{
            var command = `rm -rf ${decryptedItems.join(' ')}`
            console.log(command)
            API.executeSshCommand(command)
            .then(()=>{
                res.status(200).json({statu:true, message:"MOVE_TO_TRASH_SUCCESS"});
            }).catch((err)=>{
                res.status(400).json({statu:false, items:[]})
            })
          })
          .catch((err)=>{
            console.log(err)
          })
    }
}
function DecryptItems(encryptedItems,SSH_User){
  return new Promise((resolve,reject)=>{
    var decryptedItems=[];
    for(let item of encryptedItems) {
      var itemName = Buffer.from(item,'base64').toString('utf-8');
      const infoLocation = API_FUNCTIONS.replaceSpecialChars(`/home/${SSH_User}/.local/share/Trash/info/${itemName}.trashinfo`)
      const fileLocation = API_FUNCTIONS.replaceSpecialChars(`/home/${SSH_User}/.local/share/Trash/files/${itemName}`)
      decryptedItems.push(infoLocation,fileLocation);
    }
    resolve(decryptedItems);
  })
}