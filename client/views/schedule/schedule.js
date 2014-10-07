(function(){
  'use strict';

  angular.module('runner')
  .controller('ScheduleCtrl', ['$scope', 'Client', 'Therapist', 'Treatment', function($scope, Client, Therapist, Treatment){

    $scope.tx = {add : 'Add Tx'};

    $scope.getFutureTreatments = function(){
      Treatment.getFuture({date:$scope.txDate}).then(function(response){
        $scope.therapists = response.data.therapists;
        $scope.treatments = response.data.treatments;
      });
    };

    $scope.scheduleTxs = function(){
      $scope.therapists.date = $scope.txDate;
      Treatment.schedule($scope.therapists).then(function(response){
        $scope.therapists = null;
        $scope.treatments = null;
        $scope.txDate     = null;
      });
    };

    $scope.$watch(
      'tx.add',
      function(newValue, oldValue){
        if(!newValue || newValue === 'Add Tx'){return;}
        newValue = newValue.split(',');
        $scope.therapists.active[newValue[2].toLowerCase()][newValue[1]].treatments.push($scope.treatments[newValue[2].toLowerCase()][newValue[0]]);
        $scope.treatments[newValue[2].toLowerCase()].splice(newValue[0], 1);
        $scope.tx.add = 'Add Tx';
      }
    );

    $scope.$watch(
      'addTherapist',
      function(newValue, oldValue){
        if(!newValue){return;}
        newValue = newValue.split(',');
        $scope.therapists.active[newValue[1].toLowerCase()].push($scope.therapists.oncall[newValue[1].toLowerCase()][newValue[0]]);
        $scope.therapists.oncall[newValue[1].toLowerCase()].splice(newValue[0], 1);
      }
    );

  }]);
})();

