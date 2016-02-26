angular
  .module('enfileiramentoApp')
  .config(config);

function config($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('login', {
      url: "/login",
      templateUrl: "templates/usuario/login/usuario.login.html"
    })

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu/menu.html'
    })

    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home/home.html'
        }
      }
    })

    .state('app.dashboardCliente', {
      url: '/dashboard/cliente',
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard/cliente/dashboard.cliente.html'
        }
      }
    })

    .state('app.dashboardEstabelecimento', {
      url: '/dashboard/estabelecimento',
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard/estabelecimento/dashboard.estabelecimento.html'
        }
      }
    })

    .state('app.localizacao', {
      url: '/localizacao',
      views: {
        'menuContent': {
          templateUrl: 'templates/localizacao/localizacao.html'
        }
      }
    })

    .state('app.filaCliente', {
      url: '/fila/cliente/:estabelecimentoId',
      views: {
        'menuContent': {
          templateUrl: 'templates/fila/cliente/fila.cliente.html'
        }
      }
    })

    .state('app.filaEstabelecimento', {
      url: '/fila/estabelecimento',
      views: {
        'menuContent': {
          templateUrl: 'templates/fila/estabelecimento/fila.estabelecimento.html'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('app/home');
}
