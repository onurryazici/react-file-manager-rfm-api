const Messages = require('../../helper/message');
var API      = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
exports.getImage = async function (req,res) {
    // INPUT
    // absolutePath : Encrypted image path with base64

    var SSH_Connection           = API.getSSH();
    var absolutePath             = req.body.absolutePath;
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {   
        SSH_Connection.connection.sftp((sftp_err,sftp) => {
            var base64Data = [];
            var dataLength=0;
            var file = sftp.createReadStream(absolutePath)
            file.on('data',(chunk)=>{
                base64Data.push(chunk);
                dataLength += chunk.length;
            })
            file.on('end',()=>{
                var dataBuffer = Buffer.concat(base64Data,dataLength);
                const img = Buffer.from(dataBuffer).toString('base64')
                res.status(200).json(img)
            })
        })
    }
    else{
        res.json({
            statu:false,
            message:Messages.SESSION_NOT_STARTED
        });
    }
}