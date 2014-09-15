(function () {
  'use strict';

  angular.module('app.auth').config(RouterConfig);

  function RouterConfig($stateProvider) {
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'auth/login.html'
    });

    $stateProvider.state('register', {
      url: '/register',
      templateUrl: 'auth/register.html'
    });
  }
}());
