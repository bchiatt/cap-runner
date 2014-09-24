(function(){
  'use strict';

  angular.module('runner')
  .factory('Client', ['$http', function($http){

    function all(){
      return $http.get('/clients');
    }

    function add(therapist){
      return $http.post('/clients', therapist);
    }

    function remove(therapistId){
      return $http.delete('/clients/'+ therapistId);
    }

    return {all:all, add:add, remove:remove};
  }]);
})();

