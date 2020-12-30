var fs       = require('fs');
var helpers  = require('../../helper/functions/functions');
var API      = require('../../helper/SSH_SESSION');
var API_ROOT = require('../../helper/API_ROOT'); // In root will be absolute path to your ../../helper/APP_ROOT
var SSH2Promise = require('ssh2-promise');

var path = require('path');
var appDir = path.dirname(require.main.filename);
exports.getDirectory = async function (req,res) {
    var SSH_Connection      = API.getSSH();
    var username            = API.getUsername();
    var encryptedLocation   = req.query.location;
    var location            = Buffer.from(encryptedLocation,'base64').toString('ascii');
    const outputStack       = [];
    var formattedCurrentLocation   = location.replace(/\s/g,'\\ ');

    
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        var command = `GetDirectoryData.run "/home/main" "main"`;
       const results = await API.executeSshCommand(command);
       //results.then((data)=>console.log(data));
       console.log(results);
       
       //res.json({item:JSON.parse(results)});
        /*SSH_Connection.execCommand(command,{ stream: 'stdout', options: { pty: true } })
                .then(function(result){
                    var commandOutput = await result.stdout.toString();
                    return commandOutput;
                })
                .then((data)=>{
                    res.json({item:JSON.parse(data)});
                }).catch((error)=>{
                    console.log("hata var " + error)
                })*/
        
        /*var output          = Object.assign({},properties, permissions,sharedWith)
        outputStack.push(output);
        var get
        res.json({
            statu:true,
            items:properties
        }); */ 
    }
    else{
        res.json({
            statu:false,
        });
    }


    // ls komutu değiştirilebilir
   /* let command = showHiddenFiles ? `cd ${location} && ls -a --sort=extension` : `cd ${location} && ls --sort=extension`
    SSH_Connection.execCommand(command,{cwd:formattedCurrentLocation,stream: 'stdout', options: { pty:true } })
        .then(function(result) {
          return helpers.getItemPropertiesInDirectory(formattedCurrentLocation);
        }).then((data)=>{
            res.json({
                statu:true,
                result:data
            });
        })
        .catch((error)=>{
            res.json({
                statu:false,
            });
        });*/
    /*SSH_Connection.exec(command, (error,stream) => {
        if (error){
            throw err;/////////////////////////////////
        } 
        else{
            var items;
            stream.on('data', function(data) {
                items = data.toString().split('\n').filter((item)=> item!= ""); /// Boş çıktıları temizle  
            });
            stream.on('close',(code,signal)=>{
                //items.forEach((item)=>{
                    var unformattedPath = location + "/" +items[1];
                    var properties      = helpers.getPropertyOfItem(unformattedPath);
                   // var permissions     = helpers.getUserOwnPermissionsOfItem(formattedPath, username);
                   // var sharedWith      = helpers.getSharedUsersWithPermissionOfItem(formattedPath);
                   // var output          = Object.assign({},properties, permissions,sharedWith)
                    console.log(properties);
                //});
            })
            
        }*/
    
    
/*
    const sorted = files.sort((itemA,itemB) => {
        var statA               = fs.statSync(location + "/" + itemA);
        var statB               = fs.statSync(location + "/" + itemB);

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
    sorted.filter(item => /(^|\/)\.[^/.]/g.test(item));
    
    sorted.forEach((item) => {
        var itemIsHidden  = ( /^\...test(item))
        if( (showHiddenFiles === false && itemIsHidden === false) || (showHiddenFiles))
        {
            var unformattedPath = location + "/" +item;
            var formattedPath   = unformattedPath.replace(/\s/g,'\\ ');
            var properties      = helpers.getPropertyOfItem(unformattedPath);
            var permissions     = helpers.getUserOwnPermissionsOfItem(formattedPath, username);
            var sharedWith      = helpers.getSharedUsersWithPermissionOfItem(formattedPath);
            var output          = Object.assign({},properties, permissions,sharedWith)
            outputStack.push(output);
        }
    })
    return res.json({items:outputStack});*/
}