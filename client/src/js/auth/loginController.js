(function () {
  'use strict';

  angular
    .module('app.auth')
    .controller('loginController', loginController);

  function loginController($state, authService) {

    /* jshint validthis: true */
    var vm = this;

    vm.login = login;

    vm.loginData = {
      userName: '',
      password: ''
    };

    vm.errorMessage = '';

    function login() {
      authService.login(vm.loginData).then(
        function () {
          $state.go('home');
        },
        function (error) {
          vm.errorMessage = error.error_description;
        });
    }
  }

})();
