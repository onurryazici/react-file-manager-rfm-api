var API = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
exports.moveToDrive    = function (req,res) {
    var SSH_Connection = API.getSSH();
    var unparsedItems  = req.body.items;
    var SSH_User       = API.getUsername();

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        
        ParseItems(unparsedItems).then((items)=>{
            var target  = `/home/${SSH_User}/drive`;
            let command = `MoveItem.run  ${target} ${items.join(' ')}`;
            API.executeSshCommand(command)
                .then(()=>{
                    res.status(200).json({
                        statu:true,
                        message:"PROCESS_SUCCESS",
                    });
                }).catch((err)=>{
                    res.status(404).json({statu:false,message:err})
                })
        });
    }
    else{
        res.json({
            statu:false,
            message:"SESSION_NOT_STARTED"
        });
    }
}

function ParseItems(unparsedItems){
    return new Promise((resolve,reject)=>{
        let parsedItems = []
        unparsedItems.forEach(item => {
            parsedItems.push(API_FUNCTIONS.replaceSpecialChars(item));      
        });
        resolve(parsedItems);
    })
}