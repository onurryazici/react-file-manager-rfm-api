var fs = require('fs');
var helpers = require('../../helper/functions/functions');
var API = require('../../helper/global');
const { Client, utils } = require('ssh2');

exports.createDirectory = function (req,res) {

    var username_val = API.getUsername();
    var password_val = API.getPassword();

    const conn = Client();
    conn.on('ready', () => {
        console.log('Client :: ready');
        
    }).on('error',()=>{
        console.log("hata");
    }).connect({
        host              : '127.0.0.1',
        port              : 22,
        username          : "main",
        password          : "qweqweasd",
        keepaliveInterval : 10 * 1000, // 10 minutes for idle as milliseconds. details >> npmjs 
        keepaliveCountMax : 1,
    });
}

