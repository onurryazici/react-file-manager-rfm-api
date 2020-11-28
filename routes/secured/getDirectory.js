var fs = require('fs');
var path = require('path');
const { exec } = require("child_process");
exports.getDirectory = function (req,res) {
    var location = req.body.location;
    const files = fs.readdirSync(location);
    const sorted = files.sort((itemA,itemB)=>{
        var statA = fs.statSync(location + "/" + itemA);
        var statB = fs.statSync(location + "/" + itemB);
        if(statA.isDirectory() && !statB.isDirectory()){
            return -1; 
        }
        else if(!statA.isDirectory() && statB.isDirectory())
        {
            return 1;
        }
        else {
            return itemA.localeCompare(itemB); 
        }   
    });
    const outputStack = [];
    sorted.forEach((item) => {
        var properties = getPropertyOfItem(location + "/" + item);
        var permissions = getPermissionsOfItem(location + "/" + item)
        outputStack.push(properties);
    })
    return res.json({items:outputStack});
}
function getPropertyOfItem(item){
    let properties={
        type:"",
        name:"",
        extension:"",
        size:"",
        created:"",
        modified:""
    };
    let itemStatu        = fs.statSync(item); 
    let x                = Math.floor(Math.log(itemStatu.size) / Math.log(1024));
    let itemSize         = (itemStatu.size / Math.pow(1024,x)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][x];
    properties.type      = itemStatu.isDirectory() ? "folder" : "file";
    properties.name      = item.split('/').pop();
    properties.extension = path.extname(item);
    properties.created   = itemStatu.ctime.toLocaleString();
    properties.modified  = itemStatu.mtime.toLocaleString();
    properties.size      = itemSize;
    return properties;
}

function getPermissionsOfItem(item){
    let permissions = {
        owner:"",
        
    }
}
function getSharedUsers(){

}
/*
[
    {
        type:"folder",
        name:"abc.txt",
        extension:"txt",
        size:"420kb",
        created:"12/11/2020 15:50",
        
    },
    {
        type:"file",
        name:"abc",
        extension:"txt",
        size:"420kb",
        created:"12/11/2020 15:50",
        
    },
]

*/