(function () {
  'use strict';

  var connectionId = 'connection';

  function connection() {
    var baseDesenvolvimento = 'http://localhost:3000';
    var baseProducao = 'http://enfileiramento.herokuapp.com';

    function base() {
      return baseDesenvolvimento;
    }

    var connections = {
      base: base
    };

    return connections;
  }

  angular.module('enfileiramentoApp').factory(connectionId, [connection]);
})();
