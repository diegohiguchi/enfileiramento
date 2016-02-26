(function () {
  'use strict';

  var serviceId = 'services';

  angular.module('enfileiramentoApp').factory(serviceId, [
    'usuarioServices',
    'autenticacaoServices',
    'notificacaoServices',
    'deviceTokenServices',
    'localizacaoServices',
    'filaServices',
    services]);

  function services(usuarioServices, autenticacaoServices, notificacaoServices, deviceTokenServices,
                    localizacaoServices, filaServices) {

    var service = {
      usuarioServices: usuarioServices,
      autenticacaoServices: autenticacaoServices,
      notificacaoServices: notificacaoServices,
      deviceTokenServices: deviceTokenServices,
      localizacaoServices: localizacaoServices,
      filaServices: filaServices
    };

    return service;
  }
})();
