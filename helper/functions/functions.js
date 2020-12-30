
var fs = require('fs');
var path = require('path');
const { execSync, spawnSync } = require("child_process");
var API     =require('../../helper/SSH_SESSION');
var helper = require('../../helper/functions/functions');
module.exports = {
    getItemPropertiesInDirectory :function(currentLocation){
        return new Promise((resolve,reject)=>{
            var propertiesStack=[];
            var formattedCurrentPath = currentLocation.replace(/\s/g,'\\ ');
            var command              = `stat --format "%F:^:%n:^:%N:^:%U:^:%s:^:%x:^:%y" *`;
            var SSH_Connection       = API.getSSH();

            SSH_Connection.execCommand(command,{cwd:formattedCurrentPath,stream: 'stdout', options: { pty: true } })
                .then(function(result){
                    var commandOutput = result.stdout.toString();
                    return commandOutput;
                })
                .then((output)=>{
                    var items = output.split('\n');
                    items.forEach((item)=>{
                        var parsed = item.split(':^:');
                        var properties={
                            type:"",            // %F parsed[0]
                            name:"",            // %n parsed[1]
                            absolutePath:"",    // %N parsed[2]
                            owner:"",           // %U parsed[3]
                            size:"",            // %s parsed[4]
                            lastAccessTime:"",  // %x parsed[5]
                            lastModifyTime:"",  // %y parsed[6]
                        };
                        
                        properties.type           = parsed[0];
                        properties.name           = parsed[1];
                        properties.absolutePath   = parsed[2];
                        properties.owner          = parsed[3];
                        properties.size           = parsed[4];
                        properties.lastAccessTime = parsed[5].toString().substring(0,19);
                        properties.lastModifyTime = parsed[6].toString().substring(0,19);
                        propertiesStack.push(properties);
                    });
                    resolve(propertiesStack);
                })          
                .catch((error)=>{
                    reject([]);
                });
            })
        
        ////////////////////////////////////////////////////////////////////////////
        /// fileType:fileName:symlinkLocation:size:ownerName:modifiedDate
        ////////////////////////////////////////////////////////////////////////////
        /*var SSH_Connection   = API.getSSH();
        SSH_Connection.exec(command, (error,stream) => {
            var commandOutput="";
            if(error){
                throw error;
            }
            else{
                stream.on('data', function(data){
                    commandOutput=data.toString();
                    console.log(commandOutput+"xx");
                });
                stream.on('close', function(code,signal){

                });
            }
        });*/
        /*let itemStatu        = fs.statSync(item); 
        let x                = Math.floor(Math.log(itemStatu.size) / Math.log(1024));
        let itemSize         = (itemStatu.size / Math.pow(1024,x)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][x];
        properties.type      = itemStatu.isDirectory() ? "folder" : "file";
        properties.name      = item.split('/').pop();
        properties.extension = path.extname(item);
        properties.owner     = this.getOwnerNameOfItem(formattedPath);
        properties.created   = itemStatu.ctime.toLocaleString();
        properties.modified  = itemStatu.mtime.toLocaleString();
        properties.size      = itemSize;*/
    },
    getOwnerNameOfItem: function(itemPath){
        var ownerName = execSync(`ls -ld ${itemPath} | awk {'print $3'}`).toString().trimEnd(); // GET OWNER NAME output:username
        return ownerName;
    },
    getUserOwnPermissionsOfItem: function(itemPath,formattedCurrentPath){
        return new Promise((resolve,reject)=>{
            let permissions = {
                canRead:false, 
                canWrite:false,
                canExecute:false,
            }
            var SSH_Connection       = API.getSSH();
            var SSH_Username         = API.getUsername();
            var ownerName = "main";
            var userIsowner = (ownerName === SSH_Username) ? true : false;
            var command = (userIsowner) 
                ? `getfacl -cp ${itemPath} | grep 'user::'`
                : `getfacl -cp ${itemPath} | grep 'user:${SSH_Username}:'`;
            SSH_Connection.execCommand(command,{cwd:formattedCurrentPath,stream: 'stdout', options: { pty: true } })
                .then(function(result){
                    var commandOutput = result.stdout.toString();
                    return commandOutput;
                })
                .then((commandOutput)=>{
                    /////// OUTPUT FORMAT /////////////////
                    //     user  :    USERNAME     :   rwx
                    //     [0]           [1]           [2]
                    ///////////////////////////////////////
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
                    resolve(permissions);  
                })
        })
    },
    getSharedUsersWithPermissionOfItem: function (itemPath,formattedCurrentPath){
        var output = {sharedUsers:[]};
        var SSH_Connection       = API.getSSH();
        var command = `getfacl -cp ${itemPath} | grep 'user:'`;

        SSH_Connection.execCommand(command,{cwd:formattedCurrentPath,stream: 'stdout', options: { pty: true } })
        .then(function(result){
            var commandOutput = result.stdout.toString();
            return commandOutput;
        })
        .then((commandOutput)=>{
            // ////////// COMMAND OUTPUT FORMAT /////////////
            // user     :   user1      :    rwx \n  | line[0]   FIRST LINE IS OWNER.
            // user     :   user2      :    r-x \n  | line[1]
            // user     :   user3      :    --x \n  | line[2]
            //  data[0] :  data[1]     :    data[2] | .......   
            /////////////////////////////////////////////////
            
            var lines = commandOutput.split('\n');
            /*console.log("Command  : " + command);
            console.log("Item     : " + itemPath);
            console.log("Result   : " + commandOutput);*/
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
        });
        
    },
    isIpBanned: function(userIp){
        /*
        **  var command='echo "<password>" | sudo -S "<command that needs a root access>"';
        **  child_process.execSync(command)
        */


        /// Komut çıktısı yanlış veriyor
        var command='echo qweqweasd | sudo -S fail2ban-client status sshd | grep "'+ userIp +'"'; /*** ROOT ERİŞİMİ */
        var commandOutput = spawnSync('sh',['-c',command],{encoding:'utf8'}).stdout;
        
        if(commandOutput.length > 0){
            return true;
        }
        else {
            return false;
        }
    }
}
