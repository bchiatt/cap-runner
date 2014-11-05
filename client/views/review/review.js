(function(){
  'use strict';

  angular.module('runner')
  .controller('ReviewCtrl', ['$scope', '$filter', '$q', 'ngTableParams', 'Treatment', 'Therapist', function($scope, $filter, $q, ngTableParams, Treatment, Therapist){
    $scope.txs     = {false: null, true: null};
    $scope.display = 'open';

    Treatment.getPast().then(function(response){
      $scope.txs       = _.groupBy(response.data.treatments, function(tx){return tx.isArchived;});
      $scope.activeTxs = $scope.txs.false;
      $scope.initTable();
    });

    Therapist.all().then(function(response){
      $scope.therapists = response.data.therapists;
    });

    $scope.toggleArchived = function(){
      $scope.activeTxs = $scope.txs.true;
      $scope.display = 'archived';
      $scope.tableParams.reload();
    };

    $scope.toggleOpen = function(){
      $scope.activeTxs = $scope.txs.false;
      $scope.display = 'open';
      $scope.tableParams.reload();
    };

    $scope.del = function(index){
      Treatment.remove($scope.tableParams.data[index]._id).then(function(response){
        $scope.activeTxs.splice(index, 1);
        $scope.tableParams.reload();
      });
    };

    $scope.save = function(index){
      Treatment.save($scope.tableParams.data[index]).then(function(response){
      });
    };

    $scope.arch = function(index){
      Treatment.archive($scope.tableParams.data[index]).then(function(response){
        $scope.tableParams.data[index].isArchived = true;
        $scope.txs.true.push($scope.tableParams.data[index]);
        $scope.activeTxs.splice(index, 1);
        $scope.tableParams.reload();
      });
    };

    $scope.unArch = function(index){
      Treatment.unArchive($scope.tableParams.data[index]._id).then(function(response){
        $scope.tableParams.data[index].isArchived = false;
        $scope.txs.false.push($scope.tableParams.data[index]);
        $scope.activeTxs.splice(index, 1);
        $scope.tableParams.reload();
      });
    };

    $scope.initTable = function(){
      $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        filter :{
        },
        sorting: {
        }
      },{
        total: $scope.activeTxs.length, // length of data
        getData: function($defer, params){
          var filteredData = params.filter() ?
            $filter('filter')($scope.activeTxs, params.filter()) :
            $scope.activeTxs,

              orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) :
            $scope.activeTxs;

          params.total(orderedData.length); // set total for recalc pagination

          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
    };

  }]);
})();

