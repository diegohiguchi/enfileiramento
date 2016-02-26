(function(){
  'use strict';
  var controllerId = 'fila.estabelecimento';

  angular.module('enfileiramentoApp')
    .controller(controllerId, ['services', 'load', '$ionicHistory', '$firebaseArray', '$timeout',
      'autenticacao', filaEstabelecimento]);

  function filaEstabelecimento(services, load, $ionicHistory, $firebaseArray, $timeout, autenticacao){
    var vm = this;
    var fila;

    vm.voltarPagina = function () {
      $ionicHistory.goBack();
    }

    function obterEstabelecimentoLogado(){
      vm.estabelecimentoLogado = autenticacao.getUser();
    }

    function obterFilaPorEstabelecimentoId(estabelecimento){
      load.showLoadingSpinner();
      var filaRef = services.filaServices.obterTodosPorEstabelecimentoId(estabelecimento._id);
      fila = $firebaseArray(filaRef);

      filaRef.on('value', function(dataSnapshot) {
        $timeout(function(){
          vm.fila = _.filter(fila, {ativo: true});
          vm.usuarioFila = _.first(vm.fila);
          vm.senha = _.filter(fila, {ativo: false}).length;
          load.hideLoading();
        }, 1000)
      });
    }

    function notificarUsuario(usuario){

      var ref = services.notificacaoServices.notificarUsuarioId(usuario.usuarioId);
      vm.notificacao = $firebaseArray(ref);

      var mensagem = usuario.usuarioNome + ' sua vez de ser atendido!';

      vm.notificacao.$add({
        estabelecimentoId: vm.estabelecimentoLogado._id,
        estabelecimentoNome: vm.estabelecimentoLogado.nome,
        mensagem: mensagem,
        ativo: true,
        horario: Date.now()
      });

      //load.hideLoading();
    }

    vm.chamarProximoUsuario = function(usuario){
      if(usuario == undefined)
        return;

      load.showLoadingSpinner();
      /*if(vm.senha > 0) {*/
      var usuarioAtual = _.find(vm.fila, {usuarioId: usuario.usuarioId});
      var usuarioRef = services.filaServices.obterUsuarioPorFilaId(vm.estabelecimentoLogado._id, usuarioAtual.$id);

      usuarioRef.update({ativo: false});

      vm.fila = _.filter(fila, {ativo: true}).length;
      vm.senha = vm.senha + 1;

      //if(vm.fila > 0)
      notificarUsuario(usuario);
      //}
      /*else {
       notificarUsuario(usuario);
       vm.senha = vm.senha + 1;
       }*/
    }

    vm.chamarUsuarioAtual = function(usuario){
      if(usuario == undefined)
        return;

      notificarUsuario(usuario);
    }

    function activate() {
      obterEstabelecimentoLogado();
      obterFilaPorEstabelecimentoId(vm.estabelecimentoLogado);
    }

    activate();
  }
})();
