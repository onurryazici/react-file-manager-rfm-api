const Messages           = require('../../helper/message');
const SessionManagement         = require('../../helper/session');
const HelperFunctions    = require('../../helper/functions');
const RFM_WindowType     = {
    DRIVE:"DRIVE",
    SHARED_WITH_ME:"SHARED_WITH_ME",
    MY_SHARED:"MY_SHARED",
    RECYCLE_BIN:"RECYCLE_BIN"
}
exports.getDataSingle = function (req,res) {
    //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [TEXT]    targetPath     : Address of the item to display 
    //
    //  ----------------- OUTPUT PARAMETERS -------------------
    //  [TRUE STATE]
    //  "statu": true,
    //  "item": {
    //      "owner": "root",
    //      "extension": "",
    //      "lastAccessTime": "03-05-2021 08:57",
    //      "read": true,
    //      "lastModifyTime": "03-05-2021 08:57",
    //      "name": ".drive-downloads",
    //      "absolutePath": "/home/.drive-downloads",
    //      "type": "directory",
    //      "sharedWith": [],
    //      "write": false,
    //      "execute": true
    //  }
    //  "dirCanWritable": false
    //
    //  [FALSE STATE]
    //  "statu": false
    //  "item": {}
    //  "message": ""
    //  </Summary>
    var Client     = SessionManagement.getClient(req.username);
    var targetPath = HelperFunctions.replaceSpecialChars(req.body.targetPath);

    if(Client !== null && Client.isConnected()) {   
        var command = `GetDataSingle.run ${targetPath}`;
        SessionManagement.executeSshCommand(Client, command).then((output)=>{
            const data = JSON.parse(output)
            if(data.statu) {
                res.status(200).json(JSON.parse(output));
            }
            else {
                console.log("11111")
                console.log(data)
                res.status(400).json({statu:false, item:{},message:"Böyle bir öğe yok"});
            }
        }).catch((err)=>{
            console.log("2222 " + err)
            res.status(400).json({statu:false,items:[],message:err})
        })
    }
    else{
        res.json({
            statu:false,
            message:Messages.SESSION_NOT_STARTED
        });
    }
}