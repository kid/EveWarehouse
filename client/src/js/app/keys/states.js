(function () {
  'use strict';

  angular.module('app.keys').config(RouterConfig);

  function RouterConfig($stateProvider) {
    $stateProvider
      .state('app.keys', {
        url: '/keys',
        abstract: true,
        views: {
          'page-content': {
            template: '<div ui-view></div>'
          }
        }
      })
      .state('app.keys.list', {
        url: '/',
        templateUrl: 'app/keys/list-api-keys.html',
        data: {
          header: {
            title: 'API Keys',
            sub: 'Manage you API keys'
          }
        }
      })
      .state('app.keys.new', {
        url: '/new',
        templateUrl: 'app/keys/new-api-key.html'
      });
  }
}());
