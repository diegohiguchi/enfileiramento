// user model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nome: String,
    email: { type: String, unique: true },
    password: String,
    urlImagem: String,
    tipoUsuario:{
        tipoUsuarioId: Number,
        nome: String
    },
    endereco: {
        logradouro: String,
        numero: String,
        longitude: Number,
        latitude: Number
    }

}, { collection: 'usuario' });

module.exports = mongoose.model('Usuario', usuarioSchema);
