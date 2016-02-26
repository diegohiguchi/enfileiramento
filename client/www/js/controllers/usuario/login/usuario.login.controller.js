(function(){
  'use strict';
  var controllerId = 'usuario.login';

  angular.module('enfileiramentoApp').controller(controllerId, [
    '$rootScope', 'services', '$location', 'autenticacao', 'load',
    '$ionicPush', '$ionicUser','$cordovaCamera', '$ionicPopup', '$ionicModal', '$scope', login]);

  function login($rootScope, services, $location, autenticacao, load, $ionicPush, $ionicUser,
      $cordovaCamera, $ionicPopup, $ionicModal, $scope){
    var vm = this;
    vm.formLogin = false;
    vm.formRegistro = false;
    vm.estabelecimento = false;
    vm.mensagem = '';
    vm.tipoUsuario = [{ tipoUsuarioId: 1, nome: 'Cliente' }, { tipoUsuarioId: 2, nome: 'Estabelecimento' }];
    vm.usuario = {
      email: '',
      password: '',
      urlImagem: '',
      endereco: {}
    };

    $rootScope.$on('$cordovaPush:tokenReceived', function (event, data) {
      console.log('Got token', data.token, data.platform);
      adicionarDeviceToken(data.token);
    });

    function redirecionarHome(tipoUsuario) {
      if (tipoUsuario.nome === 'Estabelecimento')
        $location.path('/app/cotacao/dashboard/estabelecimento');
      else if (tipoUsuario.nome === 'Cliente')
        $location.path('/app/home');
    }

    function identificarUsuario() {
      console.log('Identifying user');

      var user = $ionicUser.get();
      if (!user.user_id) {
        // Set your user_id here, or generate a random one
        user.user_id = $ionicUser.generateGUID()
      }

      angular.extend(user, {
        name: 'Test User',
        message: 'I come from planet Ion'
      });

      $ionicUser.identify(user);
    }

    function adicionarDeviceToken(token) {
      var usuario = autenticacao.getUser();

      var device = {
        usuarioId: usuario._id,
        token: token
      }

      services.deviceTokenServices.register(device).then(function (response) {
      });

      load.hideLoading();
    }

    function obterDeviceToken() {
      $ionicPush.register({
        canShowAlert: false,
        onNotification: function (notification) {
          // Called for each notification for custom handling
          vm.lastNotification = JSON.stringify(notification);
        }
      }).then(function (deviceToken) {
        vm.token = deviceToken;
        //adicionarDeviceToken(vm.token);
        console.log(vm.token);
      });
      //}
    }

    vm.loginGoogle = function (){
      var ref = services.autenticacaoServices.loginGoogle();

      ref.authWithOAuthPopup("google", function(error, authData) {
        console.log(authData);

      /*  autenticacao.setUser(authData.user);
        autenticacao.setToken({
          token: response.token,
          expires: response.expires
        });*/

        /*$rootScope.isAuthenticated = true;*/

        $location.path('/app/home');
      }, {
        remember: "sessionOnly",
        scope: "email"
      });
    }

    vm.login = function (usuario) {
      load.showLoadingSpinner();

      services.autenticacaoServices.login(usuario).success(function (response) {

        response = response.data;
        autenticacao.setUser(response.user);
        autenticacao.setToken({
          token: response.token,
          expires: response.expires
        });

        $rootScope.isAuthenticated = true;

        identificarUsuario();
        redirecionarHome(response.user.tipoUsuario);
      }).error(function (err, statusCode) {
        load.hideLoading();
        load.toggleLoadingWithMessage(err.message);
      });
    }

    function salvarUsuario(usuario){
      services.autenticacaoServices.registrar(usuario).success(function (response) {

        response = response.data;
        autenticacao.setUser(response.user);
        autenticacao.setToken({
          token: response.token,
          expires: response.expires
        });

        $rootScope.isAuthenticated = true;

        identificarUsuario();
        obterDeviceToken();
        redirecionarHome(response.user.tipoUsuario);
      }).error(function (err, statusCode) {
        load.hideLoading();
        load.toggleLoadingWithMessage(err.message);
      });
    }

    vm.registrar = function (usuario) {
      if (vm.mensagem != '')
        return;
      load.showLoadingSpinner();

      if(usuario.tipoUsuario.nome == "Estabelecimento")
        buscarLocalizacao(vm.usuario.endereco.logradouro, usuario);
      else
        salvarUsuario(usuario);
    }

    function buscarLocalizacao(endereco, usuario) {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': endereco}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
          usuario.endereco.latitude = results[0].geometry.location.lat();
          usuario.endereco.longitude = results[0].geometry.location.lng();

          salvarUsuario(usuario);
        }
      });
    }

    vm.buscarCep = function (cep) {
      if (cep == undefined) {
        vm.usuario.endereco = {};
        vm.usuario.cep = '';
        vm.mensagem = '';
        return;
      }

      load.showLoadingSpinner();
      services.localizacaoServices.obterCep(cep).success(function (response) {
        vm.mensagem = '';
        vm.usuario.endereco = response.data;
        load.hideLoading();
      }).error(function (err, statusCode) {
        vm.usuario.endereco = {};
        vm.mensagem = err.message;
        load.hideLoading();
      });
    }

    vm.tipoUsuarioEscolhido = function(tipoUsuario){
      if(tipoUsuario != undefined && tipoUsuario.nome == "Estabelecimento")
        vm.estabelecimento = true;
      else
        vm.estabelecimento = false;
    }

    vm.showPopup = function () {
      var myPopup = $ionicPopup.show({
        //templateUrl: 'popupImagem.html',
        title: 'Escolher imagem',
        cssClass: '.popup-buttons .button',
        buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
          text: 'C&acirc;mera',
          type: 'button icon-left ion-camera button-clear button-dark',
          onTap: function (e) {
            // e.preventDefault() will stop the popup from closing when tapped.
            return vm.tirarFoto();
          }
        }, {
          text: 'Documentos',
          type: 'button icon-left ion-android-list button-clear button-dark',
          onTap: function (e) {
            // Returning a value will cause the promise to resolve with the given value.
            return vm.selecionarFoto();
          }
        }]
      });
    };

    vm.tirarFoto = function () {
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
        //correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        //var image = document.getElementById('myImage');
        vm.usuario.urlImagem = "data:image/jpeg;base64," + imageData;
      }, function (err) {
        // error
      });
    }

    vm.selecionarFoto = function () {
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        vm.usuario.urlImagem = "data:image/jpeg;base64," + imageData;
      }, function (err) {
        // An error occured. Show a message to the user
      });
    }

    $ionicModal.fromTemplateUrl('formEsqueceuSenha.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      vm.modal = modal;
    });

    vm.abrirModalEsqueceuSenha = function () {
      vm.modal.show();
    };

    vm.fecharModalEsqueceuSenha = function () {
      vm.modal.hide();
    };

    vm.enviarSenha = function (email) {
      load.showLoading('Enviando...');
      services.loginServices.resetPassword(email).success(function (response) {
        load.toggleLoadingWithMessage('Nova senha enviada com sucesso.');
      }).error(function (err, statusCode) {
        load.hideLoading();
        load.toggleLoadingWithMessage(err.message);
      });
    }

    function activate(){

    }

    activate();
  }
})();
