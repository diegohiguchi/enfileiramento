var Usuario = require('../models/usuario.js');
var respHandler = require('../utils/responseHandler.js');
var pwdMgr = require('../utils/managePassword.js');

var UsuarioAPI = {

    obterTodos: function (req, res) {
        Usuario.find({}, function (err, usuario) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }
            // res, status, data, message, err
            respHandler(res, 200, usuario, 'Success', null);
        });
    },

    obterPorId: function (req, res) {
        Usuario.findOne({
            _id: req.params.id
        }, function (err, usuario) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }
            // res, status, data, message, err
            respHandler(res, 200, usuario, 'Success', null);
        });
    },

    adicionar: function (req, res) {
        console.log(req.body);
        var usuario = req.body;
        var nome = usuario.nome || '';
        var email = usuario.email || '';
        var password = usuario.password || '';
        var tipoUsuarioNome = usuario.tipoUsuarioNome || '';

        // name is optional
        if (nome.trim() == '' || email.trim() == '' || password.trim() == '' || tipoUsuarioNome.trim() == '') {
            // res, status, data, message, err
            respHandler(res, 401, null, 'E-mail ou Senha inv&aacute;lidos', 'Credenciais inv&aacute;lidos');
            return;
        }

        pwdMgr.cryptPassword(usuario.password, function (err, hash) {
            usuario.password = hash;

                if (err)
                    respHandler(res, 500, null, 'Oops...', err);

                else {
                    var novoUsuario = new Usuario({
                        nome: usuario.nome,
                        email: usuario.email,
                        password: usuario.password,
                        tipoUsuarioId: usuario.tipoUsuario,
                        urlImagem: usuario.urlImagem,
                        cnpj: usuario.cnpj,
                        telefoneFixo: usuario.telefoneFixo,
                        telefoneCelular: usuario.telefoneCelular,
                        localizacoes: usuario.localizacoes
                    });

                    novoUsuario.save(function (err, usuario) {
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
                            //delete usuario.password;

                            // res, status, data, message, err
                            //respHandler(res, 200, genToken(usuario), 'Success', null);
                            respHandler(res, 200, usuario, 'Success', null);
                        }

                    });
                }
        });
    },

    editar: function (req, res) {
        var usuarioAtual = req.body || '';

        Usuario.findOne({
            _id: usuarioAtual.usuarioId
        }, function (err, usuario) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }

            usuario.nome = usuarioAtual.nome;
            usuario.email = usuarioAtual.email;
            //usuario.tipoUsuarioId = usuarioAtual.tipoUsuarioId;
            usuario.cnpj = usuarioAtual.cnpj;
            usuario.urlImagem = usuarioAtual.urlImagem;
            usuario.telefone = usuarioAtual.telefone;
            usuario.endereco = usuarioAtual.endereco;

            if (usuarioAtual.categoriaId != null)
                usuario.categorias.push(usuarioAtual.categoriaId);

            if (usuarioAtual.localizacaoId != null)
                usuario.localizacoes.push(usuarioAtual.localizacaoId);

            if (usuarioAtual.password != undefined && usuarioAtual.password.trim()) {
                pwdMgr.cryptPassword(usuarioAtual.password, function (err, hash) {
                    usuarioAtual.password = hash;
                    usuario.save();
                    respHandler(res, 200, usuario, 'Success', null);
                });
            } else {
                usuario.save();
                respHandler(res, 200, usuario, 'Success', null);
            }
        });
    },

    adicionarCategoria: function (req, res) {
        var usuarioAtual = req.body || '';

        // name is optional
        if (usuarioAtual.categoriaId == '' || usuarioAtual.categoriaId == null) {
            // res, status, data, message, err
            respHandler(res, 401, null, 'Informe a categoria');
            return;
        }

        Usuario.findOne({
            _id: usuarioAtual._id
        }, function (err, usuario) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }

            usuario.categorias.push(usuarioAtual.categoriaId);
            usuario.save();

            // res, status, data, message, err
            respHandler(res, 200, usuario, 'Success', null);
        });
    },

    removerCategoria: function (req, res) {
        var usuarioAtual = req.body || '';

        Usuario.findOne({
            _id: usuarioAtual._id
        }, function (err, usuario) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }

            /*usuario.categorias.forEach(function(id){
            if(id == usuarioAtual.categoriaId)*/
            var index = usuario.categorias.indexOf(usuarioAtual.categoriaId);
            console.log(index);
            usuario.categorias.splice(index, 1);
            //});

            usuario.save();

            // res, status, data, message, err
            respHandler(res, 200, usuario, 'Success', null);
        });
    },

    obterFornecedoresPorCategoriaId: function (req, res) {
        Usuario.find({
            categorias: req.params.id
        }, function (err, usuario) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }
            // res, status, data, message, err
            respHandler(res, 200, usuario, 'Success', null);
        });
    },

    obterListaUsuariosPorId: function (req, res) {
        var usuarios = req.body || '';
        console.log('usuariosId ' + usuarios);
        Usuario.find({
            _id: { $in: usuarios }
        }).exec(function (err, usuario) {
            //console.log(usuario);
            respHandler(res, 200, usuario, 'Success', null);
        });
    },

    obterTodosEstabelecimentos: function (req, res) {
        Usuario.find({
            'tipoUsuario.nome': 'Estabelecimento'
        }, function (err, usuario) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            }
            // res, status, data, message, err
            respHandler(res, 200, usuario, 'Success', null);
        });
    },

    remover: function (req, res) {
        Usuario.remove({
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
    }
}

module.exports = UsuarioAPI;
