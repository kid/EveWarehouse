(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('ShellController', ShellController);

  function ShellController($state, authService) {

    /* jshint validthis: true */
    var vm = this;
    vm.logout = logout;
    vm.authentication = authService.authentication;

    function logout() {
      authService.logout();
      $state.go('login');
    }
  }
}());
