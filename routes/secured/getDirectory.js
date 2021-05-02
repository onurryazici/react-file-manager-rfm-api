const Messages = require('../../helper/message');
var API      = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
const RFM_WindowType = {
    DRIVE:"DRIVE",
    SHARED_WITH_ME:"SHARED_WITH_ME",
    MY_SHARED:"MY_SHARED",
    RECYCLE_BIN:"RECYCLE_BIN"
}
exports.getDirectory = async function (req,res) {
    // location       : Encrypted folder location with base64
    // isItRecycleBin : For viewing trash [true,false]

    
    var SSH_Connection           = API.getSSH();
    var SSH_User                 = API.getUsername();
    var location                 = API_FUNCTIONS.replaceSpecialChars(req.body.location);
    var rfmWindow                = req.body.rfmWindow

    if(SSH_Connection !== null && SSH_Connection.isConnected()) {   
        var target  = location;
        var command = `GetData.run ${target}`;
        console.log(command)
        API.executeSshCommand(command).then((output)=>{
            const data = JSON.parse(output)
            if(data.items.length > 0) {
                if(rfmWindow === RFM_WindowType.RECYCLE_BIN){
                    return new Promise((resolve,reject)=>{
                        GetRecycleInfo(output,SSH_User).then((responseOutput)=>{
                            res.status(200).json(responseOutput);
                        })
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


function GetRecycleInfo(data,SSH_User){
    return new Promise((resolve,reject)=>{
        var originalData = JSON.parse(data);
        var itemObject = originalData.items;
        var newItemObject = [];
        var promises = [];
        
        return new Promise((resolve)=> { 
            for (let i = 0; i < Array.from(itemObject).length; i++) 
            {
                var p = new Promise(resolve => {
                    const recycleInfoLocation = `/home/${SSH_User}/.local/share/Trash/info/${API_FUNCTIONS.replaceSpecialChars(itemObject[i].name)}.trashinfo`
                    API.executeSshCommand(`cat ${recycleInfoLocation} | head -2 | tail -1 | cut -c 6-`).then((out)=>{
                        itemObject[i].restorePath = API_FUNCTIONS.replaceSpecialChars(out);
                        newItemObject.push(itemObject[i])
                        resolve();
                    }).catch((errr)=>{
                        reject();
                    })
                });
                promises.push(p);
                if(i === Array.from(itemObject).length - 1){
                    resolve();
                } 
            }
        }).then(()=>{
            Promise.all(promises).then(()=>{
                originalData.items = newItemObject;
                resolve(originalData)
            })
            
        });
    })
}