var API = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
exports.moveItems = function (req,res) {
    var SSH_Connection = API.getSSH();
    var unparsedItems  = req.body.items;
    var target         = req.body.target;

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        
        ParseItems(unparsedItems).then((items)=>{
            target = API_FUNCTIONS.replaceSpecialChars(target);
            let command = `MoveItem.run  ${items.join(' ')} ${target}  `;
            console.log(command);
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