var Client         = require('ssh2').Client;
var SSH_Connection = new Client();

function getSSH(){
    return SSH_Connection;
}
function setSSH(ssh){
    SSH_Connection=ssh;
}

module.exports = {
    getSSH,
    setSSH
} 