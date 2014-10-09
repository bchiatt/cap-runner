(function(){
  'use strict';

  angular.module('runner')
  .factory('Rug', [function(){

    function sumDay(num1, num2, num3){
      return num1 + num2 + num3;
    }

    function sumWk(num, wkArray){
    }

    return {sumDay:sumDay, sumWk:sumWk};
  }]);
})();

