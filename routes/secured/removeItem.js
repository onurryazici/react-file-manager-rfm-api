var API = require('../../helper/SSH_SESSION');

exports.removeItem = function (req,res) {
    /// INPUTS
    /// "items[]" :  Encoded Item's absolute path with base64
    /// "location":  Location of the items
    var SSH_Connection = API.getSSH();
    var SSH_User       = API.getUsername();
    var encryptedItems = req.query.items;
    var encryptedCurrentLocation = req.query.location;
    

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
      var promises=[];

      SSH_Connection.connection.sftp((sftp_err,sftp) => {
        if (sftp_err)
            reject({statu:false,message:"UNKNOWN_ERROR"});
        else{
          DecryptItems(encryptedItems,encryptedCurrentLocation).then((decryptedItems)=>{
              decryptedItems.forEach(item => {
                promises.push(HandleRemove(item,sftp,SSH_User));
              })})
              .then(()=>{
              Promise.all(promises)
                .then((data)=>{
                  res.status(200).json({statu:true,message:"ITEM_REMOVE_SUCCES"});
                }).catch((error)=>{
                  res.status(304).json(error);
                })
              
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
      var itemName = Buffer.from(item,'base64').toString('utf-8');
      var itemLocation = decryptedCurrentLocation+"/"+itemName;
      decryptedItems.push(itemLocation);
    }
    resolve(decryptedItems);
  })
}

function HandleRemove(item,sftp,user){
  return new Promise((resolve,reject) => {
      var recycle_location = "/home/" + user + "/deleted_items";
      var itemName = item.split('/').pop();
      var recycleName = itemName + new Date().getTime(); // 13 length
      sftp.rename(item.toString(),(recycle_location + "/" + recycleName),(error)=> {
        if (error) {
          reject({statu:false,message:"UNKNOWN_ERROR",details:error.code})
        }
        else
          resolve({statu:true,message:"ITEM_REMOVE_SUCCES"});
    })
  })
}