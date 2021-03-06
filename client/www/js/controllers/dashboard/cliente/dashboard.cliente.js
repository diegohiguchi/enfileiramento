(function () {
  'use strict';
  var controllerId = 'dashboard.cliente';

  angular.module('enfileiramentoApp').controller(controllerId, ['socket', 'services', 'autenticacao', 'load',
    '$state', '$cordovaBadge', dashboardCliente]);

  function dashboardCliente(socket, services, autenticacao, load, $state, $cordovaBadge) {
    socket.connect();
    var vm = this;
    vm.notificacao = [];

    function obterQuantidadeNotificacoesIcone(quantidade) {
      $cordovaBadge.promptForPermission();
      $cordovaBadge.hasPermission().then(function (result) {
        $cordovaBadge.set(quantidade);
      }, function (error) {
        console.log(error);
      });
    }

    function obterUsuarioLogado() {
      vm.usuario = autenticacao.getUser();
      //socket.emit('adiciona-usuario', vm.usuario);
    }

    function adicionarNotificacao(data) {
      var notificacao = {
        mensagem: data.mensagem,
        data: data.data,
        ativo: data.ativo,
        usuarioId: vm.usuario._id
      };

      vm.notificacao.push(notificacao);

      obterQuantidadeNotificacoesIcone(vm.notificacao.length);
    }

    socket.on('notificacao-chat-fornecedor', function(data){
      adicionarNotificacao(data);
    });

    socket.on('envia-solicitacao', function (data) {
      vm.solicitacoes.push(data.solicitacao);
      adicionarNotificacao(data);
    });

    function obterNotificacoes(usuarioId) {
      services.notificacaoServices.obterNotificacoesEmAbertoPorUsuarioId(usuarioId).success(function (response) {
        vm.notificacao = response.data;

        obterQuantidadeNotificacoesIcone(vm.notificacao.length);
      });
    }

    function activate() {
      obterUsuarioLogado();
      //obterNotificacoes(vm.usuario._id);
    }

    activate();
  }

})();
