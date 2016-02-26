var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Usuario = require('./usuario.js');

var solicitacaoSchema = new Schema({
    usuarioId: {
        type: Schema.ObjectId,
        ref: 'Usuario'
    },
    titulo: String,
    ativo: Boolean,
    dataCadastro: String
}, { collection: 'solicitacao' });

module.exports = mongoose.model('Solicitacao', solicitacaoSchema);
