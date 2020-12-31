var API = require('../../helper/SSH_SESSION');

exports.createDirectory = async function (req,res) {
  var SSH_Connection      = API.getSSH();
  var encryptedLocation   = req.query.location;
  var encrpyedDirName     = req.query.dirname;
  var location            = Buffer.from(encryptedLocation,'base64').toString('ascii');
  var dirname             = Buffer.from(encrpyedDirName,'base64').toString('ascii');
  

  const newDirectoryPath = location + "/" + dirname;
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
      SSH_Connection.connection.sftp((sftp_err,sftp) => {
            if (sftp_err)
              res.status(400).json({statu:false,message:"UNKNOWN_ERROR"});
             
            sftp.mkdir(newDirectoryPath, function(error) {
            if (error) {
              switch(error.code){
                case 2:
                  res.status(400).json({statu:false,message:"BAD_DIRECTORY"});
                  break;
                case 4:
                  res.status(400).json({statu:false,message:"DIRECTORY_ALREADY_EXISTS"});
                  break;
                default:
                  res.status(400).json({statu:false,message:"UNKNOWN_ERROR"});
                  break;
              }
            } else {
              res.status(200).json({statu:true,message:"DIRECTORY_CREATE_SUCCESS"});
            }
          });
      });
    }
    else{
        res.json({
            statu:false,
            message:"Session not started"
        });
    }
}