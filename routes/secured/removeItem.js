var API = require('../../helper/SSH_SESSION');

exports.removeItem = function (req,res) {
    var SSH_Connection = API.getSSH();
    var SSH_User       = API.getUsername();
    var encryptedItems = req.query.items;
    var decryptedItems = [];
    var recycle_location = "/home/" + SSH_User + "/deleted_items";

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
      for(let item of encryptedItems) {
        var itemName = Buffer.from(item,'base64').toString('ascii') ;
        decryptedItems.push(itemName);
      }
      var hasError = false;
      var errorCode;
      SSH_Connection.connection.sftp((sftp_err,sftp) => {
        if (sftp_err)
          res.status(400).json({statu:false,message:"UNKNOWN_ERROR"});
        for(let item of decryptedItems) {
          var itemName = item.split('/').pop();
          var tempName = itemName + new Date().getTime(); // 13 length
          sftp.rename(item,(recycle_location + "/" + tempName),(error)=> {
            if (error) {
              hasError=true;
              errorCode = error.code;
            } 
          });
        } 
        if(hasError){
          switch(errorCode){
            case 2:
              res.status(400).json({statu:false,message:"BAD_DIRECTORY"});
              break;
            case 4:
              res.status(400).json({statu:false,message:"ITEM_ALREADY_EXISTS"});
              break;
            default:
              res.status(400).json({statu:false,message:"UNKNOWN_ERROR"});
              break;
          }
        }
        else
          res.status(200).json({statu:true,message:"ITEM_REMOVE_SUCCESS"});
      });
    }
    else{
        res.json({
            statu:false,
            message:"SESSION_NOT_STARTED"
        });
    }
}