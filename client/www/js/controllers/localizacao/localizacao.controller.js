(function(){
  'use strict';
  var controllerId = 'localizacao';

  angular.module('enfileiramentoApp')
    .controller(controllerId, ['$scope', 'services', 'load', 'autenticacao', '$ionicHistory', '$location', localizacao]);

  function localizacao($scope, services, load, autenticacao, $ionicHistory, $location){
    var vm = this;
    var map;

    if (!autenticacao.isLoggedIn())
      $location.path('/login');

    var localizacao = {
      latitude: -20.463173,
      longitude: -54.611933
    }

    vm.localizacao = {
      endereco: '',
      latitude: '',
      longitude: ''
    }

    vm.botaoAdicionarLocalizacao = false;
    $scope.gPlace;

    function iniciarMapa(localizacao) {
      var latitude = localizacao.latitude;
      var longitude = localizacao.longitude;

      var myLatlng = new google.maps.LatLng(latitude, longitude);

      var mapOptions = {
        center: myLatlng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById("map"),
        mapOptions);

      //vm.map = map;
    }

    function geocodeLatLng(geocoder, map, infowindow, localizacao) {
      var input = localizacao.latitude + ',' + localizacao.longitude;
      var latlngStr = input.split(',', 2);
      var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};

      geocoder.geocode({'location': latlng}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {

            map.setCenter(latlng);
            map.setZoom(17);

           /* var marker = new google.maps.Marker({
              position: latlng,
              map: map
            });*/

            /*vm.localizacao = {
              endereco: results[0].formatted_address,
              latitude: localizacao.latitude,
              longitude: localizacao.longitude
            }*/

            /*infowindow.setContent(results[0].formatted_address);
            infowindow.open(map, marker);*/
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
    }

    vm.obterLocalizacao = function (localizacao) {

      localizacao = {
        latitude: (localizacao.latitude != null ? localizacao.latitude : localizacao.geometry.location.lat()),
        longitude: (localizacao.longitude != null ? localizacao.longitude : localizacao.geometry.location.lng())
      }

      var myLatlng = new google.maps.LatLng(localizacao.latitude, localizacao.longitude);

      /*var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };*/

      /*var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);*/

      var geocoder = new google.maps.Geocoder;
      var infowindow = new google.maps.InfoWindow;

      geocodeLatLng(geocoder, map, infowindow, localizacao);

      vm.botaoAdicionarLocalizacao = true;
      //vm.map = map;
    }

    vm.centerOnMe = function () {
      if (!map) {
        return;
      }

      load.showLoadingSpinner();

      navigator.geolocation.getCurrentPosition(function (pos) {
        localizacao = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }

        vm.obterLocalizacao(localizacao);
        load.hideLoading();
      }, function (error) {
        alert('Não foi possível buscar localização: ' + error.message);
        load.hideLoading();
      });
    };

    /*vm.adicionarLocalizacao = function () {
     load.showLoadingSpinner();

     if (usuario.usuarioId != "") {
     usuario = angular.toJson(usuario);
     localizacao = angular.toJson(vm.localizacao);
     $state.go('app.usuarioEditar', {'usuario': usuario, 'localizacao': localizacao})
     } else {
     localizacao = angular.toJson(vm.localizacao);
     $state.go('app.usuarioAdicionar', {'localizacao': localizacao})
     }

     load.toggleLoadingWithMessage('Localização adicionada.');
     }*/

    function obterLocalizacoesEstabelecimentos(){
      services.usuarioServices.obterTodosEstabelecimentos().success(function(response){
        vm.usuarios = response.data;

        vm.usuarios.forEach(function(usuario){

          var latlngset = new google.maps.LatLng(usuario.endereco.latitude, usuario.endereco.longitude);

          var marker = new google.maps.Marker({
            map: map, title: usuario.nome , position: latlngset
          });

          map.setCenter(marker.getPosition())

          var content = '<h4> <a href="#/app/fila/cliente/' + usuario._id + '">' + usuario.nome +  '</a> </h4>' + " Endereço: " + usuario.endereco.logradouro

          var infowindow = new google.maps.InfoWindow()

          google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){
            return function() {
              infowindow.setContent(content);
              infowindow.open(map,marker);
            };
          })(marker,content,infowindow));
        });

      });
    }

    vm.voltarPagina = function () {
      $ionicHistory.goBack();
    }

    function activate() {
      iniciarMapa(localizacao);
      obterLocalizacoesEstabelecimentos();
    }

    activate();
  }
})();
