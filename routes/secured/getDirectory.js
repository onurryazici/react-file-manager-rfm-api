var fs = require('fs');
var path = require('path');
const { execSync, exec, spawnSync, spawn } = require("child_process");
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
        var permissions = getUserOwnPermissionsOfItem(itemPath, username);
        var sharedWith  = [getSharedUsersWithPermissionOfItem(itemPath)];
        var output      = Object.assign({},properties, permissions,sharedWith);
        outputStack.push(output);
    })
    return res.json({items:outputStack});
}
////++++
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
////++++
function getOwnerNameOfItem(item){
    const itemPath = item.replace(/\s/g,'\\ ');
    const ownerName = execSync(`ls -ld ${itemPath} | awk {'print $3'}`).toString().trimEnd(); // GET OWNER NAME output:username
    return ownerName;
}
/////++++
function getUserOwnPermissionsOfItem(item,usernameParam){
    let permissions = {
        canRead:false, 
        canWrite:false,
        canExecute:false,
    }
    const itemPath = item.replace(/\s/g,'\\ ');
    const ownerName = getOwnerNameOfItem(item);
    const userIsowner = (ownerName === usernameParam) ? true : false;
    const command = (userIsowner) 
        ? `getfacl -cp ${itemPath} | grep 'user::'`
        : `getfacl -cp ${itemPath} | grep 'user:${usernameParam}:'`;
    const commandOutput = spawnSync('sh',['-c',command],{encoding:'utf8'}).stdout;
    /////// OUTPUT FORMAT //////////////
    //
    //     user  :    USERNAME     :   rwx
    //     [0]           [1]           [2]
    //
    ////////////////////////////////////
    if(commandOutput.length!==0)
    {
        const parsed = commandOutput.split(":"); 
        const rwx = parsed[2];
        (rwx.charAt(0)==="r")?
            permissions.canRead = true
            : permissions.canRead = false;
            
        (rwx.charAt(1)==="w")?
            permissions.canWrite = true
            : permissions.canWrite = false;
            
        (rwx.charAt(2)==="x" || rwx.charAt(2)==="X")?
            permissions.canExecute = true
            : permissions.canExecute = false;
    }
    else{
        // İzni yok demektedir.
    }
    /*console.log("Owner    : " + ownerName);
    console.log("Command  : " + command);
    console.log("Item     : " + itemPath);
    console.log("Result   : " + commandOutput);
    console.log("===================");*/
    return permissions;
}
//////////////// !!!!!!
function getSharedUsersWithPermissionOfItem(item){
    let sharedWith = [];
    let struct = {
        username:"",
        read:false,
        write:false,
        execute:false
    }
    const itemPath = item.replace(/\s/g,'\\ ');
    const command = `getfacl -cp ${itemPath} | grep 'user:'`;
    const commandOutput = spawnSync('sh',['-c',command],{encoding:'utf8'}).stdout;
    // ////////// COMMAND OUTPUT FORMAT /////////////
    // user     :   user1      :    rwx \n  | line[0]   FIRST LINE IS OWNER.
    // user     :   user2      :    r-x \n  | line[1]
    // user     :   user3      :    --x \n  | line[2]
    //  data[0] :  data[1]     :    data[2] | .......   
    /////////////////////////////////////////////////
    console.log("Command  : " + command);
    console.log("Item     : " + itemPath);
    console.log("Result   : \n" + commandOutput);
    console.log("===================");
    var lines = commandOutput.split('\n');

    for(let i=0 ; i < lines.length ; i++)
    {    
        var parsed         = lines[i].toString().split(':'); // OUTPUT ARRAY: [user,USER_NAME,rwx]
        var username       = parsed[1];
        
        let owner = "";
        if(username!=='')
        {
            
        }
        else
        {
            // IF USER IS OWNER
            const owner = getOwnerNameOfItem(itemPath);
        }
        var userPermission = parsed[2];
            //console.log("ITEM     : " + item);
            //console.log("LINE     : " + lines[i]);
            //console.log("USERNAME : " +username.length);
        userPermission.charAt(0)==="r" 
            ? struct.read = true
            : struct.read = false;
        userPermission.charAt(1)==="w" 
            ? struct.write=true
            : struct.write=false;
        userPermission.charAt(2)==="x" || userPermission[2]==="X" 
            ? struct.execute=true
            : struct.execute=false;
                
        struct.username=username;
        sharedWith.push(struct);
        //console.log("------------------------------");
    }
    //console.log("=======================");
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