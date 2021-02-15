var API = require('../../helper/SSH_SESSION');

exports.moveToTrash = function (req,res) {
    /// INPUTS
    /// "items[]" :  Encoded Item's absolute path with base64
    /// "location":  Location of the items

    var SSH_Connection = API.getSSH();
    var SSH_User       = API.getUsername();
    var encryptedItems = req.query.items;
    var encryptedCurrentLocation = req.query.location;
    
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
      SSH_Connection.connection.sftp((sftp_err,sftp) => {
        if (sftp_err)
            reject({statu:false,message:"UNKNOWN_ERROR"});
        else{
          DecryptItems(encryptedItems,encryptedCurrentLocation).then((decryptedItems)=>{
            var command = `trash-put ${decryptedItems.join(' ')}`;
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
      });
    }
}
function DecryptItems(encryptedItems,encryptedCurrentLocation){
  return new Promise((resolve,reject)=>{
    var decryptedCurrentLocation = Buffer.from(encryptedCurrentLocation,'base64').toString('utf-8');
    var decryptedItems=[];
    for(let item of encryptedItems) {
      var itemName = Buffer.from(item, 'base64').toString('utf-8');
      var itemLocation = decryptedCurrentLocation + "/" + itemName;
      decryptedItems.push(itemLocation);
    }
    console.log("")
    resolve(decryptedItems);
  })
}