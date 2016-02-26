var Solicitacao = require('../models/solicitacao.js');
var respHandler = require('../utils/responseHandler.js');
var _ = require('../node_modules/underscore');
var schedule = require('../node_modules/node-schedule');
var DeviceToken = require('../models/deviceToken.js');
var gcm = require('../node_modules/node-gcm');
var helpers = require('../helpers');
var usuarios = [];
var q = 'mensagens';


var SolicitacaoAPI = {

    obterTodas: function (req, res) {
        Solicitacao.find({}, function (err, solicitacao) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }
            // res, status, data, message, err
            respHandler(res, 200, solicitacao, 'Success', null);
        });
    },

    obterPorId: function (req, res) {
        Solicitacao.findOne({
            _id: req.params.id
        }, function (err, solicitacao) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }
            // res, status, data, message, err
            respHandler(res, 200, solicitacao, 'Success', null);
        });
    },

    solicitar: function (req, res) {
        var solicitacao = req.body || '';
        //req.session.usuarioId = solicitacao.usuarioId;

        //if (usuarios.indexOf(solicitacao.usuarioId) == -1) {
       
        //}
        //var teste = req.session;

        // name is optional
        if (solicitacao.categoriaId == undefined) {
            // res, status, data, message, err
            respHandler(res, 401, null, 'Preencha os campos');
            return;
        }

        var novaSolicitacao = new Solicitacao({
            usuarioId: solicitacao.usuarioId,
            produtos: solicitacao.produtos,
            categoriaId: solicitacao.categoriaId,
            titulo: solicitacao.titulo,
            ativo: solicitacao.ativo,
            dataCadastro: solicitacao.dataCadastro
        });

        Categoria.findOne({ _id: solicitacao.categoriaId }, function (err, categoria) {
            novaSolicitacao.save(function (err, solicitacao) {
                if (err) {
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

//                     var dataCadastro = new Date(solicitacao.dataCadastro);
//                     var data = new Date(
//                         dataCadastro.getFullYear(), dataCadastro.getDay(),
//                         dataCadastro.getMonth(), dataCadastro.getHours(),
//                         dataCadastro.setMinutes(dataCadastro.getMinutes() + 1),
//                         dataCadastro.getSeconds());
// 
//                     var job = {
//                         usuarioId: solicitacao.usuarioId,
//                         data: data
//                     }
// 
//                     var open = require('amqplib').connect('amqp://jypqltqo:7FqRtM6HbAcIE4K97MNp6YTwLOSUce1S@jaguar.rmq.cloudamqp.com/jypqltqo');
// 
//                     //Publisher
//                     open.then(function (conn) {
//                         var ok = conn.createChannel();
//                         ok = ok.then(function (ch) {
//                             ch.assertQueue(q);
//                             console.log('-> Enviando mensagem');
//                             ch.sendToQueue(q, helpers.JSONtoBuffer(job));
//                         });
// 
//                         return ok;
// 
//                     }).then(null, console.warn);
// 
//                     //jobs(job.data);
// 
//                     function jobs(data) {
// 
//                         var job = schedule.scheduleJob(data, function () {
//                             console.log('The world is going to end today.');
//                         });
//                     }
// 
//                             
//                     // Consumer 
//                     open.then(function (conn) {
// 
//                         var ok = conn.createChannel();
//                         ok = ok.then(function (ch) {
//                             ch.assertQueue(q);
//                             ch.consume(q, function (msg) {
//                                 if (msg !== null) {
//                                     console.log('message' + helpers.BuffertoJSON(msg));
//                                     var data = helpers.BuffertoJSON(msg);
//                                 }
//                             });
// 
//                             return ok;
//                         });
//                     }).then(null, console.warn);

                    // job.cancel();

                    var novoDashboard = new Dashboard({
                        solicitacaoId: solicitacao._id,
                        usuarioId: solicitacao.usuarioId,
                        categoria: { categoriaId: categoria._id, nome: categoria.nome },
                        ativo: solicitacao.ativo,
                        dataCadastro: solicitacao.dataCadastro
                    });

                    Dashboard.findOne({ 'categoria.categoriaId': categoria._id, usuarioId: solicitacao.usuarioId }, function (err, dashboard) {
                        if (dashboard != undefined) {
                            dashboard.solicitacaoId = novoDashboard.solicitacaoId;
                            dashboard.usuarioId = novoDashboard.usuarioId;
                            dashboard.categoria = novoDashboard.categoria;
                            dashboard.ativo = novoDashboard.ativo;
                            dashboard.dataCadastro = novoDashboard.dataCadastro;
                            dashboard.save();
                        } else {
                            novoDashboard.save();
                        }
                    });

                    respHandler(res, 200, solicitacao, 'Success', null);
                }
            });
        });
    },

    editar: function (req, res) {
        var solicitacaoAtual = req.body || '';
        var solicitacaoId = solicitacaoAtual.solicitacaoId != undefined ? solicitacaoAtual.solicitacaoId : solicitacaoAtual._id;


        Solicitacao.findOne({
            _id: solicitacaoId
        }, function (err, solicitacao) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }

            if (solicitacao != null) {
                solicitacao.ativo = solicitacaoAtual.ativo;
                solicitacao.save();
            }

            Dashboard.findOne({ solicitacaoId: solicitacaoId }, function (err, dashboard) {
                if (dashboard != undefined) {
                    dashboard.ativo = solicitacaoAtual.ativo;
                    dashboard.save();
                }
            });
            
            // res, status, data, message, err
            respHandler(res, 200, solicitacao, 'Success', null);
        });
    },

    remover: function (req, res) {
        Solicitacao.remove({
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

    obterSolicitacoesPorCategoriaId: function (req, res) {
        Solicitacao.find({
            categoriaId: req.params.id
        }, function (err, solicitacao) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }
            // res, status, data, message, err
            respHandler(res, 200, solicitacao, 'Success', null);
        });
    },

    obterListaSolicitacoesPorCategoriaId: function (req, res) {
        var categorias = req.body || '';

        Solicitacao.find({
            categoriaId: { $in: categorias }
        }).exec(function (err, categoria) {
            respHandler(res, 200, categoria, 'Success', null);
        });
    },

    obterSolicitacoesPorUsuarioId: function (req, res) {
        Solicitacao.find({
            usuarioId: req.params.id
        }, function (err, solicitacao) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }

            respHandler(res, 200, solicitacao, 'Success', null);
        });

    },

    obterSolicitacoesAtivasExcetoUltimaSolicitacaoPorUsuarioId: function (req, res) {
        Solicitacao.find({
            usuarioId: req.params.id, ativo: true
        }, function (err, solicitacao) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }

            var solicitacoesId = _.pluck(solicitacao, '_id');

            Dashboard.find({
                solicitacaoId: { $in: solicitacoesId }
            }).exec(function (err, dashboard) {
                if (dashboard != undefined) {
                    for (var index = 0; index < dashboard.length; index++) {
                        solicitacao.splice(solicitacao.indexOf(dashboard[index]), 1);
                    }

                    respHandler(res, 200, solicitacao, 'Success', null);
                }
            });
        });

    },

    obterSolicitacoesAtivasExcetoUltimaSolicitacaoPorCategoriaId: function (req, res) {
        var categorias = req.body || '';

        Solicitacao.find({
            categoriaId: { $in: categorias }, ativo: true
        }).exec(function (err, solicitacao) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }

            var solicitacoesId = _.pluck(solicitacao, '_id');

            Dashboard.find({
                solicitacaoId: { $in: solicitacoesId }
            }).exec(function (err, dashboard) {
                if (dashboard != undefined) {
                    for (var index = 0; index < dashboard.length; index++) {
                        solicitacao.splice(solicitacao.indexOf(dashboard[index]), 1);
                    }

                    respHandler(res, 200, solicitacao, 'Success', null);
                }
            });

        });

    },

    obterSolicitacoesPorUsuarioECategoria: function (req, res) {
        var solicitacao = req.body || '';

        Solicitacao.find({
            usuarioId: solicitacao.usuarioId, categoriaId: solicitacao.categoriaId
        }, function (err, solicitacao) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }

            respHandler(res, 200, solicitacao, 'Success', null);
        });

    },

    obterSolicitacoesIdPorUsuarioId: function (req, res) {
        Solicitacao.find({
            usuarioId: req.params.id
        }, '_id', function (err, solicitacao) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }

            // res, status, data, message, err
            respHandler(res, 200, solicitacao, 'Success', null);
        });
    },
}

module.exports = SolicitacaoAPI;
