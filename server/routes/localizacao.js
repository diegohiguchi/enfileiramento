var respHandler = require('../utils/responseHandler.js');
var request = require('../node_modules/request');

var LocalizacaoAPI = {

    obterCep: function (req, res) {
        var cep = req.params.cep;

        if (cep == undefined || cep.trim() == '') {
            // res, status, data, message, err
            respHandler(res, 401, null, 'Preencha o campo CEP');
            return;
        }

        request("http://api.postmon.com.br/v1/cep/" + cep, function (error, response, body) {
            if (body.trim() == '')
                respHandler(res, 500, null, 'CEP inválido', null);
            else
                respHandler(res, 200, JSON.parse(body), 'Success', null);
        });
    }

}

module.exports = LocalizacaoAPI;
