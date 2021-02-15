const Messages = require('../../helper/message');
var API      = require('../../helper/SSH_SESSION');

exports.getDirectory = async function (req,res) {
    // location       : Encrypted folder location with base64
    // isItRecycleBin : For viewing trash [true,false]

    var SSH_Connection           = API.getSSH();
    var SSH_User                 = API.getUsername();
    var encryptedLocation        = req.query.location;
    var location                 = Buffer.from(encryptedLocation,'base64').toString('utf-8');
    var formattedCurrentLocation = location.replace(/\s/g,'\\ ').replace(/'/g, "\\'");
    var isItRecycleBin           = req.query.isItRecycleBin;
    var recycleBinLocation       = `/home/${SSH_User}/.local/share/Trash/files`
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {   var target = (isItRecycleBin==="true") ? recycleBinLocation : formattedCurrentLocation
        var command = `GetDirectoryData.run "${target}"`;
        API.executeSshCommand(command)
        .then((data)=>{
            res.status(200).json(JSON.parse(data),);
        }).catch((err)=>{
            res.status(400).json({statu:false,items:[],message:err})
        })
    }
    else{
        res.json({
            statu:false,
            message:Messages.SESSION_NOT_STARTED
        });
    }
}