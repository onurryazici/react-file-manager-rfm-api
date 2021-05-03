var SshSession      = require('../../helper/session');
var HelperFunctions = require('../../helper/functions');
exports.restoreItems = function (req,res) {
    //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [ARRAY(TEXT)] items  : Item addresses to restore items
    //  ----------------- OUTPUT PARAMETERS -------------------
    //  [TRUE STATE]
    //  "statu": true,
    //  "message":"PROCESS_SUCCESS"
    //
    //  [FALSE STATE]
    //  "statu": false
    //  "message": "error"
    //  </Summary>
    var Client        = SshSession.getClient(req.username);
    var username      = req.username;
    var unparsedItems = req.body.items;
    if(Client !== null && Client.isConnected()) 
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
              const newRestoreName       = `${parentPath}/[restored(${new Date().getMilliseconds()})]-${itemName}`
              const recycleInfoLocation  = `/home/${username}/.local/share/Trash/info/${itemName}.trashinfo`;
              const command = `mv ${HelperFunctions.replaceSpecialChars(absolutePath)} ${HelperFunctions.replaceSpecialChars(newRestoreName)} && rm -rf ${HelperFunctions.replaceSpecialChars(recycleInfoLocation)}`;
              SshSession.executeSshCommand(Client, command).then(()=>{
                resolve();
              }).catch(()=>{
                reject();
              })
            });
            promises.push(p);
            if(i === Array.from(parsedItems).length - 1)
                resolve();
          })
          Promise.all(promises).then(()=>{
            res.status(200).json({statu:true, message:"PROCESS_SUCCESS"});
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