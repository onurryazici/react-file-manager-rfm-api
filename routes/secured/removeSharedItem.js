var API = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
exports.removeSharedItem = function (req,res) {
    /// INPUTS
    /// "items[]" :  Encoded Item's absolute path with base64
    /// "location":  Location of the items
    var SSH_Connection = API.getSSH();
    var SSH_User       = API.getUsername();
    var unparsedItems  = req.body.items;

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
          ParseItems(unparsedItems).then((parsedItems)=>{
            var command = `rm -rf ${parsedItems.join(' ')}`
            console.log(command)
            API.executeSshCommand(command)
            .then(()=>{
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
      const formatted = API_FUNCTIONS.replaceSpecialChars(item)
      parsedItems.push(formatted);
    }
    resolve(parsedItems);
  })
}