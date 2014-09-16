(function () {
  'use strict';

  angular.module('app.dashboard').config(RouterConfig);

  function RouterConfig($stateProvider) {
    $stateProvider.state('app.dashboard', {
      url: '/',
      views: {
        'page-content': {
          template: 'Dashboard'
        }
      },
      data: {
        header: {
          title: 'Dashboard'
        }
      }
    });
  }
}());
