const Messages = require('../../helper/message');
var API      = require('../../helper/SSH_SESSION');

exports.getDirectory = async function (req,res) {
    var SSH_Connection           = API.getSSH();
    var encryptedLocation        = req.query.location;
    var location                 = Buffer.from(encryptedLocation,'base64').toString('utf-8');
    var formattedCurrentLocation = location.replace(/\s/g,'\\ ').replace(/'/g, "\\'");
    
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        var command = `GetDirectoryData.run "${formattedCurrentLocation}"`;
        API.executeSshCommand(command)
        .then((data)=>{
            res.status(200).json(JSON.parse(data),);
        }).catch((err)=>{
            res.status(400).json({statu:false,items:[]})
        })
    }
    else{
        res.json({
            statu:false,
            message:Messages.SESSION_NOT_STARTED
        });
    }
}