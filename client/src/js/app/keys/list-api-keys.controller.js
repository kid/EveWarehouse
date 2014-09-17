(function () {
  'use strict';

  angular.module('app.keys').controller('ListApiKeys', ListApiKeys);

  function ListApiKeys(apiKeyService) {
    /* jshint validthis: true */
    var vm = this;

    vm.keys = apiKeyService.keys;
    window.vm = vm;
    activate();

    function activate() {
      return apiKeyService.getKeys().then(activateSuccess);

      function activateSuccess() {
        vm.keys = apiKeyService.keys;
      }
    }
  }
}());
