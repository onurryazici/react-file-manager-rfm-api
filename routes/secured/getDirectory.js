var fs = require('fs');
var helpers = require('../../helper/functions/functions');

exports.getDirectory = function (req,res) {
    var encryptedLocation   = req.query.location;
    var username            = req.query.username;
    var showHiddenFiles     = (req.query.showHiddenFiles === "yes") ? true : false;
    var location            = Buffer.from(encryptedLocation,'base64').toString('ascii');
    const files             = fs.readdirSync(location);

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
        var itemIsHidden  = ( /^\..*/.test(item))
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
    return res.json({items:outputStack});
}

