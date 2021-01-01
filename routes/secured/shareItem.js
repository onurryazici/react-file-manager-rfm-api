var API = require('../../helper/SSH_SESSION');

exports.shareItem = function (req,res) {
    var SSH_Connection = API.getSSH();
    var encryptedItems = req.query.items;
    var decryptedItems = [];
    var userAndPermissions = req.query.users;
    
    var shareConfig={
        username:"",
        read:false,
        write:false,
        execute:false,
    };

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        for(let item of encryptedItems) {
            var itemName = Buffer.from(item,'base64').toString('ascii') ;
            decryptedItems.push(itemName);
        }

        var users_val=[];
        userAndPermissions.map((data) => {
            users_val.push("u:" + data);
        });



        var command = `setfacl -Rm ${users_val} ${decryptedItems.join(' ')}`;
        API.executeSshCommand(command)
        .then((data)=>{
            res.status(200).json({
                statu:true,
                message:"PROCESS_SUCCESS"
            });
        }).catch((err)=>{
            res.status(400).json({statu:false,items:[]})
        })
    }
    else
    {
        res.json({
            statu:false,
            message:"SESSION_NOT_STARTED"
        });
    }
}