(function(){
  'use strict';

  angular.module('runner')
  .factory('Therapist', ['$http', function($http){

    function all(){
      return $http.get('/therapists');
    }

    function add(therapist){
      return $http.post('/therapists', therapist);
    }

    function update(therapist){
      return $http.put('/therapists', therapist);
    }

    function remove(therapistId){
      return $http.delete('/therapists/'+ therapistId);
    }

    return {all:all, add:add, update:update, remove:remove};
  }]);
})();

