(function(){
  'use strict';

  angular.module('runner')
  .controller('ClientsCtrl', ['$scope', '$q', '$filter', '$upload', 'ngTableParams', 'Client', 'Rug', function($scope, $q, $filter, $upload, ngTableParams, Client, Rug){
    $scope.clients = [];
    $scope.options = [{id: true, title: 'Active'}, {id: false, title: 'Inactive'}];
    $scope.editRug = false;
    $scope.add     = false;
    $scope.client  = {};
    $scope.wkDays  = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    $scope.wkNums  = [1, 2, 3, 4, 5, 6, 7];
    $scope.general = true;

    Client.all().then(function(response){
      $scope.clients = response.data.clients;
      $scope.updateTable();
    });

    $scope.save = function(){
      $scope.general = true;
      Client.update($scope.client).then(function(response){
        $scope.clients = response.data.clients;
        $scope.tableParams.filter({});
        $scope.tableParams.sorting({name:'asc'});
      });
    };

    $scope.init = function(){
      $scope.client  = {};
      $scope.add     = true;
    };

    $scope.cancel = function(){
      $scope.add = false;
    };

    $scope.create = function(){
      Client.add({name: $scope.newClient}).then(function(response){
        $scope.add = false;
        $scope.clients = response.data.clients;
        $scope.tableParams.filter({});
        $scope.tableParams.sorting({name:'asc'});
      });
    };

    $scope.makeCurrent = function(index){
      $scope.add    = false;
      $scope.client = $scope.display[index];
      $scope.index  = index;
      Client.getRug($scope.display[index]._id).then(function(response){
        $scope.client.rug = response.data.rug;
      });
    };

    $scope.remove = function(){
      Client.remove($scope.client._id).then(function(response){
        $scope.index  = null;
        $scope.client = {};
      });
    };

    $scope.toggleRug = function(){
      $scope.editRug = !!!$scope.editRug;
    };

    $scope.saveRug = function(){
      $scope.editRug = !!!$scope.editRug;
      Client.saveRug($scope.client.rug).then(function(response){
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
        data: {myObj: $scope.client._id},
        file: file
      }).progress(function(evt){
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config){
        $scope.client = data.client;
      });
    };

    $scope.projSumDay = function(num1, num2, num3, index){
      $scope.projWkSum = $scope.projWkSum || [];
      var sum          = Rug.sumDay(num1, num2, num3);
      $scope.projWkSum.push(sum);
      return sum;
    };

    $scope.projSumWeek = function(num1, num2, num3, index){
      if($scope.projWkSum.length > 7){$scope.projWkSum.shift();}
      var sum     = $scope.projWkSum.reduce(function(a, b){return a + b;});
      $scope.cumA = sum;
      return sum;
    };

    $scope.actualSumDay = function(num1, num2, num3, index){
      $scope.actualWkSum = $scope.actualWkSum || [];
      var sum            = Rug.sumDay(num1, num2, num3);
      $scope.actualWkSum.push(sum);
      return sum;
    };

    $scope.actualSumWeek = function(num1, num2, num3, index){
      if($scope.actualWkSum.length > 7){$scope.actualWkSum.shift();}
      var sum     = $scope.actualWkSum.reduce(function(a, b){return a + b;});
      $scope.cumB = sum;

      console.log(index, 'proj', $scope.cumA);
      console.log(index, 'act', $scope.cumB);

      return sum;
    };

    $scope.textColor = function(){
      if($scope.cumB >= $scope.cumA){
        return 'good';
      }else{
        return 'bad';
      }
    };


  }]);
})();

