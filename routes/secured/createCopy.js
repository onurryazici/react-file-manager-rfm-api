var SessionManagement      = require('../../helper/session');
var HelperFunctions = require('../../helper/functions');
exports.createCopy = async function (req,res) {
    //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [ARRAY(TEXT)] items  : Item addresses to create copy of items
    //  [TEXT]        target : Target location to create copy of items 
    //  ----------------- OUTPUT PARAMETERS -------------------
    //  [TRUE STATE]
    //  "statu": true,
    //  "message":"PROCESS_SUCCESS"
    //
    //  [FALSE STATE]
    //  "statu": false
    //  "message": "error"
    //  </Summary>

    var Client         = SessionManagement.getClient(req.username);
    var unparsedItems  = req.body.items;
    var target         = req.body.target;

    if(Client !== null && Client.isConnected()) 
    {
        ParseItems(unparsedItems).then((items)=>{
            const _target = HelperFunctions.replaceSpecialChars(target);
            const updatePermissionCommand = `setfacl -Rbk ${items.join(' ')} ` /// önemli izinleri sıfırlar otherlar : --x
            const command = `CopyItem.run ${_target} ${items.join(' ')} && ${updatePermissionCommand}`;
            SessionManagement.executeSshCommand(Client, command).then(()=>{
                res.status(200).json({
                    statu:true,
                    message:"PROCESS_SUCCESS",
                });
            }).catch((err)=>{
                res.status(400).json({statu:false,message:err})
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
            parsedItems.push(HelperFunctions.replaceSpecialChars(item));      
        });
        resolve(parsedItems);
    })
}