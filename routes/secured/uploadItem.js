var SessionManagement      = require('../../helper/session');
var HelperFunctions = require('../../helper/functions');

exports.uploadItem = function (req,res) {
    //  <Summary>
    //  ----------------- INPUT PARAMETERS --------------------
    //  [TEXT] targetLocation : Target location to upload of items 
    //  [UPLOAD] 
    //  ----------------- OUTPUT PARAMETERS -------------------
    //  [TRUE STATE]
    //  "statu": true,
    //  "message":"PROCESS_SUCCESS"
    //
    //  [FALSE STATE]
    //  "statu": false
    //  "message": "error"
    //  </Summary>
    var Client         = SessionManagement.getClient(req.username);
    var targetLocation = HelperFunctions.replaceSpecialChars(req.query.targetLocation);
    if(Client !== null && Client.isConnected()) 
    {
        Client.connection.sftp((sftp_err,sftp) => {
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
                        if(err)
                            reject();
                        else
                            resolve();
                    })
                }).then(()=>{
                    const command = `GetData.run ${HelperFunctions.replaceSpecialChars(finalTarget)}`
                    SessionManagement.executeSshCommand(Client, command).then((output)=>{
                        res.status(200).json(JSON.parse(output));
                    })}).catch((err)=>{
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
}