var SshSession      = require('../../helper/session');
var HelperFunctions = require('../../helper/functions');
exports.addToDrive = function (req,res) {
    //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [ARRAY(TEXT)] items  : Item addresses to create copy of items
    //  ----------------- OUTPUT PARAMETERS -------------------
    //  [TRUE STATE]
    //  "statu": true,
    //  "message":"PROCESS_SUCCESS"
    //
    //  [FALSE STATE]
    //  "statu": false
    //  "message": "error"
    //  </Summary>

    var Client         = SshSession.getClient(req.username);
    var unparsedItems  = req.body.items;
    var target         = `/home/${req.username}/drive`

    if(Client !== null && Client.isConnected()) 
    {
        ParseItems(target,unparsedItems).then((items)=>{
            const _target = HelperFunctions.replaceSpecialChars(target);
            const updatePermissionCommand = `setfacl -Rbk ${items.map(e=>e.newPath).join(' ')} && setfacl -Rm o:--x ${items.map(e=>e.newPath).join(' ')}` /// önemli izinleri sıfırlar otherlar : --x
            const command = `CopyItem.run ${_target} ${items.map(e=>e.oldPath).join(' ')} && ${updatePermissionCommand}`;
            console.log(command)
            SshSession.executeSshCommand(Client, command).then(()=>{
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
function ParseItems(target,unparsedItems){
    return new Promise((resolve,reject)=>{
        let parsedItems = []
        unparsedItems.forEach(item => {
            let itemName = item.substring(item.lastIndexOf('/')+1, item.length)
            let newPath = target + "/" +itemName
            const payload = {
                oldPath : HelperFunctions.replaceSpecialChars(item),
                newPath : HelperFunctions.replaceSpecialChars(newPath)
            }
            parsedItems.push(payload);      
        });
        resolve(parsedItems);
    })
}