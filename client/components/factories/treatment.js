(function(){
  'use strict';

  angular.module('runner')
  .factory('Treatment', ['$http', function($http){

    function getFuture(date){
      return $http.post('/schedule', date);
    }

    function schedule(therapists){
      return $http.post('/schedule/new', therapists);
    }

    function getPast(){
      return $http.get('/treatments');
    }

    function archive(tx){
      return $http.post('/treatments', tx);
    }

    function save(tx){
      return $http.put('/treatments', tx);
    }

    function remove(id){
      return $http.delete('/treatments/' + id);
    }

    return {getFuture:getFuture, schedule:schedule, getPast:getPast, archive:archive, save:save, remove:remove};
  }]);
})();

