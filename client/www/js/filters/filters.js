(function () {
    'use strict';

  var app = angular.module('enfileiramentoApp');

  app.filter('isEmpty', [function () {
    return function (object) {
      return angular.equals({}, object);
    }
  }]);

  app.filter('checked', function () {
    return function (data) {
      return (data != undefined && data.length) > 0 ? 'checked' : '';
    };
  });

})();
