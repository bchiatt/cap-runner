(function(){
  'use strict';

  angular.module('runner')
  .factory('Client', ['$http', function($http){

    function all(){
      return $http.get('/clients');
    }

    function add(client){
      return $http.post('/clients', client);
    }

    function update(client){
      return $http.put('/clients', client);
    }

    function remove(clientId){
      return $http.delete('/clients/' + clientId);
    }

    function getRug(clientId){
      return $http.get('/clients/' + clientId + '/rug');
    }

    function saveRug(rug){
      return $http.post('/clients/rug', rug);
    }

    return {all:all, add:add, update:update, remove:remove, getRug:getRug, saveRug:saveRug};
  }]);
})();

