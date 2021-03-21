var API = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
exports.newShareItem = function (req,res) {

    /// INPUT
    /// item        : Encrypted item path with base64
    /// user        : username of person to add
    /// permissions : Permissions of item 
    var SSH_Connection = API.getSSH();
    var itemPath = req.body.itemPath;
    var userData = req.body.userData;

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        SSH_Connection.connection.sftp((sftp_err,sftp) => {
            const command = `NewShare.run "${itemPath}" ${userData.join(' ')}`
            console.log(command);
            API.executeSshCommand(command).then((output)=>{
                return res.status(200).json({
                    statu:true,
                    message:output.message,
                });
            
            }).catch((err)=>{
                console.log("hata 2 " + output.message);
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
