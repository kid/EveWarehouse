(function () {
  'use strict';

  angular
    .module('app.auth')
    .factory('authService', authService);

  function authService($http, $q, localStorageService, API_ROOT_URL) {

    var service = {
      authentication: {
        isAuthenticated: false,
        userName: ''
      },

      login: login,
      logout: logout,
      register: register,
      fillAuthData: fillAuthData
    };

    return service;

    ///////////////

    function login(loginData) {
      var deferred = $q.defer();

      var data = 'grant_type=password&username=' + loginData.userName + '&password=' + loginData.password;
      $http
        .post(API_ROOT_URL + 'token', data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .success(function (response) {
          localStorageService.set('authorizationData', {
            token: response.access_token, // jshint ignore:line
            userName: loginData.userName,
          });

          service.authentication.isAuthenticated = true;
          service.authentication.userName = loginData.userName;

          deferred.resolve(response);
        })
        .error(function (error, status) {
          service.logout();
          deferred.reject(error);
        });

      return deferred.promise;
    }

    function logout() {
      localStorageService.remove('authorizationData');

      service.authentication.isAuthenticated = false;
      service.authentication.userName = '';
    }

    function register(registrationData) {
      service.logout();

      return $http.post(API_ROOT_URL + 'accounts/register', registrationData).then(function (response) {
        return response;
      });
    }

    function fillAuthData() {
      var authData = localStorageService.get('authorizationData');
      if (authData) {
        service.authentication.isAuthenticated = true;
        service.authentication.userName = authData.userName;
      }
    }
  }

})();
