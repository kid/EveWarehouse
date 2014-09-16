(function () {
  'use strict';

  angular.module('app.keys').factory('apiKeyService', apiKeyService);

  function apiKeyService($http, $log, API_ROOT_URL) {
    var service = {
      keys: [],

      addKey: addKey,
      getKeys: getKeys,

      log: $log.log
    };

    return service;

    ///////////////

    function addKey(key) {
      return $http.post(API_ROOT_URL + 'apiKeys', key);
    }

    function getKeys() {
      return $http
        .get(API_ROOT_URL + 'apiKeys')
        .success(function (data) {
          service.keys = data;
        })
        .error(function (error) {
          // TODO decides what to do here.
          service.log(error);
        });
    }
  }
}());
