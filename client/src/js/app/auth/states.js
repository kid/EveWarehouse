(function () {
  'use strict';

  angular.module('app.auth').config(RouterConfig);

  function RouterConfig($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/auth/login.html'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'app/auth/register.html'
      });
  }
}());
