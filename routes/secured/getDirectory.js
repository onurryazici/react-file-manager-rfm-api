var fs = require('fs');
var path = require('path');
const { execSync, exec } = require("child_process");
exports.getDirectory = function (req,res) {
    var location = encodeURI(req.body.location);
    var username = req.body.username;

    const files  = fs.readdirSync(location);
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
        var itemPath = location + "/" +item;

    
        var properties  = getPropertyOfItem(itemPath); ////////////////////+++
        var permissions = getUserOwnPermissionsOfItem(itemPath, username);//++
        var sharedWith  = getSharedUsersWithPermissionOfItem(itemPath);
        var output      = Object.assign({},properties, permissions,sharedWith);
        outputStack.push(output);
    })
    return res.json({items:outputStack});
}

function getPropertyOfItem(item){
    let properties={
        type:"",
        name:"",
        extension:"",
        owner:"",
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
    properties.owner     = getOwnerNameOfItem(item);
    properties.created   = itemStatu.ctime.toLocaleString();
    properties.modified  = itemStatu.mtime.toLocaleString();
    properties.size      = itemSize;
    return properties;
}

function getOwnerNameOfItem(item){
    const itemPath = item.replace(/\s/g,'\\ ');
    const ownerName = execSync(`ls -ld ${itemPath} | awk {'print $3'}`).toString().trimEnd(); // GET OWNER NAME output:username
    return ownerName;
}

function getUserOwnPermissionsOfItem(item,username){
    let permissions = {
        read:false, 
        write:false,
        execute:false,
    }
    const itemPath = item.replace(/\s/g,'\\ ');
    const commandOutput = execSync(`getfacl -cp ${itemPath} | grep 'user::'`).toString().trimEnd();
    /////// OUTPUT FORMAT //////////////
    //
    //     user  :       :   rwx
    //     [0]      [1]      [2]
    //
    ////////////////////////////////////
    const parsed = commandOutput.split('::');
    const rwx = parsed[1];
    
    (rwx.charAt(0)==="r")?
        permissions.read = true
        : permissions.read = false;
    
    (rwx.charAt(1)==="w")?
        permissions.write = true
        : permissions.read = false;
    
    (rwx.charAt(2)==="x" || rwx.charAt(2)==="X")?
        permissions.execute = true
        : permissions.read = false;
    return permissions;
}
function getSharedUsersWithPermissionOfItem(item){
    let sharedWith = [];
    let sharedUserStruct = {
        username:"",
        read:false,
        write:false,
        execute:false
    }
    const itemPath = item.replace(/\s/g,'\\ ');
    const commandOutput = execSync(`getfacl -cp ${itemPath} | grep 'user'`).toString();
    // ////////// COMMAND OUTPUT FORMAT /////////////
    // user     :   user1      :    rwx \n  | line[0]  
    // user     :   user2      :    r-x \n  | line[1]
    // user     :   user3      :    --x \n  | line[2]
    //  data[0] :  data[1]     :    data[2] | .......   
    /////////////////////////////////////////////////

    console.log("=======================");
    console.log("=======================");
    var lines = commandOutput.split('\n');
    console.log("item path : " + itemPath);
    console.log(lines);
    for(var i=0 ; i < lines.length ; i++)
    {    
        var data = lines[i].toString().split(':');
        var username = data[1];
        var userPermission = data[2];
        
        /*userPermission.charAt(0)==="r" ?
                sharedUserStruct.read = true
                :
                sharedUserStruct.read = false;
            userPermission.charAt(1)==="w" ?
                sharedUserStruct.write=true
                :
                sharedUserStruct.write=false;
            userPermission.charAt(3)==="x" || userPermission[2]==="X" ?
                sharedUserStruct.execute=true
                :
                sharedUserStruct.execute=false;*/
        if(username!=='')
        {
            sharedUserStruct.username = username;
            
        }
        else{
            sharedUserStruct.username = getOwnerNameOfItem(item);
        }
        sharedWith.push(sharedUserStruct);
       
        console.log("------------------------------");
    }
    console.log("=======================");
    console.log("=======================");
    return sharedWith;
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