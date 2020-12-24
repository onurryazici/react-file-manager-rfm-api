var fs = require('fs');
var helpers = require('../../helper/functions/functions');
var API = require('../../helper/SSH_SESSION');
const { Client, utils } = require('ssh2');

exports.createDirectory = function (req,res) {

    var connection = API.getSSH();
    
    var output = connection.exec('ls', function(err, stream) {
        if (err) throw err;
        stream.on('data', function(data) {
          console.log('STDOUT: ' + data);
        }).stderr.on('data', function(data) {
          console.log('STDERR: ' + data);
        });
      });
    return res.json({output:output});
}
/*
var output = connection.exec('ls', function(err, stream) {
    if (err) throw err;
    stream.on('close', function(code, signal) { // komut çalıştıktan sonra gelen kısım
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal); 
      connection.end();
    }).on('data', function(data) {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', function(data) {
      console.log('STDERR: ' + data);
    });
  });
  */