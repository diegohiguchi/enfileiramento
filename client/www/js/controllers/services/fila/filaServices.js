(function () {
  'use strict';

  var filaServicesId = 'filaServices';

  angular.module('enfileiramentoApp').factory(filaServicesId, ['$http', 'autenticacao', 'connection', filaServices]);

  function filaServices($http, autenticacao, connection) {

    function obterTodosPorEstabelecimentoId(id){
      return new Firebase("https://enfileiramento.firebaseio.com/estabelecimento/" + id);
    }

    function obterUsuarioPorFilaId(estabelecimentoId, filaId){
      return new Firebase("https://enfileiramento.firebaseio.com/estabelecimento/" + estabelecimentoId + "/" + filaId);
    }

    var services = {
      obterTodosPorEstabelecimentoId: obterTodosPorEstabelecimentoId,
      obterUsuarioPorFilaId: obterUsuarioPorFilaId
    };

    return services;
  }
})();
