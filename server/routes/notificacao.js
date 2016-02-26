var Notificacao = require('../models/notificacao.js');
var respHandler = require('../utils/responseHandler.js');

var NotificacaoAPI = {

    obterTodas: function (req, res) {
        Notificacao.find({}, function (err, notificacao) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }
            // res, status, data, message, err
            respHandler(res, 200, notificacao, 'Success', null);
        });
    },

    obterPorId: function (req, res) {
        Notificacao.findOne({
            _id: req.params.id
        }, function (err, notificacao) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }
            // res, status, data, message, err
            respHandler(res, 200, notificacao, 'Success', null);
        });
    },

    obterPorUsuarioId: function (req, res) {
        Notificacao.find({
            usuarioId: req.params.id
        }, function (err, notificacao) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }
            // res, status, data, message, err
            respHandler(res, 200, notificacao, 'Success', null);
        });
    },

    obterNotificacoesEmAbertoPorUsuarioId: function (req, res) {
        Notificacao.find({
            usuarioId: req.params.id, ativo: true
        }, function (err, notificacao) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }
            // res, status, data, message, err
            respHandler(res, 200, notificacao, 'Success', null);
        });
    },

    adicionar: function (req, res) {
        var notificacao = req.body || '';

        var novaNotificacao = new Notificacao({
            mensagem: notificacao.mensagem,
            data: notificacao.data,
            ativo: notificacao.ativo,
            tipo: notificacao.tipo,
            url: notificacao.url,
            usuarioId: notificacao.usuarioId
        });

        //         Notificacao.findOne({
        //             data: notificacao.data, usuarioId: notificacao.usuarioId
        //         }, function (err, notificacao) {
        //             if (err) {
        //                 // res, status, data, message, err
        //                 respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
        //                 return;
        //             }
        // 
        //             if (notificacao == undefined) {
        novaNotificacao.save(function (err, notificacao) {
            if (err) {
                /* http://www.mongodb.org/about/contributors/error-codes/*/
                if (err.code == 11000) {
                    // duplicate key error
                    // res, status, data, message, err
                    respHandler(res, 400, null, 'A user with this email already exists', 'A user with this email already exists');
                    return;
                } else {
                    // res, status, data, message, err
                    respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                    return;
                }
            } else {
                // res, status, data, message, err
                respHandler(res, 200, notificacao, 'Success', null);
            }

        });
        //     }
        // });
    },

    adicionarLista: function (req, res) {
        var notificacoes = req.body || '';
        var listaNotificacoes = [];


        for (var i = 0; i < notificacoes.length; i++) {

            if (notificacoes[i]._id == undefined) {

                var novaNotificacao = new Notificacao({
                    mensagem: notificacoes[i].mensagem,
                    data: notificacoes[i].data
                });

                listaNotificacoes.push(novaNotificacao);
            }

        }

        if (listaNotificacoes.length > 0) {
            Notificacao.create(listaNotificacoes, function (err, notificacao) {
                if (err) {
                    /* http://www.mongodb.org/about/contributors/error-codes/*/
                    if (err.code == 11000) {
                        // duplicate key error
                        // res, status, data, message, err
                        respHandler(res, 400, null, 'A user with this email already exists', 'A user with this email already exists');
                        return;
                    } else {
                        // res, status, data, message, err
                        respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                        return;
                    }
                }

                respHandler(res, 200, notificacao, 'Success', null);
            });
        }
    },

    editarListaPorUsuarioId: function (req, res) {
        Notificacao.find({
            usuarioId: req.params.id
        }, function (err, notificacao) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }

            for (var i = 0; i < notificacao.length; i++) {
                notificacao[i].ativo = false;
                notificacao[i].save();
            }

            respHandler(res, 200, notificacao, 'Success', null);

        });
    },

    editar: function (req, res) {
        var notificacaoAtual = req.body || '';

        // name is optional
        if (notificacaoAtual.mensagem.trim() == '') {
            // res, status, data, message, err
            respHandler(res, 401, null, 'Preencha o campo mensagem');
            return;
        }

        Notificacao.findOne({
            _id: notificacaoAtual._id
        }, function (err, notificacao) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }

            notificacao.mensagem = notificacaoAtual.mensagem;
            notificacao.save();

            // res, status, data, message, err
            respHandler(res, 200, notificacao, 'Success', null);
        });
    },

    remover: function (req, res) {
        Notificacao.remove({
            _id: req.params.id
        }, function (err) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }
            // res, status, data, message, err
            respHandler(res, 200, null, 'Success', null);
        });
    },

    obterPorNome: function (req, res) {
        Notificacao.findOne({
            mensagem: req.params.mensagem
        }, function (err, notificacao) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }
            // res, status, data, message, err
            respHandler(res, 200, notificacao, 'Success', null);
        });
    },
}

module.exports = NotificacaoAPI;
