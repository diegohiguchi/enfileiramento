(function(){
  'use strict';
  var controllerId = 'home';

  angular.module('enfileiramentoApp')
    .controller(controllerId, ['services', 'load', 'autenticacao', '$ionicHistory', '$location', home]);

  function home(services, load, autenticacao, $ionicHistory, $location){
    var vm = this;

    vm.voltarPagina = function () {
      $ionicHistory.goBack();
    }

    function obterUsuarioLogado(){
      load.showLoadingSpinner();
      vm.usuario = autenticacao.getUser();
    }

    function redirecionarUsuario(usuario){
      if(usuario != undefined && usuario.tipoUsuario.nome == "Estabelecimento")
        $location.path('/app/dashboard/estabelecimento')
      else
        $location.path('/app/dashboard/cliente')

      load.hideLoading();
    }

    function activate() {
      if (!autenticacao.isLoggedIn())
        $location.path('/login');
      else {
        obterUsuarioLogado();
        redirecionarUsuario(vm.usuario);
      }
    }

    activate();
  }
})();
