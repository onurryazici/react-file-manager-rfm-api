var API = require('../../helper/SSH_SESSION');

exports.createDirectory = async function (req,res) {
  /// INPUTS
  /// "location" : Encoded Current directory with base64
  /// "dirname"  : Encoded new folder name with base64


  var SSH_Connection      = API.getSSH();
  var encryptedLocation   = req.query.location;
  var encrpyedDirName     = req.query.dirname;
  var location            = Buffer.from(encryptedLocation,'base64').toString('utf-8');
  var dirname             = Buffer.from(encrpyedDirName,'base64').toString('utf-8');

  
  const newDirectoryPath = location + "/" + dirname;
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
      SSH_Connection.connection.sftp((sftp_err,sftp) => {
            if (sftp_err){
              res.status(400).json({statu:false,message:"UNKNOWN_ERROR"});}
            sftp.mkdir(newDirectoryPath, function(error) {
              
            if (error) {
              switch(error.code){
                case 2:
                  res.status(200).json({statu:false,message:"BAD_DIRECTORY"});
                  break;
                case 4:
                  res.status(200).json({statu:false,message:"DIRECTORY_ALREADY_EXISTS"});
                  break;
                default:
                  res.status(200).json({statu:false,message:"UNKNOWN_ERROR"});
                  break;
              }
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
                sharedWith:[{
                  username:API.getUsername(),
                  read:true,
                  write:true,
                  execute:true,
                }],
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
