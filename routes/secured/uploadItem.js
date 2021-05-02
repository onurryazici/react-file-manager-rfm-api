const multer = require('multer');
const Messages = require('../../helper/message');
var API           = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');

exports.uploadItem = function (req,res) {
    var SSH_Connection = API.getSSH();
    var targetLocation = API_FUNCTIONS.replaceSpecialChars(req.query.targetLocation);
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        SSH_Connection.connection.sftp((sftp_err,sftp) => {
            const filename = req.file.originalname;
            const target = `${targetLocation}/${filename}`;
            sftp.exists(target,(exist)=>{
                
                var suitableName = "";
                if(exist)
                    suitableName=`(uploaded-${new Date().getTime()}) ${filename}`;
                else
                    suitableName=filename;
                const finalTarget = `${req.query.targetLocation}/${suitableName}`
                return new Promise((resolve,reject)=>{
                    sftp.writeFile(`${finalTarget}`,req.file.buffer,"binary",(err)=>{
                        sftp.end()
                        if(err){
                            reject();
                        }
                        else
                            resolve();
                    })
                }).then(()=>{
                    const command = `GetData.run ${API_FUNCTIONS.replaceSpecialChars(finalTarget)}`
                    API.executeSshCommand(command).then((output)=>{
                        res.status(200).json(JSON.parse(output));
                    })
                }).catch((err)=>{
                    res.status(400).json({statu:false,items:[],message:err})
                })
            })
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