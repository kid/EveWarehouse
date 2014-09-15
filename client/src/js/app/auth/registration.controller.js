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
              $state.go('home.dashboard');
            });
          },
          function (response) {
            var errors = [];

            angular.forEach(response.data.modelState, function (items) {
              angular.forEach(items, function (item) {
                errors.push(item);
              });
            });

            vm.errorMessage = 'Failed to register user du to: ' + errors.join(' ');
          }
      );
    }
  }

})();
