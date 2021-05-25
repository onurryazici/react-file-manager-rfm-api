var SessionManagement      = require('../../helper/session');
var HelperFunctions = require('../../helper/functions');
exports.moveToTrash = function (req,res) {
    //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [ARRAY(TEXT)] items  : Item addresses to move trash
    //  [TEXT]        target : Location of item to move trash 
    //  ----------------- OUTPUT PARAMETERS -------------------
    //  [TRUE STATE]
    //  "statu": true,
    //  "message":"PROCESS_SUCCESS"
    //
    //  [FALSE STATE]
    //  "statu": false
    //  "message": "error"
    //  </Summary>

    var Client        = SessionManagement.getClient(req.username);
    var unparsedItems = req.body.items;
    var target        = req.body.location;
    
    if(Client !== null && Client.isConnected()) 
    {
      ParseItems(unparsedItems,target).then((parsedItems)=>{
        var command = `trash-put ${parsedItems.join(' ')}`;
        SessionManagement.executeSshCommand(Client, command)
        .then(()=>{
            res.status(200).json({statu:true, message:"PROCESS_SUCCESS"});
        }).catch((err)=>{
            res.status(400).json({statu:false, message:err})
        })
      }).catch((err)=>{
        res.status(400).json({statu:false, message:err})
      })
    }
    else{
      return res.json({
        statu:false,
        message:"SESSION_NOT_STARTED"
      });
    }
}
function ParseItems(unparsedItems,target){
  return new Promise((resolve,reject)=>{
    var parsedItems=[];
    for(let item of unparsedItems) {
      var itemLocation = target + "/" + item;
      parsedItems.push(`${HelperFunctions.replaceSpecialChars(itemLocation)}`);
    }
    resolve(parsedItems);
  })
}