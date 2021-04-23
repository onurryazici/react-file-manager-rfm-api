var API = require('../../helper/SSH_SESSION');

exports.renameItem = function (req,res) {
    /// INPUTS
    /// "itemPath" : Encoded item path with base64
    /// "newName"  : Encoded new name of item with base64
    
  
    var SSH_Connection = API.getSSH();
    var item           = req.body.itemPath;
    var type           = req.body.type;
    var extension      = req.body.extension;
    var newName        = req.body.newName;

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        SSH_Connection.connection.sftp((sftp_err,sftp) => {
            if (sftp_err)
                res.status(400).json({statu:false,message:"UNKNOWN_ERROR"});   
            var itemPath = item.substring(0,item.lastIndexOf('/'));
            var name     = (type==="directory") ? newName : newName + "." + extension;
            var target   = itemPath+"/" + name ;
            sftp.rename(item,target,(error)=>{
                sftp.end();
                if (error) 
                    res.status(304).json({statu:false,message:"UNKNOWN_ERROR",details:error.code});
                else {
                    res.status(200).json({statu:true,message:"ITEM_RENAME_SUCCESS",newItemName:name});
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