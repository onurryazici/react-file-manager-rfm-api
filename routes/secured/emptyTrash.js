var SessionManagement = require('../../helper/session');
exports.emptyTrash = function (req,res) {
    //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [NONE]
    //  ----------------- OUTPUT PARAMETERS -------------------
    //  [TRUE STATE]
    //  "statu": true,
    //  "message":"PROCESS_SUCCESS"
    //
    //  [FALSE STATE]
    //  "statu": false
    //  "message": "error"
    //  </Summary>
    var Client = SessionManagement.getClient(req.username);
    if(Client !== null && Client.isConnected()) 
    {
        SessionManagement.executeSshCommand(Client, "trash-empty").then(()=>{
            res.status(200).json({statu:true, message:"PROCESS_SUCCESS"});
        }).catch((err)=>{
            console.log(err)
            res.status(400).json({statu:false, message:err})
        })
    }
}
