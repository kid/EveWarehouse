(function () {
  'use strict';

  angular.module('app.keyManagement').config(RouterConfig);

  function RouterConfig($stateProvider) {
    $stateProvider.state('account', {
      url: '/account',
      abstract: true,
      templateUrl: 'app/shell.html'
    });

    $stateProvider.state('account.apiKeys', {
      url: '/apiKeys',
      views: {
        'page-content': {
          templateUrl: 'app/key-management/api-key.html'
        }
      },
      data: {
        header: {
          title: 'API Keys',
          sub: 'Manage you API keys'
        }
      }
    });
  }
}());
