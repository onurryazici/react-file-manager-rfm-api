const SshSession = require('../../helper/session');
const HelperFunctions = require('../../helper/functions');
const mime = require('mime');
exports.download = function (req, res) {
  /// INPUTS
  /// "location" : Encoded Current directory with base64
  /// "dirname"  : Encoded new folder name with base64

  var Client     = SshSession.getClient(req.username);
  var username   = req.username;
  var items      = req.query.items;
  var outputName = req.query.output;

  

  if (Client !== null && Client.isConnected()) {
    Client.connection.sftp((sftp_err, sftp) => {
      if (Array.from(items).length > 1) {
        ParseItems(items).then((parsedItems) => {
          // MULTI DOWNLOAD 
          // COMPRESS ZIP AND DOWNLOAD
          var itemPath       = items[0];
          var itemParentPath = itemPath.substring(0, itemPath.Of('/'));
          const zipName = outputName;
          const command = `cd ${HelperFunctions.replaceSpecialChars(itemParentPath)}`
            + ` && zip -r -0 /home/${username}/drive-downloads/${zipName} ${parsedItems.join(' ')}`

            SshSession.executeSshCommand(Client, command).then(() => {
            const downloadOutput = `/home/${username}/drive-downloads/${zipName}`
            sftp.stat(downloadOutput, (err, downloadStat) => {
              var mimetype = mime.getType(downloadOutput);
              res.writeHead(200, {
                'Content-Disposition': `attachment; filename='${zipName}'`,
                'Content-Type': mimetype,
                'Content-Length': downloadStat.size,
              })
              const filestream = sftp.createReadStream(downloadOutput);
              filestream.on('end', () => {
                sftp.end();
              })
              filestream.pipe(res)
            })
          })
        })
      }
      else {
        // DIRECT DOWNLOAD
        var itemPath = items[0];
        var itemParentPath = itemPath.substring(0, itemPath.lastIndexOf('/'));
        var itemName = itemPath.substring(itemPath.lastIndexOf('/') + 1, itemPath.length);
        sftp.lstat(itemPath, (err, stat) => {
          if (stat.isDirectory() || stat.isSymbolicLink()) {
            // COMPRESS ZIP AND DOWNLOAD
            const zipName = outputName;
            const command = `cd ${HelperFunctions.replaceSpecialChars(itemParentPath)}`
              + ` && zip -r -0 /home/${username}/drive-downloads/${HelperFunctions.replaceSpecialChars(zipName)} ${HelperFunctions.replaceSpecialChars(itemName)}`
            SshSession.executeSshCommand(Client, command).then(() => {
              const downloadOutput = `/home/${username}/drive-downloads/${zipName}`
              sftp.stat(downloadOutput, (errstat, downloadStat) => {
                var mimetype = mime.getType(downloadOutput);
                res.writeHead(200, {
                  'Content-Disposition': `attachment; filename='${zipName}'`,
                  'Content-Type': mimetype,
                  'Content-Length': downloadStat.size,
                })
                const filestream = sftp.createReadStream(downloadOutput);
                filestream.on('end', () => {
                  console.log("end")
                  sftp.unlink(downloadOutput, () => {
                    sftp.end();
                  });
                })
                req.on('close',()=>{
                  sftp.unlink(downloadOutput, () => {
                    sftp.end();
                  });
                })
                filestream.pipe(res)
              })
            });
          }
          else {
            // DIRECTLY DOWNLOAD FILE
            sftp.stat(itemPath, (err, itemStat) => {
              var mimetype = mime.getType(itemPath);
              res.writeHead(200, {
                'Content-Disposition': `attachment; filename=${encodeURI(outputName)}`,
                'Content-Type': mimetype,
                'Content-Length': itemStat.size,
              })
              var filestream = sftp.createReadStream(itemPath);
              var had_error = false;
              filestream.on('end', () => {
                sftp.end();
              })
              filestream.pipe(res).on('error', (err) => {
                had_error = true;
              }).on('close', () => {
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
  else {
    res.json({
      statu: false,
      message: "SESSION_NOT_STARTED"
    });
  }
}


function ParseItems(unparsedItems) {
  return new Promise((resolve, reject) => {
    let parsedItems = []
    unparsedItems.forEach(item => {
      var itemPath = HelperFunctions.replaceSpecialChars(item);
      var itemName = itemPath.substring(itemPath.lastIndexOf('/') + 1, itemPath.length)
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