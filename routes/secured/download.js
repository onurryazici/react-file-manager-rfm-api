var API = require('../../helper/SSH_SESSION');
const mime = require('mime');
const fs = require('fs');
exports.download = async function (req,res) {
  /// INPUTS
  /// "location" : Encoded Current directory with base64
  /// "dirname"  : Encoded new folder name with base64

  var SSH_Connection      = API.getSSH();
  var item                = req.query.item;

  
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
      SSH_Connection.connection.sftp((sftp_err,sftp) => {
            if (sftp_err){
              res.status(400).json({statu:false,message:"UNKNOWN_ERROR"});}
              
              console.log(Array.from(item.length))
              /*************if(fs.lstatSync("/home/user1/drive/qwe/rty").isDirectory())
              {
                console.log("yes");
              }
              else{
                console.log("no");
              }*************/
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
      });
    }
    else{
        res.json({
            statu:false,
            message:"SESSION_NOT_STARTED"
        });
    }
}
