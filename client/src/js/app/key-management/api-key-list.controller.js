(function () {
  'use strict';

  angular.module('app.keyManagement').controller('ApiKeyList', ApiKeyList);

  function ApiKeyList(apiKeyService) {
    /* jshint validthis: true */
    var vm = this;

    vm.keys = apiKeyService.keys;

    activate();

    function activate() {
      return apiKeyService.getKeys();
    }
  }
}());
