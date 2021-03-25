var API = require('../../helper/SSH_SESSION');

exports.createDirectory = async function (req,res) {
  /// INPUTS
  /// "location" : Encoded Current directory with base64
  /// "dirname"  : Encoded new folder name with base64


  var SSH_Connection      = API.getSSH();
  var location            = req.body.location;
  var dirname             = req.body.dirname;

  
  const newDirectoryPath = location + "/" + dirname;
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
      SSH_Connection.connection.sftp((sftp_err,sftp) => {
            if (sftp_err){
              res.status(400).json({statu:false,message:"UNKNOWN_ERROR"});}
            sftp.mkdir(newDirectoryPath, function(error) {
              
            if (error) {
              res.status(304).json({statu:false,message:"UNKNOWN_ERROR",details:error.code});
            } else {
              const item={
                owner:API.getUsername(),
                extension:"",
                read:true,
                size:"4 Kb",
                lastModifyTime:new Date().getDate(),
                name:dirname,
                absolutePath:location+"/"+dirname,
                type:"directory",
                sharedWith:[],
                write:true,
                execute:true
              }
              res.status(200).json({statu:true,item:item,message:"DIRECTORY_CREATE_SUCCESS"});
            }
          });
      });
    }
    else{
        res.json({
            statu:false,
            message:"SESSION_NOT_STARTED"
        });
    }
}
