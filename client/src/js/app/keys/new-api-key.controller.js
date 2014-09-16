(function () {
  'use strict';

  angular.module('app.keys').controller('NewApiKey', NewApiKey);

  function NewApiKey(apiKeyService) {
    /* jshint validthis: true */
    var vm = this;

    vm.key = {};
    vm.submit = submit;

    function submit() {
      apiKeyService.addKey(vm.key);
    }
  }
}());
