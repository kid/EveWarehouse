(function () {
  'use strict';

  angular
    .module('app.auth')
    .controller('RegistrationController', RegistrationController);

  function RegistrationController($state, authService) {

    /* jshint validthis: true */
    var vm = this;

    vm.register = register;

    vm.registration = {
      userName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    vm.errorMessage = '';

    function register() {
      authService
        .register(vm.registration)
        .then(
          function () {
            authService.login(vm.registration).then(function () {
              $state.go('home');
            });
          },
          function (response) {
            var errors = [];
            for (var key in response.data.modelState) {
              for (var i = 0; i < response.data.modelState[key].length; i++) {
                errors.push(response.data.modelState[key][i]);
              }
            }
            vm.errorMessage = 'Failed to register user du to: ' + errors.join(' ');
          }
      );
    }
  }

})();
