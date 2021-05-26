const SessionManagement = require('../../helper/session');
var HelperFunctions     = require('../../helper/functions');
exports.createDirectory = async function (req,res) {
  //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [TEXT]    location : Address of the directory to create folder
    //  [BOOLEAN] dirname  : Folder name to directory 
    //
    //  ----------------- OUTPUT PARAMETERS -------------------
    //  [TRUE STATE]
    //  "statu": true,
    //  "items": [
    //   {
    //      "owner": "main",
    //      "extension": "",
    //      "lastAccessTime": "",
    //      "read": true,
    //      "lastModifyTime": "",
    //      "name": "",
    //      "absolutePath": "",
    //      "type": "directory | file",
    //      "sharedWith": [],
    //      "write": false,
    //      "execute": true
    //   ]},
    //  message:"DIRECTORY_CREATE_SUCCESS"
    //  [FALSE STATE]
    //  "statu": false
    //  "message": ""
    //  </Summary>
  var Client   = SessionManagement.getClient(req.username);
  var username = req.username
  var location = req.body.location;
  var dirname  = req.body.dirname;
  
  const newDirectoryPath = location + "/" + dirname;
    if(Client !== null && Client.isConnected()) 
    {
      Client.connection.sftp((sftp_err,sftp) => {
            sftp.mkdir(newDirectoryPath, function(error) {  
            if (error) {
              res.status(400).json({statu:false,message:"UNKNOWN_ERROR",details:error.code});
            } else {
              //"getfacl -pa \'" + destination + "\' | setfacl -RM- \'" + destinationF.toPath() + "\'";
              const parentPath = HelperFunctions.replaceSpecialChars(location)
              const itemPath   = HelperFunctions.replaceSpecialChars(newDirectoryPath) 
              const updateCommand = `CopyPermissions.run ${parentPath} ${itemPath}`
              const dataCommand   = `GetDataSingle.run ${HelperFunctions.replaceSpecialChars(newDirectoryPath)}`
              const command       = `${updateCommand} && ${dataCommand}` 
              console.log(command)
              SessionManagement.executeSshCommand(Client, command).then((output)=>{
                const data = JSON.parse(output)
                res.status(200).json(data)
              }).catch((err)=>{
                  res.status(400).json({statu:false,message:err})
              }).finally(()=>sftp.end())
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
