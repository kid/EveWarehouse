(function () {
  'use strict';

  angular
    .module('app')
    .controller('ShellController', ShellController);

  function ShellController($state, authService) {

    /* jshint validthis: true */
    var vm = this;

    vm.authentication = authService.authentication;
  }
}());
