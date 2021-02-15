var API = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
exports.createCopy = async function (req,res) {
    /// INPUTS
    /// "items"    : Encoded item path with base64
    /// "target"   : Encoded target path of items with base64

    var SSH_Connection = API.getSSH();
    var encryptedItems = req.query.items;
    var target = Buffer.from(req.query.target,'base64').toString('utf-8');

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        DecryptItems(encryptedItems).then((items)=>{
            const _target = API_FUNCTIONS.replaceSpecialChars(target);
            let command = `cp -R -n ${items.join(' ')} ${_target}`;
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
function DecryptItems(encryptedItems){
    return new Promise((resolve,reject)=>{
        let decryptedItems = []
        encryptedItems.forEach(item => {
            let itemPath = Buffer.from(item,'base64').toString('utf-8');
            decryptedItems.push(API_FUNCTIONS.replaceSpecialChars(itemPath));      
        });
        resolve(decryptedItems);
    })
}