var API = require('../../helper/SSH_SESSION');

exports.shareItem = function (req,res) {

    /// INPUT
    /// item        : Encrypted item path with base64
    /// user        : username of person to add
    /// permissions : Permissions of item 
    var SSH_Connection = API.getSSH();
    var encryptedItem = req.query.item;
    var decryptedItem = Buffer.from(encryptedItem,'base64').toString('utf-8') ;;
    var user        = req.query.user;
    var permissions = req.query.permissions;

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        API.executeSshCommand(`getent passwd ${user}`).then((exist)=>{
            if (exist.length > 0){
                var itemPath = decryptedItem.replace(/\s/g,'\\ ').replace(/'/g, "\\'");
                var command = `setfacl -Rm ${"u:" + user + ":" +permissions} ${itemPath}`;
                API.executeSshCommand(command)
                .then(()=>{
                    res.status(200).json({
                        statu:true,
                        message:"PROCESS_SUCCESS",
                    });
                }).catch((err)=>{
                    res.status(404).json({statu:false,message:err})
                })
            }
            else{
                res.status(200).json({
                    statu:false,
                    message:"NO_SUCH_USER",
                });
            }
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