var SessionManagement = require('../../helper/session');
var HelperFunctions = require('../../helper/functions');
exports.removeSharedItem = function (req,res) {
    //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [ARRAY(TEXT)] items : Address of item to remove shared items 
    //
    //  ----------------- OUTPUT PARAMETERS -------------------
    //  [TRUE STATE]
    //  "statu": true,
    //  "message":"PROCESS_SUCCESS"
    //
    //  [FALSE STATE]
    //  "statu": false
    //  "items": []
    //  </Summary>
    var Client         = SessionManagement.getClient(req.username);
    var unparsedItems  = req.body.items;
    if(Client !== null && Client.isConnected()) 
    {
        ParseItems(unparsedItems).then((parsedItems)=>{
          var command = `rm -rf ${parsedItems.join(' ')}`
          SessionManagement.executeSshCommand(Client, command).then(()=>{
              res.status(200).json({statu:true, message:"PROCESS_SUCCESS"});
          }).catch((err)=>{
              res.status(400).json({statu:false, items:[]})
          })
        })
        .catch((err)=>{
          console.log(err)
        })
    }
}
function ParseItems(unparsedItems){
  return new Promise((resolve,reject)=>{
    var parsedItems=[];
    for(let item of unparsedItems) {
      const formatted = HelperFunctions.replaceSpecialChars(item)
      parsedItems.push(formatted);
    }
    resolve(parsedItems);
  })
}