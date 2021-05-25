var SessionManagement = require('../../helper/session');
var HelperFunctions = require('../../helper/functions');
exports.moveToDrive    = function (req,res) {
    //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [ARRAY(TEXT)] items : Item address of already shared item
    //  ----------------- OUTPUT PARAMETERS -------------------
    //  [TRUE STATE]
    //  "statu": true,
    //  "message":"PROCESS_SUCCESS"
    //
    //  [FALSE STATE]
    //  "statu": false
    //  "message": "error"
    //  </Summary>
    var Client        = SessionManagement.getClient(req.username);
    var unparsedItems = req.body.items;
    var username      = req.username;

    if(Client !== null && Client.isConnected()) 
    {
        ParseItems(unparsedItems).then((items)=>{
            var target  = `/home/${username}/drive`;
            let command = `MoveItem.run  ${target} ${items.join(' ')}`;
            SessionManagement.executeSshCommand(Client, command).then(()=>{
                return res.status(200).json({statu:true, message:"PROCESS_SUCCESS"});
            }).catch((err)=>{
                return res.status(400).json({statu:false,message:err})
            })
        })
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