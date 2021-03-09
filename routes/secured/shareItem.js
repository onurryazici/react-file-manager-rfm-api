var API = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
exports.shareItem = function (req,res) {

    /// INPUT
    /// item        : Encrypted item path with base64
    /// user        : username of person to add
    /// permissions : Permissions of item 
    var SSH_Connection = API.getSSH();
    var unparsedItems = req.body.item;
    var user        = req.body.user;
    var permissions = req.body.permissions;

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        API.executeSshCommand(`getent passwd ${user}`).then((exist)=>{
            if (exist.length > 0){
                var itemPath = API_FUNCTIONS.replaceSpecialChars(unparsedItems);
                var command = `setfacl -Rm ${"u:" + user + ":" +permissions} ${itemPath}`;
                console.log(command)
                API.executeSshCommand(command)
                .then(()=>{
                    return res.status(200).json({
                        statu:true,
                        message:"PROCESS_SUCCESS",
                    });
                }).catch((err)=>{
                    return res.status(400).json({statu:false,message:err})
                })
            }
            else{
                return res.status(400).json({
                    statu:false,
                    message:"NO_SUCH_USER",
                });
            }
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