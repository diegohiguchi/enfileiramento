(function(){
  'use strict';
  var controllerId = 'menu';

  angular.module('enfileiramentoApp').controller(controllerId, ['$rootScope', '$location', 'autenticacao', 'services', 'load', '$cordovaBadge', menu]);

  function menu($rootScope, $location, autenticacao, services, load, $cordovaBadge) {
    var vm = this;


    function obterUsuario() {
      vm.usuario = autenticacao.getUser();
    }

    function limparQuantidadeNotificacoes() {
      $cordovaBadge.promptForPermission();
      $cordovaBadge.hasPermission().then(function (result) {
        $cordovaBadge.set(0);
      }, function (error) {
        console.log(error);
      });
    }

    vm.logout = function () {
      load.showLoadingSpinner();
      //limparQuantidadeNotificacoes();
      services.autenticacaoServices.logout();
      $rootScope.isAuthenticated = false;
      $location.path('/login');
      localStorage.clear();
      load.hideLoading();
    };

    vm.atualizarImagem = function () {
      obterUsuario();
    }

    function activate() {
      if (!autenticacao.isLoggedIn())
        $location.path('/login');
      else
        obterUsuario();
    }

    activate();
  }
})();
