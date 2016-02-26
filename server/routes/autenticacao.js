var jwt = require('jwt-simple');
var db = require('../db/connection.js');
var Usuario = require('../models/usuario.js');
var pwdMgr = require('../utils/managePassword.js');
var respHandler = require('../utils/responseHandler.js');
var emailService = require('../utils/emailService.js');
var generatePassword = require('../node_modules/password-generator');

var AutenticacaoAPI = {

    registrar: function (req, res) {
        var user = req.body;
        var nome = user.nome || '';
        var email = user.email || '';
        var password = user.password || '';

        // name is optional
        if (nome.trim() == '' || email.trim() == '' || password.trim() == '') {
            // res, status, data, message, err
            respHandler(res, 401, null, 'E-mail ou Senha inv&aacute;lidos', 'E-mail ou Senha inv&aacute;lidos');
            return;
        }

        pwdMgr.cryptPassword(user.password, function (err, hash) {
            user.password = hash;

            if (err)
                respHandler(res, 500, null, 'Oops...', err);

            else {
                var usuario = new Usuario({
                    nome: user.nome,
                    email: user.email,
                    password: user.password,
                    urlImagem: user.urlImagem,
                    tipoUsuario: user.tipoUsuario,
                    endereco: user.endereco
                });

                usuario.save(function (err, usuario) {
                    if (err) {
                        /* http://www.mongodb.org/about/contributors/error-codes/*/
                        if (err.code == 11000) {
                            // duplicate key error
                            // res, status, data, message, err
                            respHandler(res, 400, null, 'J&aacute; existe usu&aacute;rio com esse e-mail', 'J&aacute; existe usu&aacute;rio com esse e-mail');
                            return;
                        } else {
                            // res, status, data, message, err
                            respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                            return;
                        }
                    } else {
                        delete usuario.password;

                        // res, status, data, message, err
                        respHandler(res, 200, genToken(usuario), 'Success', null);
                    }

                });
            }
            //});
        });
    },

    login: function (req, res) {
        var user = req.body;
        var email = user.email || '';
        var password = user.password || '';

        if (email.trim() == '' || password.trim() == '') {
            // res, status, data, message, err
            respHandler(res, 401, null, 'E-mail ou senha inv&aacute;lidos', 'E-mail ou Senha inv&aacute;lidos');
            return;
        }

        Usuario.findOne({
            email: email
        }, function (err, usuario) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            } else if (!usuario) {
                // res, status, data, message, err
                respHandler(res, 403, null, 'E-mail ou senha inv&aacute;lidos', 'E-mail ou Senha inv&aacute;lidos');
                return;
            }
            // we found one user, let's validate the password now
            pwdMgr.comparePassword(user.password, usuario.password, function (err, isPasswordMatch) {
                if (isPasswordMatch) {
                    delete usuario.password;
                    // res, status, data, message, err
                    respHandler(res, 200, genToken(usuario), 'Success', null);
                } else {
                    // res, status, data, message, err
                    respHandler(res, 403, null, 'E-mail ou Senha inv&aacute;lidos', 'E-mail ou Senha inv&aacute;lidos');
                }
                return;
            });

        });
    },

    resetPassword: function (req, res) {
        var email = req.body.email || '';
        console.log('email ' + email);
        var novaSenha = generatePassword(6, false);

        if (email.trim() == '') {
            // res, status, data, message, err
            respHandler(res, 401, null, 'E-mail inv&aacute;lidos', 'E-mail inv&aacute;lidos');
            return;
        }

        Usuario.findOne({
            email: email
        }, function (err, usuario) {
            if (err) {
                respHandler(res, 500, null, 'E-mail n&atilde;o existe', err);
                return;
            }

            var senhaEmail = {
                email: usuario.email,
                subject: 'Nova Senha',
                text: novaSenha
            }

            emailService.enviar(JSON.stringify(senhaEmail));

            pwdMgr.cryptPassword(novaSenha, function (err, hash) {
                novaSenha = hash;
                console.log(novaSenha);
                usuario.password = novaSenha;
                usuario.save();
            });

            // res, status, data, message, err
            respHandler(res, 200, usuario, 'Success', null);
        });
    },

    validate: function (id, callback) {

        Usuario.findOne({
            _id: id
        }, callback);

    }
}

// private method
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires,
        user: user,
    }, require('../utils/secret'));
    return {
        token: token,
        expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = AutenticacaoAPI;
