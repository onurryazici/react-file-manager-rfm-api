var API = require('../../helper/SSH_SESSION');

exports.renameItem = function (req,res) {
    var SSH_Connection = API.getSSH();
    var item = Buffer.from(req.query.itemPath,'base64').toString('ascii');
    var newName  = Buffer.from(req.query.newName,'base64').toString('ascii');

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        SSH_Connection.connection.sftp((sftp_err,sftp) => {
        if (sftp_err)
            res.status(400).json({statu:false,message:"UNKNOWN_ERROR"});   
        
        var itemPath = item.substring(0,item.lastIndexOf('/'));
        sftp.rename(item,itemPath+"/"+newName,(error)=>{
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
            } 
            else {
                res.status(200).json({statu:true,message:"RENAME_ITEM_SUCCESS"});
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