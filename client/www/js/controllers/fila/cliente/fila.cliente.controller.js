(function(){
  'use strict';
  var controllerId = 'fila.cliente';

  angular.module('enfileiramentoApp')
    .controller(controllerId, ['services', 'load', '$ionicHistory', '$state', '$firebaseArray', '$timeout',
      '$ionicPopup', 'autenticacao', filaCliente]);

  function filaCliente(services, load, $ionicHistory, $state, $firebaseArray, $timeout, $ionicPopup, autenticacao){
    var vm = this;
    var filaRef;
    var fila;
    var estabelecimentoId = $state.params.estabelecimentoId;

    vm.voltarPagina = function () {
      $ionicHistory.goBack();
    }

    function obterUsuarioLogado(){
      vm.usuarioLogado = autenticacao.getUser();
    }

    function obterDadosDaFila(){
      $timeout(function(){
        vm.fila = fila;
        vm.posicao = fila.indexOf(_.find(fila, {usuarioId: vm.usuarioLogado._id})) + 1;
        vm.senha = _.filter(fila, {ativo: false}).length;
        load.hideLoading();
      }, 2000);
    }

    function obterFilaPorEstabelecimentoId(estabelecimento){
      filaRef = services.filaServices.obterTodosPorEstabelecimentoId(estabelecimento._id);
      fila = $firebaseArray(filaRef);

      filaRef.on('child_changed', function(childSnapshot, prevChildKey) {
        obterDadosDaFila();
      });

      obterDadosDaFila();
    }

    function obterEstabelecimentoPorId(id){
      load.showLoadingSpinner();

      services.usuarioServices.obterPorId(id).success(function(response){
        vm.establecimento = response.data;
      }).error(function (err, statusCode) {
        load.hideLoading();
        load.toggleLoadingWithMessage(err.message);
      }).then(function(){
        obterFilaPorEstabelecimentoId(vm.establecimento);
      });
    }

    function alertaSenhaGerada(usuario) {
      var alertPopup = $ionicPopup.alert({
        title: '<span class="alert_error"><i class="fa fa-exclamation-triangle"></i> '+  usuario.nome + '</span>',
        template: 'Sua senha já foi gerada, aguarde ser chamado.'
      });
      alertPopup.then(function (res) {
        //console.log('Thank you for not eating my delicious ice cream cone');
      });
    };

    function obterSenhaFila(){


    }

    vm.gerarSenha = function(usuario){

      if(vm.posicao > 0){
        alertaSenhaGerada(usuario);
      }
      else {
        vm.fila.$add({
          usuarioId: usuario._id,
          usuarioNome: usuario.nome,
          usuarioEmail: usuario.email,
          ativo: true,
          horario: Date.now()
        });

        vm.posicao = vm.fila.length + 1;
      }
    }

    function activate() {
      obterUsuarioLogado();
      obterEstabelecimentoPorId(estabelecimentoId);
    }

    activate();
  }
})();
