const multer = require('multer');
const Messages = require('../../helper/message');
const API           = require('../../helper/SSH_SESSION');
const API_FUNCTIONS = require('../../helper/functions');
const Readable = require('stream').Readable;

var fileNames=[];
var storage = multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,'upload-temp')
    },
    filename:function(req,file,cb){
        let name=Date.now()+'_'+file.originalname;
        fileNames.push(name);
        cb(null,name)
    }
})

var upload = multer({storage:storage}).array('file');


function bufferToStream(buffer){
    var stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

exports.uploadItem = function (req,res) {
    var SSH_Connection = API.getSSH();
    var targetLocation = API_FUNCTIONS.replaceSpecialChars(req.query.targetLocation);
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        SSH_Connection.connection.sftp((sftp_err,sftp) => {
            //var str = bufferToStream(req.file);
            //console.log("xxxx" +req.file.buffer)
            //var readStream  = sftp.createReadStream(str);
            //var writeStream = sftp.createWriteStream('/tester.exe')
            //str.pipe(res)
            const filename = req.file.originalname;
            const target = `${targetLocation}/${filename}`;
            sftp.exists(target,(exist)=>{
                var suitableName = "";
                if(exist)
                    suitableName=`(uploaded-${new Date().getTime()}) ${filename}`;
                else
                    suitableName=filename;
                sftp.writeFile(`${targetLocation}/${suitableName}`,req.file.buffer,"binary",(err)=>{
                    return res.status(200).json({statu:true,itemName:suitableName})
                })
            })
            /*if(sftp.exists(target,(err)=>{}))
            {
                suitableName=`(uploaded-${new Date().getTime()}) ${filename}`
            }
            else{
                suitableName=filename;
            }
            console.log(sftp.exists(target,(err)=>{}))*/
        });
    }
    else
    {
        return res.json({
            statu:false,
            message:"SESSION_NOT_STARTED"
        });
    }
    // IMPORTANT
    //console.log('body', req.file.length, req.file)

    /*res.json({ success: true })
    upload(req,res,function(err){
        if(err){
            return res.status(500).json(err);
        }
        else
        {
            let counter=0;
            fileNames.forEach(filename => {
                counter++;
                if(counter==fileNames.length)
                {
                    fileNames=[]
                    counter=0;
                    return res.status(200).json({statu:true,item:req.file})
                }  
            })
        }
    })*/
}