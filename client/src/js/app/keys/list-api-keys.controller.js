(function () {
  'use strict';

  angular.module('app.keys').controller('ListApiKeys', ListApiKeys);

  function ListApiKeys(apiKeyService) {
    /* jshint validthis: true */
    var vm = this;

    vm.keys = apiKeyService.keys;

    activate();

    function activate() {
      return apiKeyService.getKeys();
    }
  }
}());
