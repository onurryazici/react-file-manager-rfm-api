var SshSession      = require('../../helper/session');
var HelperFunctions = require('../../helper/functions');
exports.removeItemPermanently = function (req,res) {
    //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [ARRAY(TEXT)] location : Address of item to remove item 
    //
    //  ----------------- OUTPUT PARAMETERS -------------------
    //  [TRUE STATE]
    //  "statu": true,
    //  "message":"ITEM_REMOVE_PERMANENTLY_SUCCESS"
    //
    //  [FALSE STATE]
    //  "statu": false
    //  "items": []
    //  </Summary>
    var Client         = SshSession.getClient(req.username);
    var username       = req.username;
    var unparsedItems  = req.body.items;

    if(Client !== null && Client.isConnected()) 
    {
      ParseItems(unparsedItems,username).then((parsedItems)=>{
        var command = `rm -rf ${parsedItems.join(' ')}`
        console.log(command)
        Client.executeSshCommand(Client, command).then(()=>{
            res.status(200).json({statu:true, message:"ITEM_REMOVE_PERMANENTLY_SUCCESS"});
        }).catch((err)=>{
            res.status(400).json({statu:false, items:[]})
        })
      })
      .catch((err)=>{
        console.log(err)
      })
    }
}
function ParseItems(unparsedItems,_username){
  return new Promise((resolve,reject)=>{
    var parsedItems=[];
    for(let item of unparsedItems) {
      var itemName = item;
      const infoLocation = HelperFunctions.replaceSpecialChars(`/home/${_username}/.local/share/Trash/info/${itemName}.trashinfo`)
      const fileLocation = HelperFunctions.replaceSpecialChars(`/home/${_username}/.local/share/Trash/files/${itemName}`)
      parsedItems.push(infoLocation,fileLocation);
    }
    resolve(parsedItems);
  })
}