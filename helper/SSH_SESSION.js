const {NodeSSH} = require('node-ssh');
var SSH_Connection = new NodeSSH();
var username="";
function getSSH(){
    return SSH_Connection;
}
function setSSH(ssh){
    SSH_Connection=ssh;
}
function setUsername(usernameValue){
    username=usernameValue;
}
function getUsername(){
    return username;
}
function executeSshCommand(command) {
    return new Promise((resolve, reject) => {
        SSH_Connection.execCommand(command,{ stream: 'stdout', options: { pty: true } })
        .then(function(result){
            var commandOutput = result.stdout.toString();
            resolve(commandOutput);
        }).catch((err)=>{
            // Nothing
        })
    });
}
module.exports = {
    getSSH,
    setSSH,
    getUsername,
    setUsername,
    executeSshCommand
} 