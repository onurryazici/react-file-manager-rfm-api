const Messages = require('../../helper/message');
var API      = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
exports.getImage = async function (req,res) {
    // location       : Encrypted folder location with base64
    // isItRecycleBin : For viewing trash [true,false]

    var SSH_Connection           = API.getSSH();
    var SSH_User                 = API.getUsername();
    //var absolutePath             = req.query.absolutePath;
    //var itemPath                 = Buffer.from(absolutePath,'base64').toString('utf-8');
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {   
        SSH_Connection.connection.sftp((sftp_err,sftp) => {
            var base64Data = [];
            var dataLength=0;
            var file = sftp.createReadStream('/home/main/res.jpg')
            file.on('data',(chunk)=>{
                base64Data.push(chunk);
                dataLength += chunk.length;
            })
            file.on('end',()=>{
                var dataBuffer = Buffer.concat(base64Data,dataLength);
                const img = Buffer.from(dataBuffer)
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': dataLength
                  });
                res.end(img)
                
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


/*
SSH_Connection.connection.sftp((sftp_err,sftp) => {
            var base64Data = [];
            var file = sftp.createReadStream('/home/main/res.jpg')
            file.on('data',(chunk)=>{
                base64Data.push(chunk);
            })
            file.on('end',()=>{
                const obj = base64Data;
                const adata  = base64Data[0];
                console.log(adata.length)
               res.status(200).json({
                   statu:true,
                   fileData:obj[0]
               })
            })

        })
*/