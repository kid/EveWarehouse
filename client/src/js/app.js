(function () {
  'use strict';

  angular
    .module('app', [
      'app.auth',
      'ui.router',
      'LocalStorageModule'
    ])
    .config(RouterConfig);

  function RouterConfig($stateProvider, $urlRouterProvider) {
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'auth/login.html'
    });

    $stateProvider.state('register', {
      url: '/register',
      templateUrl: 'auth/register.html'
    });

    $stateProvider.state('home', {
      url: '/home',
      controller: function () {
        console.log('home');
      }
    });
  }

})();
