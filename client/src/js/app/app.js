(function () {
  'use strict';

  angular
    .module('app', [
      'app.auth',
      'app.layout',
      'app.dashboard',
      'app.keys',
      'ui.router',
      'ui.bootstrap',
      'LocalStorageModule'
    ])
    .constant('API_ROOT_URL', '/EveWarehouse.Api/api/')
    .config(RouterConfig)
    .config(HttpProviderConfig)
    .run(OnRun);

  function RouterConfig($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app', {
      abstract: true,
      templateUrl: 'app/layout/shell.html'
    });
  }

  function HttpProviderConfig($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
  }

  function OnRun($rootScope, $state, authService) {
    var darkPages = ['login', 'register'];

    $rootScope.$state = $state;
    $rootScope.skin = 'black';

    $rootScope.$on('$stateChangeStart', function (event, toState) {
      $rootScope.isDarkBackground = toState && toState.name && darkPages.indexOf(toState.name) !== -1;
    });

    authService.fillAuthData();

    window.$rootScope = $rootScope;
  }
}());
