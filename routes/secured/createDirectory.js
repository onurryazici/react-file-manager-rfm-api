var API = require('../../helper/SSH_SESSION');

exports.createDirectory = async function (req,res) {
  var SSH_Connection      = API.getSSH();
  var encryptedLocation   = req.query.location;
  var location            = Buffer.from(encryptedLocation,'base64').toString('ascii');
  //var formattedCurrentLocation   = location.replace(/\s/g,'\\ ');
  //var newFolderName              = req.body.newFolderName;

    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
      SSH_Connection.connection.sftp((err,sftp)=>{
            if (err) console.log("hata var");
            sftp.mkdir("/home/main/err ", function(err) {
            if (err) {
              console.log("Failed to create directory!", err);
            } else {
              console.log("Directory created on SFTP server");
            }
          });
      });
        /*var command = `cd ${formattedCurrentLocation} && mkdir ${newFolderName}`;
        API.executeSshCommand(command).then((data)=>{
            //res.status(200).json(JSON.parse(data));
            //console.log(data);  
        }).catch((err)=>{
            res.status(400).json({statu:false,message:err})
        })*/
    }
    else{
        res.json({
            statu:false,
            message:"Session not started"
        });
    }
}
/*
var output = connection.exec('ls', function(err, stream) {
    if (err) throw err;
    stream.on('close', function(code, signal) { // komut çalıştıktan sonra gelen kısım
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal); 
      connection.end();
    }).on('data', function(data) {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', function(data) {
      console.log('STDERR: ' + data);
    });
  });
  */