var API = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
exports.emptyTrash = function (req,res) {
    /// INPUTS
    /// "items[]" :  Encoded Item's absolute path with base64
    /// "location":  Location of the items
    var SSH_Connection = API.getSSH();
    var SSH_User       = API.getUsername();
    var encryptedItems = req.query.items;

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        API.executeSshCommand("trash-empty")
        .then(()=>{
            console.log("harika")
            res.status(200).json({statu:true, message:"EMPTY_TRASH_SUCCESS"});
        }).catch((err)=>{
            res.status(400).json({statu:false, items:[]})
        })
    }
}
