(function () {
  'use strict';

  angular.module('app.account').factory('ApiKeyService', ApiKeyService);

  function ApiKeyService($http, $log, API_ROOT_URL) {
    var service = {
      keys: [],

      addKey: addKey,
      getKeys: getKeys,

      log: $log.log
    };

    return service;

    ///////////////

    function addKey(data) {
      return $http.post(API_ROOT_URL + 'apiKeys', data);
    }

    function getKeys() {
      return $http
        .get(API_ROOT_URL + 'apiKeys')
        .success(function (data) {
          vm.keys = data;
        })
        .error(function (error) {
          // TODO decides what to do here.
          service.log(error);
        });
    }
  }
}());