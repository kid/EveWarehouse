(function () {
  'use strict';

  angular
    .module('app', [
      'app.auth',
      'app.keyManagement',
      'app.home',
      'ui.router',
      'ui.bootstrap',
      'LocalStorageModule'
    ])
    .constant('API_ROOT_URL', '/EveWarehouse.Api/api/')
    .config(RouterConfig)
    .config(HttpProviderConfig)
    .run(OnRun);

  function RouterConfig($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
      abstract: true,
      templateUrl: 'app/shell.html'
    });

    $stateProvider.state('home.dashboard', {
      url: '/home',
      views: {
        'page-content': {
          template: '<h1>foo</h1>'
        }
      }
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
