module.exports = function (io) {
    var usuarios = [];
    var crypto = require('crypto'), sockets = io.sockets;
    // var amqp = require('amqplib');
    // var helpers = require('../helpers');
    // var open = require('amqplib').connect('amqp://jypqltqo:7FqRtM6HbAcIE4K97MNp6YTwLOSUce1S@jaguar.rmq.cloudamqp.com/jypqltqo');
    // var msgRabbitMq = 'mensagens';
    //, redis = require('redis').createClient()
    var Usuario = require('../models/usuario.js');
    var Notificacao = require('../models/notificacao.js');
    var Solicitacao = require('../models/solicitacao.js');
    var _ = require('../node_modules/underscore');

    sockets.on('connection', function (client) {
        console.log('connection socket');


        client.on('carrega-categorias', function (categoriaId) {
            client.join(categoriaId);
        });

        client.on('nova-solicitacao', function (novaSolicitacao) {
            var data = {
                mensagem: 'Cotação em aberto',
                solicitacao: novaSolicitacao.solicitacao,
                ativo: true,
                tipo: 'Cotação aberta',
                dataEnviada: new Date()
            }

            sockets.in(data.solicitacao.categoriaId).emit('envia-solicitacao', {
                solicitacao: data.solicitacao,
                mensagem: data.mensagem,
                ativo: data.ativo,
                tipo: data.tipo,
                data: data.dataEnviada
            });

            Usuario.find({
                categorias: novaSolicitacao.solicitacao.categoriaId
            }, function (err, usuario) {
                var listaUsuarios = [];

                for (var index = 0; index < usuario.length; index++) {
                    var novaNotificacao = new Notificacao({
                        mensagem: data.mensagem,
                        data: data.dataEnviada,
                        ativo: data.ativo,
                        url: novaSolicitacao.url,
                        tipo: data.tipo,
                        usuarioId: usuario[index]._id
                    });

                    listaUsuarios.push(novaNotificacao);
                }

                if (listaUsuarios.length > 0) {
                    Notificacao.create(listaUsuarios, function (err, notificacao) {
                    });
                }

            });
        });

        client.on('adiciona-usuario', function (usuario) {
            var usuarioSocket = _.find(usuarios, {usuarioId: usuario._id});
            if (!usuarioSocket) {
                usuarios.push({
                    usuarioId: usuario._id,
                    usuarioNome: usuario.nome,
                    tipoUsuario: usuario.tipoUsuario.nome,
                    socketId: client.id
                });
            }else{
                //usuarios.splice(usuarios.indexOf(usuarioSocket), 1);
                usuarioSocket.socketId = client.id;
            }
        });

        client.on('cotacao-encerrada', function (solicitacaoEncerrada) {
            var solicitacaoId = solicitacaoEncerrada.solicitacaoId != undefined ? solicitacaoEncerrada.solicitacaoId : solicitacaoEncerrada._id;
            Solicitacao.findOne({
                _id: solicitacaoId
            }, function (err, solicitacao) {
                if (solicitacao != null) {
                    var data = {
                        mensagem: 'Cotação encerrada',
                        ativo: true,
                        tipo: 'Cotação encerrada',
                        dataEnviada: new Date()
                    }

                    var novaNotificacao = new Notificacao({
                        mensagem: data.mensagem,
                        data: data.dataEnviada,
                        ativo: data.ativo,
                        url: solicitacaoEncerrada.url + solicitacaoId,
                        tipo: 'Cotação encerrada',
                        usuarioId: solicitacao.usuarioId,
                        solicitacaoId: solicitacaoId
                    });

                    Notificacao.findOne({
                         solicitacaoId: solicitacaoId
                    }, function (err, notificacao) {
                        if (notificacao == null) {
                            novaNotificacao.save(function (err, notificacao) {
                                console.log('salvo com sucesso a notificação para o cliente');
                                sockets.to(client.id).emit('envia-cotacao-encerrada', {
                                    mensagem: data.mensagem,
                                    ativo: data.ativo,
                                    tipo: data.tipo,
                                    data: data.dataEnviada
                                });
                            });
                        }
                    });
                }
            });

        });

        client.on('envia-mensagem-chat', function (notificacaoChat) {
            var data = {
                mensagem: 'Nova mensagem no chat',
                ativo: true,
                tipo: 'Chat',
                dataEnviada: new Date()
            }

            var usuario = _.find(usuarios, {usuarioId: notificacaoChat.usuarioId});

            if(usuario != undefined) {

                if(usuario.tipoUsuario == 'Fornecedor') {
                    sockets.to(usuario.socketId).emit('notificacao-chat-fornecedor', {
                        mensagem: data.mensagem,
                        ativo: data.ativo,
                        tipo: data.tipo,
                        data: data.dataEnviada
                    });
                }
                else {
                    sockets.to(usuario.socketId).emit('notificacao-chat-cliente', {
                        mensagem: data.mensagem,
                        ativo: data.ativo,
                        tipo: data.tipo,
                        data: data.dataEnviada
                    });
                }
            }

            var novaNotificacao = new Notificacao({
                mensagem: data.mensagem,
                data: data.dataEnviada,
                ativo: data.ativo,
                url: notificacaoChat.url,
                tipo: data.tipo,
                usuarioId: notificacaoChat.usuarioId
            });

            novaNotificacao.save(function (err, notificacao) {
            });
        });

        client.on('leilao', function(notificacaoLeilao){
            var listaUsuarios = [];
            var data = {
                mensagem: 'Há um lance menor que o seu',
                ativo: true,
                tipo: 'Leilão',
                dataEnviada: new Date()
            }


            for(var i = 0; i < notificacaoLeilao.usuariosId.length; i++){
                var novaNotificacao = new Notificacao({
                    mensagem: data.mensagem,
                    data: data.dataEnviada,
                    ativo: data.ativo,
                    url: notificacaoLeilao.url,
                    tipo: data.tipo,
                    usuarioId: notificacaoLeilao.usuariosId[i]
                });

                listaUsuarios.push(novaNotificacao);

                var usuario = _.find(usuarios, {usuarioId: notificacaoLeilao.usuariosId[i]});

                if(usuario != undefined) {
                    sockets.to(usuario.socketId).emit('notificacao-leilao', {
                        mensagem: data.mensagem,
                        ativo: data.ativo,
                        tipo: data.tipo,
                        data: data.dataEnviada
                    });
                }
            }

            if (listaUsuarios.length > 0) {
                Notificacao.create(listaUsuarios, function (err, notificacao) {
                });
            }

        });

        client.on('sair', function (usuarioId) {
            var index = -1;
            var usuario = _.find(usuarios, {usuarioId: usuarioId});

            if (usuario != undefined) {
                index = usuarios.indexOf(usuario);

                if(index != -1)
                    usuarios.splice(index, 1);
            }
        });
    });
}