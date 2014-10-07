(function(){
  'use strict';

  angular.module('runner', ['ngRoute', 'LocalForageModule', 'ngTable', 'angularFileUpload', 'ui.bootstrap', 'ui.utils'])
  .config(['$routeProvider', '$httpProvider', '$localForageProvider', function($routeProvider, $httpProvider, $localForageProvider){
    $routeProvider
    .when('/dashboard', {templateUrl:'/views/dashboard/dashboard.html', controller:'DashboardCtrl'})
    .when('/therapists', {templateUrl:'/views/therapists/therapists.html', controller:'TherapistsCtrl'})
    .when('/clients', {templateUrl:'/views/clients/clients.html', controller:'ClientsCtrl'})
    .when('/schedule', {templateUrl:'/views/schedule/schedule.html', controller:'ScheduleCtrl'})
    .when('/review', {templateUrl:'/views/review/review.html', controller:'ReviewCtrl'})
    .when('/login', {templateUrl:'/views/home/home.html', controller:'HomeCtrl'})
    .when('/logout',   {templateUrl:'/views/logout/logout.html',     controller:'LogoutCtrl'})
    .otherwise({redirectTo:'/login'});

    $httpProvider.interceptors.push('HttpInterceptor');
    $localForageProvider.config({name:'runner', storeName:'cache', version:1.0});
  }]);
})();

