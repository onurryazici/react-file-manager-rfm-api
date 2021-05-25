var SessionManagement = require('../../helper/session');
var API_FUNCTIONS = require('../../helper/functions');
exports.newShareItem = function (req,res) {
    //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [TEXT] userData : "username:rwx" "username:r-x" Like this..
    //  [TEXT] itemPath : Item address to new share 
    //  ----------------- OUTPUT PARAMETERS -------------------
    //  [TRUE STATE]
    //  "statu": true,
    //  "message":"PROCESS_SUCCESS"
    //
    //  [FALSE STATE]
    //  "statu": false
    //  "message": "error"
    //  </Summary>

    var Client = SessionManagement.getClient(req.username);
    var itemPath = req.body.itemPath;
    var userData = req.body.userData;

    if(Client !== null && Client.isConnected()) 
    {
        const itemPathStr = API_FUNCTIONS.replaceSpecialChars(itemPath);
        
        const command = `NewShare.run ${itemPathStr} ${userData.join(' ')}`
        console.log(command)
        SessionManagement.executeSshCommand(Client, command).then((output)=>{
            return res.status(200).json({
                statu:true,
                message:output.message,
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
