(function(){
  'use strict';

  angular.module('runner')
  .controller('ClientsCtrl', ['$scope', '$q', '$filter', '$upload', 'ngTableParams', 'Client', function($scope, $q, $filter, $upload, ngTableParams, Client){
    $scope.clients = [];
    $scope.options = [{id: true, title: 'Active'}, {id: false, title: 'Inactive'}];
    $scope.edit    = false;
    $scope.editRug = false;
    $scope.client  = {};
    $scope.current = {};
    $scope.wkDays  = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    $scope.wkNums  = [1, 2, 3, 4, 5, 6, 7];

    Client.all().then(function(response){
      $scope.clients = response.data.clients;
      $scope.updateTable();
    });

    $scope.add = function(){
      $scope.toggleEdit();
      if($scope.current){
        Client.getRug($scope.display[$scope.index]._id).then(function(response){
          $scope.current.rug = response.data.rug;
        });
      }
      Client.add($scope.client).then(function(response){
        $scope.clients = response.data.clients;
        $scope.tableParams.filter({});
        $scope.tableParams.sorting({name:'asc'});
      });
    };

    $scope.init = function(){
      $scope.toggleEdit();
      $scope.current   = null;
      $scope.client = null;
    };

    $scope.toggleEdit = function(){
      $scope.edit = !!!$scope.edit;
    };

    $scope.editClient = function(){
      $scope.client = $scope.current;
    };

    $scope.makeCurrent = function(index){
      $scope.current = $scope.display[index];
      $scope.index   = index;
      Client.getRug($scope.display[index]._id).then(function(response){
        $scope.current.rug = response.data.rug;
      });
    };

    $scope.cancel = function(){
      $scope.toggleEdit();
      $scope.client = null;
    };

    $scope.remove = function(){
      $scope.toggleEdit();
      Client.remove($scope.client._id).then(function(response){
        $scope.current = {};
      });
    };

    $scope.toggleRug = function(){
      $scope.editRug = !!!$scope.editRug;
    };

    $scope.saveRug = function(){
      $scope.editRug = !!!$scope.editRug;
      Client.saveRug($scope.current.rug).then(function(response){
        toastr.success('Rug saved.');
      });
    };

    $scope.updateTable = function(){
      $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        filter :{
          isActive : 'true'
        },
        sorting: {
          name: 'asc'
        }
      },{
        total: $scope.clients.length, // length of data
        getData: function($defer, params){
          var orderedData = params.filter() ?
          $filter('filter')($scope.clients, params.filter()) :
          $scope.clients;

          orderedData = params.sorting() ?
          $filter('orderBy')(orderedData, params.orderBy()) :
          $scope.clients;

          $scope.display = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

          params.total(orderedData.length); // set total for recalc pagination

          $defer.resolve($scope.display);
        }
      });
    };

    var inArray = Array.prototype.indexOf ?
      function(val, arr){
        return arr.indexOf(val);
      } :
      function(val, arr){
        var i = arr.length;
        while(i--){
          if(arr[i] === val){return i;}
        }
        return -1;
      };

    $scope.states = function(column){
      var def = $q.defer(),
        arr = [],
        states = [];
      // change $scope.types to $scope.locations when figure out how to do this with promises
      angular.forEach($scope.options, function(item){
        if(inArray(item, arr) === -1){
          arr.push(item);
          states.push({
            'id': item.id,
            'title': item.title
          });
        }
      });
      def.resolve(states);
      return def;
    };

    $scope.onFileSelect = function($files){
      var file = $files[0];
      $scope.upload = $upload.upload({
        url: 'clients/photo',
        method: 'POST',
        //headers: {'header-key': 'header-value'},
        //withCredentials: true,
        data: {myObj: $scope.current._id},
        file: file
      }).progress(function(evt){
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config){
        $scope.current = data.client;
      });
    };

  }]);
})();

