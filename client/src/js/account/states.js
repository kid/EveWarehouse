(function () {
  'use strict';

  angular.module('app.account').config(RouterConfig);

  function RouterConfig($stateProvider) {
    $stateProvider.state('account', {
      url: '/account',
      abstract: true,
      templateUrl: 'shell.html'
    });

    $stateProvider.state('account.apiKeys', {
      url: '/apiKeys',
      views: {
        'page-content': {
          template: 'foobar'
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
