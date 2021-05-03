var SshSession = require('../../helper/session');

exports.renameItem = function (req,res) {
    //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [TEXT] itemPath  : Address of item to rename item 
    //  [TEXT] itemType  : For specifying item type [directory | file]
    //  [TEXT] extension : For specifying item extension [for file]
    //  [TEXT] newName   : For specifying new name of item
    //  ----------------- OUTPUT PARAMETERS -------------------
    //  [TRUE STATE]
    //  "statu": true,
    //  "message":"ITEM_RENAME_SUCCESS",
    //  "newItemName":name
    //  
    //  [FALSE STATE]
    //  statu:false,
    //  message:"UNKNOWN_ERROR",
    //  details:"error detail"
    //  </Summary>
    
  
    var Client    = SshSession.getClient(req.username);
    var item      = req.body.itemPath;
    var type      = req.body.type;
    var extension = req.body.extension;
    var newName   = req.body.newName;

    if(Client !== null && Client.isConnected()) 
    {
        Client.connection.sftp((sftp_err,sftp) => {
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