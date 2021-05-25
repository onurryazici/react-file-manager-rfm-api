const {NodeSSH} = require('node-ssh');
var SSH_Connection = new NodeSSH();
var username="";

var clients = []
var sockets = []
function addClient(_username, _clientData){
    clients[_username] = _clientData;
}

function getClient(_username){
    return clients[_username];
}
function removeClient(_username){
    delete clients[_username]; // BU OLMAYABİLİR
}
function addSocket(_username, _socketData) {
    sockets[_username]=_socketData
}
function getSocket(_username){
    return sockets[_username]
}
function removeSocket(_username) {
    delete sockets[_username]
}
function getUsernameBySocketId(_socketId) {
    const index = Object.keys(sockets).find((key)=>sockets[key]===_socketId)
    return index;
}

function executeSshCommand(_client, _command) {
    return new Promise((resolve, reject) => {
        _client.execCommand(_command,{ stream: 'stdout', options: { pty: true } })
        .then(function(result){
            var commandOutput = result.stdout.toString();
            resolve(commandOutput);
        }).catch((err)=>{
            reject(err);
        })
    });
}
module.exports = {
    getClient,
    executeSshCommand,
    addClient,
    removeClient,
    addSocket,
    getSocket,
    removeSocket,
    getUsernameBySocketId
} 