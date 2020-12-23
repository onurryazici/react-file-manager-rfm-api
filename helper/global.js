var username = "";
var password = "";

function getUsername(){
    return username;
}
function setUsername(usernameValue){
    username = usernameValue;
}
function getPassword(){
    return password;
}
function setPassword(passwordValue){
    password = passwordValue;
}

module.exports = {
    getUsername,
    setUsername,
    getPassword,
    setPassword
} 