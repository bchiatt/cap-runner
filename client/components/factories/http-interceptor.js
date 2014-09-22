(function(){
  'use strict';

  angular.module('runner')
  .factory('HttpInterceptor', ['$rootScope', '$location', '$q', function($rootScope, $location, $q){

    function responseError(res){
      if(res.status === 401){
        $location.path('/');
      }

      return $q.reject(res);
    }

    function response(res){
      var email = res.headers('x-authenticated-user');

      if(email){
        $rootScope.$broadcast('authenticated', email);
      }

      return res;
    }

    return {response:response, responseError:responseError};
  }]);
})();

