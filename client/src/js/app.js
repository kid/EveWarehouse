(function () {
  'use strict';

  function RouterConfig($stateProvider, $urlRouterProvider) {
    $stateProvider.state('login', {
      url: '/login',
      controller: 'LoginController'
    });

    $stateProvider.state('home', {
      url: '/home',
      controller: 'HomeController'
    });
  }

  angular
    .module('app', [
      'ui.router',
      'app.auth'
    ])
    .config(RouterConfig);

})();
