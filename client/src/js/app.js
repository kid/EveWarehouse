(function () {
  'use strict';

  angular
    .module('app', [
      'app.auth',
      'app.home',
      'ui.router',
      'LocalStorageModule'
    ])
    .constant('API_ROOT_URL', 'https://evewarehouse.azurewebsites.net/api/')
    .config(RouterConfig)
    .config(HttpProviderConfig)
    .run(OnRun);

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

  function HttpProviderConfig($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
  }

  function OnRun($rootScope, authService) {
    var darkPages = ['login', 'register'];

    $rootScope.$on('$stateChangeStart', function (event, toState) {
      $rootScope.isDarkBackground = darkPages.indexOf(toState.name) !== -1;
    });

    authService.fillAuthData();
  }

})();
