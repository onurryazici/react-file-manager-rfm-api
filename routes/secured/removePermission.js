var API = require('../../helper/SSH_SESSION');

exports.removePermission = function (req,res) {

    /// INPUT
    /// item        : Encrypted item path with base64
    /// user        : username of person to add

    var SSH_Connection = API.getSSH();
    var item           = req.body.item;
    var user           = req.body.user;

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        API.executeSshCommand(`getent passwd ${user}`).then((exist)=>{
            if (exist.length > 0){
                var itemPath = item.replace(/\s/g,'\\ ').replace(/'/g, "\\'");
                var command  = `setfacl -Rx ${"user:" + user} ${itemPath}`;
                API.executeSshCommand(command)
                .then(() => {
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