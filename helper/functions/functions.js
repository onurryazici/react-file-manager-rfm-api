
var fs = require('fs');
var path = require('path');
const { execSync, exec, spawnSync } = require("child_process");

module.exports = {
    getPropertyOfItem :function(item){
        let properties={
            type:"",
            name:"",
            extension:"",
            owner:"",
            size:"",
            created:"",
            modified:""
        };
        let formattedPath    = item.replace(/\s/g,'\\ ');
        let itemStatu        = fs.statSync(item); 
        let x                = Math.floor(Math.log(itemStatu.size) / Math.log(1024));
        let itemSize         = (itemStatu.size / Math.pow(1024,x)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][x];
        properties.type      = itemStatu.isDirectory() ? "folder" : "file";
        properties.name      = item.split('/').pop();
        properties.extension = path.extname(item);
        properties.owner     = this.getOwnerNameOfItem(formattedPath);
        properties.created   = itemStatu.ctime.toLocaleString();
        properties.modified  = itemStatu.mtime.toLocaleString();
        properties.size      = itemSize;
        return properties;
    },
    getOwnerNameOfItem: function(itemPath){
        var ownerName = execSync(`ls -ld ${itemPath} | awk {'print $3'}`).toString().trimEnd(); // GET OWNER NAME output:username
        return ownerName;
    },
    getUserOwnPermissionsOfItem: function(itemPath,usernameParam){
        let permissions = {
            canRead:false, 
            canWrite:false,
            canExecute:false,
        }
        var ownerName = this.getOwnerNameOfItem(itemPath);
        var userIsowner = (ownerName === usernameParam) ? true : false;
        var command = (userIsowner) 
            ? `getfacl -cp ${itemPath} | grep 'user::'`
            : `getfacl -cp ${itemPath} | grep 'user:${usernameParam}:'`;
        var commandOutput = spawnSync('sh',['-c',command],{encoding:'utf8'}).stdout;
        /////// OUTPUT FORMAT //////////////
        //
        //     user  :    USERNAME     :   rwx
        //     [0]           [1]           [2]
        //
        ////////////////////////////////////
        if(commandOutput.length!==0)
        {
            var parsed = commandOutput.split(":"); 
            var rwx = parsed[2];
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
    },
    getSharedUsersWithPermissionOfItem: function (itemPath){
        var output = {sharedUsers:[]};
        var command = `getfacl -cp ${itemPath} | grep 'user:'`;
        var commandOutput = spawnSync('sh',['-c',command],{encoding:'utf8'}).stdout;
        // ////////// COMMAND OUTPUT FORMAT /////////////
        // user     :   user1      :    rwx \n  | line[0]   FIRST LINE IS OWNER.
        // user     :   user2      :    r-x \n  | line[1]
        // user     :   user3      :    --x \n  | line[2]
        //  data[0] :  data[1]     :    data[2] | .......   
        /////////////////////////////////////////////////
        
        var lines = commandOutput.split('\n');
        console.log("Command  : " + command);
        console.log("Item     : " + itemPath);
        console.log("Result   : " + commandOutput);
        for(let i=0 ; i < (lines.length -1); i++)
        {    
            var struct = {
                username:"",
                read:false,
                write:false,
                execute:false
            }
            var parsed = lines[i].toString().split(':'); // OUTPUT ARRAY: [user,USER_NAME,rwx]
            var username = parsed[1];
            
            var owner = "";
            if(username==="")
            {
                /// THEN HE/SHE IS OWNER
                owner = this.getOwnerNameOfItem(itemPath);
                isOwner = true;
                username = owner;
            }
            var userPermission = parsed[2];
            struct.username = username;
            //console.log("PARSED[1]: " + parsed[1]);
            //console.log("Username : " + username);
            //console.log("Owner    : " + owner);
            userPermission.charAt(0)==='r' 
                ? struct.read = true
                : struct.read = false;
            userPermission.charAt(1)==='w' 
                ? struct.write=true
                : struct.write=false;
            userPermission.charAt(2)==='x' || userPermission[2]==='X' 
                ? struct.execute=true
                : struct.execute=false;
                    
            output.sharedUsers.push(struct);
        }
        return output;
    }
}
