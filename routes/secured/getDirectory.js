const Messages = require('../../helper/message');
var API      = require('../../helper/SSH_SESSION');
var HelperFunctions = require('../../helper/functions');
const RFM_WindowType = {
    DRIVE:"DRIVE",
    SHARED_WITH_ME:"SHARED_WITH_ME",
    MY_SHARED:"MY_SHARED",
    RECYCLE_BIN:"RECYCLE_BIN"
}
exports.getDirectory = function (req,res) {
    // location       : Encrypted folder location with base64
    // isItRecycleBin : For viewing trash [true,false]

    
    var Client     = API.getClient(req.username);
    var username   = req.username//API.getUsername();
    var location   = HelperFunctions.replaceSpecialChars(req.body.location);
    var rfmWindow  = req.body.rfmWindow

    if(Client !== null && Client.isConnected()) {   
        var target  = location;
        var command = `GetData.run ${target}`;
        console.log(command)
        API.executeSshCommand(Client, command).then((output)=>{
            const data = JSON.parse(output)
            if(Array.from(data.items).length > 0) {
                if(rfmWindow === RFM_WindowType.RECYCLE_BIN){
                    GetRecycleInfo(output, Client, username).then((responseOutput)=>{
                        res.status(200).json(responseOutput);
                    })
                }
                else {
                    res.status(200).json(JSON.parse(output));
                } 
            }
            else {
                res.status(200).json(JSON.parse(output));
            }
        }).catch((err)=>{
            console.log("hata var " + err)
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


function GetRecycleInfo(data,_client, _username){
    return new Promise((resolve,reject)=>{
        var originalData  = JSON.parse(data);
        var itemObject    = originalData.items;
        var newItemObject = [];
        var promises      = [];
        
        return new Promise((resolve)=> { 
            for (let i = 0; i < Array.from(itemObject).length; i++) 
            {
                var p = new Promise(resolve => {
                    const recycleInfoLocation = `/home/${_username}/.local/share/Trash/info/${HelperFunctions.replaceSpecialChars(itemObject[i].name)}.trashinfo`
                    const getInfoCommand = `cat ${recycleInfoLocation} | head -2 | tail -1 | cut -c 6-` 
                    API.executeSshCommand(_client,getInfoCommand).then((out)=>{
                        itemObject[i].restorePath = HelperFunctions.replaceSpecialChars(out);
                        newItemObject.push(itemObject[i])
                        resolve();
                    }).catch((parseError)=>{
                        reject();
                    })
                });
                promises.push(p);

                if(i === Array.from(itemObject).length - 1)
                    resolve();
            }
        }).then(()=>{
            Promise.all(promises).then(()=>{
                originalData.items = newItemObject;
                resolve(originalData)
            })
            
        });
    })
}