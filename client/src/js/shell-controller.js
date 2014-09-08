(function () {
  'use strict';

  angular
    .module('app')
    .controller('ShellController', ShellController);

  function ShellController(authService) {

    /* jshint validthis: true */
    var vm = this;

    vm.authentication = authService.authentication;
  }

}());
