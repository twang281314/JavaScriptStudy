'use strict';  
  
var dtControllers = angular.module('dtControllers', []);  
  
dtControllers.controller('directive1',['$scope',  
    function($scope) {  
        $scope.name = 'this is tank test';  
    }  
]);  


dtControllers.controller('directive2',['$scope',  
    function($scope) {  
        $scope.number = '1111 ';  
    }  
]);  