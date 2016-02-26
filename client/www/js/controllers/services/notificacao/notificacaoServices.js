(function () {
  'use strict';

  var notificacaoServicesId = 'notificacaoServices';

  angular.module('enfileiramentoApp').factory(notificacaoServicesId, ['$http', 'connection', notificacaoServices]);

  function notificacaoServices($http, connection) {

    function obterTodasPorUsuarioId(id){
      return new Firebase("https://enfileiramento.firebaseio.com/notificacao/" + id);
    }

    function notificarUsuarioId(id){
      return new Firebase("https://enfileiramento.firebaseio.com/notificacao/" + id);
    }

    function obterTodas() {
      return $http.get(connection.base() + '/notificacao/obterTodas');
    }

    function obterPorId(id) {
      return $http.get(connection.base() + '/notificacao/obterPorId/' + id);
    }

    function adicionar(notificacao){
      return $http.post(connection.base() + '/notificacao/adicionar', notificacao);
    }

    function editar(notificacao){
      return $http.post(connection.base() + '/notificacao/editar', notificacao);
    }

    function remover(id){
      return $http.post(connection.base() + '/notificacao/remover/' + id);
    }

    function obterPorNome(nome) {
      return $http.get(connection.base() + '/notificacao/obterPorNome/' + nome);
    }

    function obterPorUsuarioId(id) {
      return $http.get(connection.base() + '/notificacao/obterPorUsuarioId/' + id);
    }

    function obterNotificacoesEmAbertoPorUsuarioId(id) {
      return $http.get(connection.base() + '/notificacao/obterNotificacoesEmAbertoPorUsuarioId/' + id);
    }

    function editarListaPorUsuarioId(id) {
      return $http.get(connection.base() + '/notificacao/editarListaPorUsuarioId/' + id);
    }

    var services = {
      obterTodasPorUsuarioId: obterTodasPorUsuarioId,
      notificarUsuarioId: notificarUsuarioId,
      obterTodas: obterTodas,
      obterPorId: obterPorId,
      adicionar: adicionar,
      editar: editar,
      remover: remover,
      obterPorNome: obterPorNome,
      obterPorUsuarioId: obterPorUsuarioId,
      obterNotificacoesEmAbertoPorUsuarioId: obterNotificacoesEmAbertoPorUsuarioId,
      editarListaPorUsuarioId: editarListaPorUsuarioId
    };

    return services;
  }
})();
