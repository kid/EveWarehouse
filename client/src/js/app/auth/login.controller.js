(function () {
  'use strict';

  angular
    .module('app.auth')
    .controller('LoginController', LoginController);

  function LoginController($rootScope, $state, authService) {

    /* jshint validthis: true */
    var vm = this;

    vm.login = login;

    vm.loginData = {
      userName: '',
      password: ''
    };

    vm.errorMessage = '';

    function login() {
      authService.login(vm.loginData).then(loginSuccess, loginFailure);

      function loginSuccess() {
        $state.go('app.dashboard');
      }

      function loginFailure(error) {
        vm.errorMessage = error.error_description; // jshint ignore:line
      }
    }
  }

})();
