var SessionManagement = require('../../helper/session');
exports.isUserExist = function (req,res) {
    //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [TEXT] user : username of person to query
    //  ----------------- OUTPUT PARAMETERS -------------------
    //  [TRUE STATE]
    //  "statu": true,
    //  "message":"USER_EXIST"
    //
    //  [FALSE STATE]
    //  "statu": false
    //  "message": "NO_SUCH_USER"
    //  </Summary>
    var Client = SessionManagement.getClient(req.username);
    var user   = req.body.user;

    if(Client !== null && Client.isConnected()) 
    {
        SessionManagement.executeSshCommand(Client, `getent passwd ${user}`).then((exist)=>{
            if (exist.length > 0){
                return res.status(200).json({
                    statu:true,
                    message:"USER_EXIST",
                });
            }
            else{
                return res.status(200).json({
                    statu:false,
                    message:"NO_SUCH_USER",
                });
            }
        }).catch((err)=>{
            return res.status(400).json({
                statu:false,
                message:err,
            });
        })
    }
    else
    {
        return res.json({
            statu:false,
            message:"SESSION_NOT_STARTED"
        });
    }
}
