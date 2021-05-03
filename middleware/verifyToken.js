const jwt = require('jsonwebtoken');
const { Messages } = require('../helper/message');

module.exports = (req,res,next) => {
    const token = req.headers['x-access-token'] || req.body.token || req.query.token;
    if(token){
        jwt.verify(token,req.app.get('api_secret_key'),(err,decoded)=>{
            if(err){
                res.json({
                    statu:false,
                    message:Messages.FAILED_AUTHENTICATE_TOKEN,
                    details:err
                })
            }
            else{
                req.decode = decoded;
                req.username = decoded.payload
                next();
            }
        });
    }
    else{

        res.json({
            statu:false,
            message: Messages.TOKEN_NOT_PROVIDED
        })
    }
}