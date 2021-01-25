var API = require('../../helper/SSH_SESSION');

exports.renameItem = function (req,res) {
    /// INPUTS
    /// "itemPath" : Encoded item path with base64
    /// "newName"  : Encoded new name of item with base64
    
  
    var SSH_Connection = API.getSSH();
    var item = Buffer.from(req.query.itemPath,'base64').toString('utf-8');
    var newName  = Buffer.from(req.query.newName,'base64').toString('utf-8');

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        SSH_Connection.connection.sftp((sftp_err,sftp) => {
        if (sftp_err)
            res.status(400).json({statu:false,message:"UNKNOWN_ERROR"});   
        var itemPath = item.substring(0,item.lastIndexOf('/'));
        sftp.rename(item,itemPath+"/"+newName,(error)=>{
            if (error) 
                res.status(304).json({statu:false,message:"UNKNOWN_ERROR",details:error.code});
            else {
                res.status(200).json({statu:true,message:"ITEM_RENAME_SUCCESS"});
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