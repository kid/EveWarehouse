(function () {
  'use strict';

  angular
    .module('app.auth')
    .factory('authInterceptorService', authInterceptorServiceFactory);

  function authInterceptorServiceFactory($q, $injector, localStorageService) {
    var service = {
      request: request,
      responseError: responseError
    };

    function request(config) {
      config.headers = config.headers || {};

      var authData = localStorageService.get('authorizationData');
      if (authData) {
        config.headers.Authorization = 'Bearer ' + authData.token;
      }

      return config;
    }

    function responseError(rejection) {
      if (rejection.status === 401) {
        $injector.get('$state').go('login');
      }

      return $q.reject(rejection);
    }

    return service;
  }

})();
