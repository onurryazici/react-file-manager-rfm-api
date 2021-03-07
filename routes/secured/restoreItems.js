var API = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
exports.restoreItems = function (req,res) {
    /// INPUTS
    /// "items[]" :  Encoded Item's restore path with base64
    var SSH_Connection = API.getSSH();
    var SSH_User       = API.getUsername();
    var unparsedItems  = req.body.items;
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        ParseItems(unparsedItems).then((parsedItems)=>{
            var promises=[];
            return new Promise(resolve => {
              Array.from(parsedItems).forEach((item,i) => {
                var p = new Promise((resolve,reject) => {
                  const absolutePath         = item.absolutePath;
                  const restorePath          = item.restorePath;
                  const parentPath           = restorePath.substring(0,restorePath.lastIndexOf('/'))
                  const itemName             = absolutePath.substring(absolutePath.lastIndexOf('/') + 1, absolutePath.length);
                  const newRestoreName       = `${parentPath}/restored-${itemName}`
                  const recycleInfoLocation  = `/home/${SSH_User}/.local/share/Trash/info/${itemName}.trashinfo`;
                  const command = `mv ${API_FUNCTIONS.replaceSpecialChars(absolutePath)} ${API_FUNCTIONS.replaceSpecialChars(newRestoreName)} && rm -rf ${API_FUNCTIONS.replaceSpecialChars(recycleInfoLocation)}`;
                  API.executeSshCommand(command).then(()=>{
                    resolve();
                  }).catch(()=>{
                    reject();
                  })
                });
                promises.push(p);
                if(i === Array.from(parsedItems).length - 1){
                    resolve();
                } 
              })

              Promise.all(promises).then(()=>{
                  res.status(200).json({statu:true, message:"ITEM_RESTORE_SUCCESS"});
              }).catch((err)=>{
                  res.status(400).json({statu:false, message:err})
              })
            });
          })
    }
}
function ParseItems(unparsedItems){
  return new Promise((resolve)=>{
    var parsedItems=[];
    for(let item of unparsedItems) {
      parsedItems.push({
        absolutePath:item.absolutePath,
        restorePath:item.restorePath,
      });
    }
    resolve(parsedItems);
  })
}