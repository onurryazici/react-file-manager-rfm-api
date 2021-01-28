const multer = require('multer');
const Messages = require('../../helper/message');
var API      = require('../../helper/SSH_SESSION');

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

exports.uploadItem = async function (req,res) {
    var SSH_Connection           = API.getSSH();
    
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
    })

    /*var encryptedLocation        = req.query.location;
    var location                 = Buffer.from(encryptedLocation,'base64').toString('utf-8');
    var formattedCurrentLocation = location.replace(/\s/g,'\\ ').replace(/'/g, "\\'");
    
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        //var command = `GetDirectoryData.run "${formattedCurrentLocation}"`;
        API.executeSshCommand(command)
        .then((data)=>{
            res.status(200).json(JSON.parse(data),);
        }).catch((err)=>{
            res.status(400).json({statu:false,items:[]})
        })
    }
    else{
        res.json({
            statu:false,
            message:Messages.SESSION_NOT_STARTED
        });
    }*/
}