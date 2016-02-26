(function () {
  'use strict';

  var autenticacaoServicesId = 'autenticacaoServices';

  angular.module('enfileiramentoApp').factory(autenticacaoServicesId, ['$http', 'autenticacao', 'connection', autenticacaoServices]);

  function autenticacaoServices($http, autenticacao, connection) {

    function loginGoogle(){
      return new Firebase("https://enfileiramento.firebaseio.com/");
    }

    function login(usuario) {
      return $http.post(connection.base() + '/autenticacao/login', usuario);
    }

    function registrar(usuario) {
      return $http.post(connection.base() + '/autenticacao/registrar', usuario);
    }

    function logout() {
      autenticacao.deleteAuth();
    }

    function resetPassword(email) {
      return $http.post(connection.base() + '/autenticacao/resetPassword/'+ email);
    }

    var services = {
      loginGoogle: loginGoogle,
      login: login,
      registrar: registrar,
      logout: logout,
      resetPassword: resetPassword
    };

    return services;
  }
})();
