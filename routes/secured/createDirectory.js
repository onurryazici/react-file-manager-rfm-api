const SshSession         = require('../../helper/session');
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
  var Client   = SshSession.getClient(req.username);
  var username = req.username
  var location = req.body.location;
  var dirname  = req.body.dirname;
  
  const newDirectoryPath = location + "/" + dirname;
    if(Client !== null && Client.isConnected()) 
    {
      Client.connection.sftp((sftp_err,sftp) => {
            if (sftp_err){
              res.status(400).json({statu:false,message:"UNKNOWN_ERROR"});}
            sftp.mkdir(newDirectoryPath, function(error) {
              
            if (error) {
              res.status(304).json({statu:false,message:"UNKNOWN_ERROR",details:error.code});
            } else {
              const item={
                owner:username,
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
              sftp.end();
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
