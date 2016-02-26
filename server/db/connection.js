var mongoose = mongoose = require('mongoose');

mongoose.connect('mongodb://up:1q2w3e4r@ds013918.mongolab.com:13918/enfileiramento');

var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error', err);
});

db.once('open', function () {
    console.log('connected.');
});

module.exports = db;
