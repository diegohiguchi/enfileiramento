angular
  .module('enfileiramentoApp')
  .config(config)
  .run(run);

function config($ionicAppProvider){
  // Identify app
  $ionicAppProvider.identify({
    // Your App ID
    app_id: '2424facc',
    // The public API key services will use for this app
    api_key: '752cc1b64af4dc6af1c7b4f94cba9d5481e6d9c429ca77a5',
    // Your GCM sender ID/project number (Uncomment if supporting Android)
    //gcm_id: 'YOUR_GCM_ID'
    gcm_id: '667747083606'
  });
}

function run ($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}
