exports.JSONtoBuffer = function(obj){
    return new Buffer(JSON.stringify(obj));
}

exports.BuffertoJSON = function(buff){
    return JSON.parse(buff.content.toString());
}