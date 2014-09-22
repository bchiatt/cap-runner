(function(){
  'use strict';

  angular.module('runner')
  .controller('HomeCtrl', ['$scope', '$location', 'Home', 'User', function($scope, $location, Home, User){
    $scope.regForm = true;
    $scope.logForm = true;

    $scope.toggleReg = function(){
      $scope.regForm = !!!$scope.regForm;
    };

    $scope.toggleLog = function(){
      $scope.logForm = !!!$scope.logForm;
    };

    function regSuccess(response){
      toastr.success('User successfully registered. Please login.');
      $location.path('/');
    }

    function regFailure(response){
      toastr.error('Error during user registration, try again.');
      $scope.user = {};
    }

    $scope.register = function(){
      User.register($scope.user).then(regSuccess, regFailure);
    };

    function success(response){
      toastr.success('User successfully logged in.');
      $location.path('/dashboard');
    }

    function failure(response){
      toastr.error('Error during user login, try again.');
      $scope.user = {};
    }

    $scope.login = function(){
      User.login($scope.user).then(success, failure);
    };

  }]);
})();

