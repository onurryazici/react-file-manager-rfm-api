var SessionManagement      = require('../../helper/session');
var HelperFunctions = require('../../helper/functions');
exports.removePermission = function (req,res) {
    //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [TEXT] item : Item address to remove permission
    //  [TEXT] user : Username to remove permission of item 
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
    var item   = req.body.item;
    var user   = req.body.user; // İzni silinecek olan kullanıcı

    if(Client !== null && Client.isConnected()) 
    {
        var itemPath = HelperFunctions.replaceSpecialChars(item);
        var itemName = HelperFunctions.replaceSpecialChars(item.substring(item.lastIndexOf('/')+1,item.length))
        var userPermissionCommand        = `setfacl -Rx ${"d:user:" + user} ${itemPath}`;
        var defaultUserPermissionCommand = `setfacl -Rx ${"user:" + user} ${itemPath}`;
        var removePermissionCommand      = `${userPermissionCommand} && ${defaultUserPermissionCommand}`;
        var removeFromUserCommand = `find /home/${user}/drive-sharedWithMe -maxdepth 1 -type l -ls | grep "${itemPath}" | awk '{ print $11 }' | xargs rm -f`
        console.log(removeFromUserCommand)
        const command = `${removeFromUserCommand} && ${removePermissionCommand}`
        SessionManagement.executeSshCommand(Client, command).then((output) => {
            res.status(200).json({
                statu:true,
                message:"PROCESS_SUCCESS",
            });
        }).catch((err)=>{
            res.status(400).json({statu:false,message:err})
        })        
    }
    else
    {
        res.json({
            statu:false,
            message:"SESSION_NOT_STARTED"
        });
    }
}