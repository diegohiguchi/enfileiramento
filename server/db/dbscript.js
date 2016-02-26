var Usuario = require('../models/usuario.js');
var pwdMgr = require('../utils/managePassword.js');

var usuarioAdmin = {
    nome: 'administrador',
    email: 'admin@up.com.br',
    password: 'Admin.123',
    tipoUsuario: {
        tipoUsuarioId: 0,
        nome: 'Administrador'
    }
};

pwdMgr.cryptPassword(usuarioAdmin.password, function (err, hash) {
    usuarioAdmin.password = hash;

    var usuario = new Usuario({
        nome: usuarioAdmin.nome,
        email: usuarioAdmin.email,
        password: usuarioAdmin.password,
        tipoUsuario: usuarioAdmin.tipoUsuario
    });

    usuario.save(function (err) {
        /*if (err)
            console.log('erro: ' + err);*/
    });
});


