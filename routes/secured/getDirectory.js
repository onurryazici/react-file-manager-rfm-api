const Messages = require('../../helper/message');
var API      = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
exports.getDirectory = async function (req,res) {
    // location       : Encrypted folder location with base64
    // isItRecycleBin : For viewing trash [true,false]

    var SSH_Connection           = API.getSSH();
    var SSH_User                 = API.getUsername();
    var location                 = req.body.location;
    var isItRecycleBin           = req.body.isItRecycleBin;
    var recycleBinLocation       = `/home/${SSH_User}/.local/share/Trash/files`
    
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {   var target  = (isItRecycleBin===true) ? recycleBinLocation : location
        var command = `GetDirectoryData.run "${target}"`;
        API.executeSshCommand(command).then((output)=>{
            const data = JSON.parse(output)
            if(Array.from(data.items).length > 0) {
                if(isItRecycleBin===true){
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
            console.log(err)
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