var API = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
exports.moveToTrash = function (req,res) {
    /// INPUTS
    /// "items[]" :  Encoded Item's absolute path with base64
    /// "location":  Location of the items

    var SSH_Connection = API.getSSH();
    var SSH_User       = API.getUsername();
    var unparsedItems  = req.body.items;
    var target = req.body.location;
    
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
      ParseItems(unparsedItems,target).then((parsedItems)=>{
        var command = `trash-put ${API_FUNCTIONS.replaceSpecialChars(parsedItems.join(' '))}`;
        console.log(command)
        API.executeSshCommand(command)
        .then(()=>{
            res.status(200).json({statu:true, message:"MOVE_TO_TRASH_SUCCESS"});
        }).catch((err)=>{
          console.log("hataaa " + err)
            res.status(400).json({statu:false, items:[]})
        })
      })
      .catch((err)=>{
        console.log(err)
      })
    }
}
function ParseItems(unparsedItems,target){
  return new Promise((resolve,reject)=>{
    var parsedItems=[];
    for(let item of unparsedItems) {
      var itemLocation = target + "/" + item;
      parsedItems.push(itemLocation);
    }
    resolve(parsedItems);
  })
}