var gcm = require('../node_modules/node-gcm');
var DeviceToken = require('../models/deviceToken.js');
var respHandler = require('../utils/responseHandler.js');
var device_token;

var DeviceTokenAPI = {

    register: function (req, res) {
        var device = req.body;

        DeviceToken.findOne({
            usuarioId: device.usuarioId
        }, function (err, deviceToken) {
            if (deviceToken == undefined) {
                var novoToken = new DeviceToken({
                    usuarioId: device.usuarioId,
                    token: device.token,
                    ativo: true
                });

                novoToken.save(function (err, token) {
                    // if (err) {
                    //     /* http://www.mongodb.org/about/contributors/error-codes/*/
                    //     if (err.code == 11000) {
                    //         // duplicate key error
                    //         // res, status, data, message, err
                    //         respHandler(res, 400, null, 'Token já existe', 'Token já exist');
                    //         return;
                    //     } else {
                    //         // res, status, data, message, err
                    //         respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                    //         return;
                    //     }
                    // } else {
                    //     // res, status, data, message, err
                    //     respHandler(res, 200, token, 'Success', null);
                    // }

                });

                res.send('ok');
                return;
            }
            else if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }

        });
    },

    notificar: function (req, res) {
        var device = req.body;
        console.log(device);

        DeviceToken.findOne({
            usuarioId: device.usuarioId, ativo: true
        }, function (err, deviceToken) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }
            // res, status, data, message, err
            //respHandler(res, 200, deviceToken, 'Success', null);

            if (deviceToken != null) {
                var deviceTokens = deviceToken.token;

                //var device_tokens = ['APA91bFbfmBrXe5v8eobqZxqg44CreOxdzP_EFQ9jFfDkpyHhsblgz8BNe-F_VsX9ODLxWh7w6i3HYQgwn9iQsHbTNhB-vuOzuP7iZqpXhgDF5y9tTGRngdQGz3SvFZuRszkdcw4_7EM'];
                var message = new gcm.Message();
                var sender = new gcm.Sender('AIzaSyAxWfrbEBE6XtZkyARfp6dVEsCmzRzS9eE');

                message.addData('title', device.titulo);
                message.addData('message', device.mensagem);
                message.addData('icon', 'icon.png');
                //message.addData('sound', '');

                message.collapseKey = 'testing';
                message.delayWhileIdle = true;
                message.timeToLive = 3;

                console.log('sending to: ' + deviceTokens);

                //deviceTokens.push(deviceTokens);

                sender.send(message, deviceTokens, 4, function (result) {
                    console.log(result);
                    console.log('push sent to: ' + device_token);
                });

                respHandler(res, 200, deviceToken, 'Success', null);
            }

        });
    },

    notificarUsuarios: function (req, res) {
        var device = req.body;

        var titulo = device.titulo || "Cotar Bem";
        var mensagem = device.mensagem;
        DeviceToken.find({
            usuarioId: { $in: device.usuarioId }, ativo: true
        }, function (err, deviceToken) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }

            for (var index = 0; index < deviceToken.length; index++) {

                if (deviceToken != null) {
                    var deviceTokens = deviceToken[index].token;

                    //var device_tokens = ['APA91bFbfmBrXe5v8eobqZxqg44CreOxdzP_EFQ9jFfDkpyHhsblgz8BNe-F_VsX9ODLxWh7w6i3HYQgwn9iQsHbTNhB-vuOzuP7iZqpXhgDF5y9tTGRngdQGz3SvFZuRszkdcw4_7EM'];
                    var message = new gcm.Message();
                    var sender = new gcm.Sender('AIzaSyAxWfrbEBE6XtZkyARfp6dVEsCmzRzS9eE');

                    message.addData('title', titulo);
                    message.addData('message', mensagem);
                    message.addData('icon', 'icon.png');
                    //message.addData('sound', 'notification');

                    message.collapseKey = 'testing';
                    message.delayWhileIdle = true;
                    message.timeToLive = 3;

                    console.log('sending to: ' + deviceTokens);

                    //deviceTokens.push(deviceTokens);

                    sender.send(message, deviceTokens, 4, function (result) {
                        console.log(result);
                    });

                    //res.send('ok');
                }
            }

            respHandler(res, 200, deviceToken, 'Success', null);

        });
    },

    editar: function (req, res) {
        var deviceTokenAtual = req.body || '';

        DeviceToken.findOne({
            usuarioId: deviceTokenAtual.usuarioId
        }, function (err, deviceToken) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }

            deviceToken.ativo = deviceTokenAtual.ativo;
            deviceToken.save();

            // res, status, data, message, err
            respHandler(res, 200, deviceToken, 'Success', null);
        });
    },

    obterPorId: function (req, res) {
        DeviceToken.findOne({
            _id: req.params.id
        }, function (err, deviceToken) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }
            // res, status, data, message, err
            respHandler(res, 200, deviceToken, 'Success', null);
        });
    },

    obterPorUsuarioId: function (req, res) {
        DeviceToken.findOne({
            usuarioId: req.params.id
        }, function (err, deviceToken) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }
            // res, status, data, message, err
            respHandler(res, 200, deviceToken, 'Success', null);
        });
    }
}

module.exports = DeviceTokenAPI;
