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
        SSH_Connection.connection.sftp((sftp_err,sftp) => {
            API.executeSshCommand(`getent passwd ${user}`).then((exist)=>{
                
                if (exist.length > 0){
                    const itemPath  = API_FUNCTIONS.replaceSpecialChars(unparsedItems);
                    const itemName  = itemPath.substring(itemPath.lastIndexOf('/') + 1, itemPath.length);
                    const command   = `setfacl -Rm ${"d:" + user + ":" + permissions} ${itemPath} && setfacl -Rm o:--x ${itemPath}`;
                    console.log(command)
                    const sharePath = `/home/${user}/.sharedWithMe/[$(date +%s%N | cut -b10-19)]-${itemName}`;
                    const shortcutCommand = `ln -s ${itemPath} ${sharePath}`
                    API.executeSshCommand(command + " && " + shortcutCommand).then(()=>{
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
