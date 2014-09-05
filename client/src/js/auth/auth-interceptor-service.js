(function () {
  'use strict';

  angular
    .module('app.auth')
    .factory('authInterceptorService', authInterceptorServiceFactory);

  function authInterceptorServiceFactory($q, $state, localStorageService) {
    var service = {
      request: request,
      responseError: responseError
    };

    function request(config) {
      config.headers = config.haeders || {};

      var authData = localStorageService.get('authorizationData');
      if (authData) {
        config.headers.Authorization = 'Bearer ' + authData.token;
      }

      return config;
    }

    function responseError(rejection) {
      if (rejection.status === 401) {
        $state.go('login');
      }

      return $q.reject(rejection);
    }

    return service;
  }

})();
