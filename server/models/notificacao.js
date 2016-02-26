
var mongoose = require('mongoose'),
    Usuario = require('./usuario.js'),
    Solicitacao = require('./solicitacao.js'),
    Schema = mongoose.Schema;

var notificacaoSchema = new Schema({
    solicitacaoId: {
        type: Schema.ObjectId,
        ref: 'Solicitacao'
    },
    mensagem: String,
    data: Date,
    ativo: Boolean,
    url: String,
    tipo: String,
    usuarioId: {
        type: Schema.ObjectId,
        ref: 'Usuario'
    }
}, { collection: 'notificacao' });

module.exports = mongoose.model('Notificacao', notificacaoSchema);

