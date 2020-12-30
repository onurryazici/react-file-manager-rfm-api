module.exports = {
    itemTypeParser :function(itemType){
        // Incoming param may be : directory, symbolic link, regular, regular empty file, ...
        switch(itemType){
            case "directory":
                return "directory";
            case "symbolic link":
                return "symbolic";
            case "regular file":
                return "file";
            default:
                return "file";
        }
    },
    absolutePathParser: function(path){
        // Incoming param may be : onur -> /home/onur
        var value = path.trim('->');
        console.log(value);
    }
}