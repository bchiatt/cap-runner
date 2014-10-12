(function(){
  'use strict';

  angular.module('runner')
  .controller('TherapistsCtrl', ['$scope', '$q', '$filter', '$upload', 'ngTableParams', 'Therapist', function($scope, $q, $filter, $upload, ngTableParams, Therapist){
    $scope.therapists = [];
    $scope.options    = ['PT', 'OT', 'ST'];
    $scope.add        = false;
    $scope.therapist  = {};
    $scope.general    = true;

    Therapist.all().then(function(response){
      $scope.therapists = response.data.therapists;
      $scope.updateTable();
    });

    $scope.save = function(){
      $scope.general = true;
      Therapist.update($scope.therapist).then(function(response){
        toastr.success('Therapist saved.');
        $scope.therapists = response.data.therapists;
        $scope.tableParams.filter({});
        $scope.tableParams.sorting({name:'asc'});
      });
    };

    $scope.init = function(){
      $scope.therapist = {};
      $scope.add       = true;
    };

    $scope.cancel = function(){
      $scope.add = false;
    };

    $scope.create = function(){
      Therapist.add($scope.therapist).then(function(response){
        $scope.add = false;
        $scope.therapists = response.data.therapists;
        $scope.tableParams.filter({});
        $scope.tableParams.sorting({name:'asc'});
      });
    };

    $scope.makeCurrent = function(index){
      $scope.add       = false;
      $scope.therapist = $scope.display[index];
      $scope.index     = $scope.display[index];
    };

    $scope.remove = function(){
      Therapist.remove($scope.therapist._id).then(function(response){
        $scope.index     = null;
        $scope.therapist = {};
      });
    };

    $scope.updateTable = function(){
      $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        filter :{
          name : ''
        },
        sorting: {
          name: 'asc'
        }
      },{
        total: $scope.therapists.length, // length of data
        getData: function($defer, params){
          var orderedData = params.filter() ?
          $filter('filter')($scope.therapists, params.filter()) :
          $scope.therapists;

          orderedData = params.sorting() ?
          $filter('orderBy')(orderedData, params.orderBy()) :
          $scope.therapists;

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

    $scope.disciplines = function(column){
      var def = $q.defer(),
        arr = [],
        disciplines = [];
      // change $scope.types to $scope.locations when figure out how to do this with promises
      angular.forEach($scope.options, function(item){
        if(inArray(item, arr) === -1){
          arr.push(item);
          disciplines.push({
            'id': item,
            'title': item
          });
        }
      });
      def.resolve(disciplines);
      return def;
    };

    $scope.onFileSelect = function($files){
      var file = $files[0];
      $scope.upload = $upload.upload({
        url: 'therapists/photo',
        method: 'POST',
        //headers: {'header-key': 'header-value'},
        //withCredentials: true,
        data: {myObj: $scope.therapist._id},
        file: file
      }).progress(function(evt){
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config){
        $scope.therapist = data.therapist;
      });
    };

  }]);
})();

