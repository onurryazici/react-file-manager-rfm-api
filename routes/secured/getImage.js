var SessionManagement = require('../../helper/session');
const sharp    = require('sharp');
exports.getImage = async function (req,res) {
    //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [TEXT] absolutePath : Item addresses to get image
    //  [TEXT] width        : Image width for resizing (If not needed don't send)
    //  [TEXT] height       : Image height for resizing (If not needed don't send)
    //  ----------------- OUTPUT PARAMETERS -------------------
    //  [TRUE STATE]
    //  FILE PIPING
    //
    //  [FALSE STATE]
    //  DISCONNECTING PIPING
    //  </Summary>
    var Client       = SessionManagement.getClient(req.username);
    var absolutePath = req.query.absolutePath;
    var width        = req.query.width;
    var height       = req.query.height;
    if(Client !== null && Client.isConnected()) 
    {   
        Client.connection.sftp((sftp_err,sftp) => {
            const imageStream = sftp.createReadStream(absolutePath)
            imageStream.on('end',()=>{
                sftp.end();
            })
            imageStream.on('error',(error)=>{
                console.log("konum " + absolutePath)
                console.log("Okuma hatası " + error)
            })
            if(width === undefined || height === undefined)
                imageStream.pipe(res);
            else{
                const resize = sharp().resize(150,100).composite([{
                    input:Buffer.from(`<svg><rect x="0" y="0" width="150" height="100" rx="50" ry="50"/></svg>`),
                    blend:'screen'
                }]).png().on('error',(err)=>{
                    console.log("Broken Image : " + err)
                })
                imageStream.pipe(resize).pipe(res);
            }
        });
        // working
        /*Client.connection.sftp((sftp_err,sftp) => {
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
            message:"SESSION_NOT_STARTED"
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