
var fs = require('fs');
var path = require('path');
const { spawnSync } = require("child_process");
module.exports = {
    isIpBanned: function(userIp){
        /*
        **  var command='echo "<password>" | sudo -S "<command that needs a root access>"';
        **  child_process.execSync(command)
        */
        var command='echo qweqweasd | sudo -S fail2ban-client status sshd | grep "'+ userIp +'"'; /*** ROOT ERİŞİMİ */
        var commandOutput = spawnSync('sh',['-c',command],{encoding:'utf8'}).stdout;
        
        if(commandOutput.length > 0){
            return true;
        }
        else {
            return false;
        }
    },
    replaceSpecialChars:function(_stringParam){
        var chars = {
            '\'':'\\\'',
            '\"': '\\\"',
            '\`': '\\\`',
            '\!': '\\\!',
            '\^': '\\\^',
            '\$': '\\\$',
            '\&': '\\\&',
            '\(': '\\\(',
            '\)': '\\\)',
            '\=': '\\\=',
            '\?': '\\\?',
            '\*': '\\\*',
            '\;': '\\\;',
            '\:': '\\\:',
            '\>': '\\\>',
            '\<': '\\\<',
            '\|': '\\\|',
            '\ ': '\\\ ',
        }
        return (_stringParam.replace(/['"`!^$&()=?*;:<>| ]/g, m=>chars[m]))
    }
}
