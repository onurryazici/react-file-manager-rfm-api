const API           = require('../../helper/SSH_SESSION');
const API_FUNCTIONS = require('../../helper/functions');
const mime          = require('mime');
exports.download = function (req,res) {
  /// INPUTS
  /// "location" : Encoded Current directory with base64
  /// "dirname"  : Encoded new folder name with base64

  var SSH_Connection      = API.getSSH();
  var SSH_User            = API.getUsername();
  var items               = req.query.items;
  if(SSH_Connection !== null && SSH_Connection.isConnected()) 
  {
      SSH_Connection.connection.sftp((sftp_err,sftp) => {
        if (sftp_err){
          res.status(400).json({statu:false,message:"UNKNOWN_ERROR"});
        }
        
        if(Array.from(items).length > 1)
        {
          ParseItems(items).then((parsedItems)=>{
              // MULTI DOWNLOAD 
              // COMPRESS ZIP AND DOWNLOAD
              var itemPath       = items[0];
              var itemParentPath = itemPath.substring(0,itemPath.lastIndexOf('/'));
              const zipName = "drive-" + new Date().getTime() + ".zip";
              const command = `cd ${API_FUNCTIONS.replaceSpecialChars(itemParentPath)}` 
                  +` && zip -r -0 /home/${SSH_User}/drive-downloads/${zipName} ${parsedItems.join(' ')}`

              API.executeSshCommand(command).then(()=>{
                const downloadOutput = `/home/${SSH_User}/drive-downloads/${zipName}`
                sftp.stat(downloadOutput,(err,downloadStat)=>{
                  var mimetype = mime.getType(downloadOutput);
                  res.writeHead(200,{
                    'Content-Disposition': `attachment; filename='${zipName}'`,
                    'Content-Type': mimetype,
                    'Content-Length': downloadStat.size,
                  })
                  const filestream = sftp.createReadStream(downloadOutput);
                  filestream.on('end',()=>{
                    sftp.end();
                  })
                  filestream.pipe(res)
                })
              })
          })
        }
        else
        {
          // DIRECT DOWNLOAD
          var itemPath = items[0];
          var itemParentPath = itemPath.substring(0,itemPath.lastIndexOf('/'));
          var itemName = itemPath.substring(itemPath.lastIndexOf('/')+1,itemPath.length);
          sftp.lstat(itemPath,(err,stat)=>{
            if(stat.isDirectory()){
              // COMPRESS ZIP AND DOWNLOAD
              const zipName = itemName + "-" + new Date().getTime() + ".zip";
              const command = `cd ${API_FUNCTIONS.replaceSpecialChars(itemParentPath)}` 
                  +` && zip -r -0 /home/${SSH_User}/drive-downloads/${API_FUNCTIONS.replaceSpecialChars(zipName)} ${API_FUNCTIONS.replaceSpecialChars(itemName)}`
              API.executeSshCommand(command).then(()=>{
                const downloadOutput = `/home/${SSH_User}/drive-downloads/${zipName}`
                sftp.stat(downloadOutput,(err,downloadStat)=>{
                  var mimetype = mime.getType(downloadOutput);
                  res.writeHead(200,{
                    'Content-Disposition': `attachment; filename='${zipName}'`,
                    'Content-Type': mimetype,
                    'Content-Length': downloadStat.size,
                  })
                  const filestream = sftp.createReadStream(downloadOutput);
                  filestream.on('end',()=>{
                    sftp.end();
                  })
                  filestream.pipe(res)
                })
              });
            }
            else{
              // DIRECTLY DOWNLOAD FILE
              sftp.stat(itemPath,(err,itemStat)=>{
                var mimetype = mime.getType(itemPath);
                res.writeHead(200,{
                  'Content-Disposition': `attachment; filename='${itemName}'`,
                  'Content-Type': mimetype,
                  'Content-Length': itemStat.size,
                })
                var filestream = sftp.createReadStream(itemPath);
                var had_error = false;
                filestream.on('end',()=>{
                  sftp.end();
                })
                filestream.pipe(res).on('error',(err)=>{
                  had_error = true;
                }).on('close',()=>{
                  if (!had_error)
                    console.log("hata yok ")
                  else 
                    console.log("hata var")
                })
              })
            }
          })
        }
    });
  }
  else{
      res.json({
          statu:false,
          message:"SESSION_NOT_STARTED"
      });
  }
}


function ParseItems(unparsedItems){
  return new Promise((resolve,reject)=>{
      let parsedItems = []
      unparsedItems.forEach(item => {
          var itemPath = API_FUNCTIONS.replaceSpecialChars(item);
          var itemName = itemPath.substring(itemPath.lastIndexOf('/')+1, itemPath.length)
          parsedItems.push(itemName);      
      });
      resolve(parsedItems);
  })
}
// console.log('dir ', __dirname);
/*var file = '/home/main/drive/tester/videolar/sssss.mkv';
var filename = 'sssss.mkv';
var mimetype = mime.getType(file);
console.log(mimetype+"wwwwwwwwwwwww");
res.setHeader('Content-disposition', 'attachment; filename=' + filename);
res.setHeader('Content-type', mimetype);
var filestream = sftp.createReadStream(file);
filestream.pipe(res);*/



/*var base64Data = [];
var dataLength=0;
console.log(item+"xxxxxxxxxxxxxxxxx")
var file = sftp.createReadStream(item)
file.on('data',(chunk)=>{
    base64Data.push(chunk);
    dataLength += chunk.length;
})
file.on('end',()=>{
    var dataBuffer = Buffer.concat(base64Data,dataLength);
    const img = Buffer.from(dataBuffer).toString('base64')
    res.download(img)
})*/