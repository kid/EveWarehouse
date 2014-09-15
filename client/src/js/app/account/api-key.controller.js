(function () {
  'use strict';

  angular.module('app.account').controller('ApiKeyController', ApiKeyController);

  function ApiKeyController(ApiKeyService) {
    /* jshint validthis: true */
    var vm = this;
    vm.keys = ApiKeyService.keys;

    ApiKeyService.getKeys();
    window.vm = vm;
  }
}());
