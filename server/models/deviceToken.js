
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Usuario = require('./usuario.js');

var tokenDeviceSchema = new Schema({
    usuarioId: {
        type: Schema.ObjectId,
        ref: 'Usuario'
    },
    token: {type: String, unique: true},
    ativo: Boolean
}, {collection: 'token_device'});

module.exports = mongoose.model('TokenDevice', tokenDeviceSchema);