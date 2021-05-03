var SshSession = require('../../helper/session');
var HelperFunctions = require('../../helper/functions');
exports.existShareItem = function (req,res) {
    //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [TEXT] itemPath   : Item address of already shared item
    //  [TEXT] user       : Name of the user to share
    //  [TEXT] permission : [rwx] [r-x] Like this.. 
    //  [TEXT] location   : Şimdilik ne olduğunu unuttum sonra yazarım :-) 
    //  ----------------- OUTPUT PARAMETERS -------------------
    //  [TRUE STATE]
    //  "statu": true,
    //  "message":"PROCESS_SUCCESS"
    //
    //  [FALSE STATE]
    //  "statu": false
    //  "message": "error"
    //  </Summary>

    var Client     = SshSession.getSSH();
    var itemPath   = req.body.itemPath;
    var user       = req.body.user;
    var permission = req.body.permission;
    var location   = req.body.location;
    if(Client !== null && Client.isConnected()) 
    {
        const itemPathStr = HelperFunctions.replaceSpecialChars(itemPath);  
        const command     = `ExistShare.run ${location} ${itemPathStr} ${user}:${permission}`
        SshSession.executeSshCommand(Client, command).then((output)=>{
            return res.status(200).json({
                statu:true,
                message:"PROCESS_SUCCESS",
            });
            
        }).catch((err)=>{
            return res.status(400).json({
                statu:false,
                message:err,
            });
        })
    }
    else
    {
        return res.json({
            statu:false,
            message:"SESSION_NOT_STARTED"
        });
    }
}
