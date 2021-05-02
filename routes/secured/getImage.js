const Messages = require('../../helper/message');
var API      = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
var image = require('imagemagick')
const sharp  =require('sharp');
exports.getImage = async function (req,res) {
    // INPUT
    // absolutePath : Encrypted image path with base64
    var imageCache={};
    var SSH_Connection           = API.getSSH();
    var absolutePath             = req.query.absolutePath;
    var width                    = req.query.width;
    var height                   = req.query.height;
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {   
        SSH_Connection.connection.sftp((sftp_err,sftp) => {
            if(sftp_err){
                console.log("xx " + sftp_err)
                //console.log("yy " + SSH_Connection.connection.sftp())
            }
            else{
                const imageStream = sftp.createReadStream(absolutePath)
                if(width === undefined || height === undefined)
                {
                    imageStream.on('end',()=>{
                        sftp.end();
                    })
                    imageStream.pipe(res);
                }
                else{
                    const resize = sharp().resize(150,100).composite([{
                        input:Buffer.from(`<svg><rect x="0" y="0" width="150" height="100" rx="50" ry="50"/></svg>`),
                        blend:'screen'
                    }]).png().on('error',(err)=>{
                        console.log("Broken Image : " + err)
                    })
                    imageStream.on('end',()=>{
                        sftp.end();
                    })
                    imageStream.pipe(resize).pipe(res);
                }
                

                /*res.contentType('image/jpg');
                res.end(thumbnail,'binary')*/
            }
        });


        // working
        /*SSH_Connection.connection.sftp((sftp_err,sftp) => {
            var base64Data = [];
            var dataLength=0;
            var file = sftp.createReadStream(absolutePath)
            file.on('data',(chunk)=>{
                base64Data.push(chunk);
                dataLength += chunk.length;
            })
            file.on('end',()=>{
                var dataBuffer = Buffer.concat(base64Data,dataLength);
                const img = Buffer.from(dataBuffer).toString('base64')
                res.status(200).json(img)
            })
        })*/
    }
    else{
        res.json({
            statu:false,
            message:Messages.SESSION_NOT_STARTED
        });
    }
}

//////////////////11111111111//////////////////
                /*sftp.readFile(absolutePath,'binary',(err,file)=>{
                    if(err)
                        res.send(err)
                    
                    var imageOptions = {
                        srcData:file,
                        width:dimension
                    }
                    image.resize(imageOptions,(err,binary)=>{
                        res.contentType('image/jpg');
                        res.end(binary,'binary')
                        //imageCache[absolutePath]=binary
                    })
                })*/


                ////////////////////222222222222////////////////////
                /*sftp.readFile(absolutePath,(err,data)=>{
                    if(err){
                        res.writeHead(200, {'Content-Type': 'image/jpeg'});
                        res.end(null); // Send the file data to the browser.
                    }
                    else{
                        sftp.close(data);
                        res.writeHead(200, {'Content-Type': 'image/jpeg'});
                        res.end(data); // Send the file data to the browser.
                    }
                })*/