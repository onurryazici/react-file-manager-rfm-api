var API = require('../../helper/SSH_SESSION');
var API_FUNCTIONS = require('../../helper/functions');
var crypto = require('crypto')
exports.encryptItems = function (req,res) {
    /// INPUTS
    /// "items[]" :  Encoded Item's restore path with base64
    var SSH_Connection = API.getSSH();
    var SSH_User       = API.getUsername();
    var unparsedItems  = req.body.items;
    if(SSH_Connection !== null && SSH_Connection.isConnected()) 
    {
        SSH_Connection.connection.sftp((sftp_err,sftp) => {
            var key = '14189dc35ae35e75ff31d7502e245cd9bc7803838fbfd5c773cdcd79b8a28bbd';
            var cipher = crypto.createCipher('aes-256-cbc', key);
            var input = sftp.createReadStream('/home/main/Desktop/IMG_20200115_001452.jpg');
            var output = sftp.createWriteStream('/home/main/Desktop/IMG_20200115_001452.jpg.enc');
            input.pipe(cipher).pipe(output);

            output.on('finish', function() {
            console.log('Encrypted file written to disk!');
            });
        })
    }
}
