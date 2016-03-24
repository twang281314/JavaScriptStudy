'use strict';  
  
/* Controllers */  
  
var phonecatControllers = angular.module('phonecatControllers', []);  
  
//写过js function的对这种调用方式，很熟悉，服务名称不能变  
function TestCtrl($scope,facetorytest,servicetest,providertest) {  
    $scope.facetorytest = facetorytest.firstname+" "+facetorytest.lastname();  
    $scope.servicetest = servicetest.firstname+" "+servicetest.lastname();  
    $scope.providertest = providertest.firstname+" "+providertest.lastname;  
}  
  
//这种调用方式根jquery非常的像，服务名称也不能变  
phonecatControllers.controller('TestCtrl',function($scope,facetorytest,servicetest,providertest) {  
    $scope.facetorytest = facetorytest.firstname+" "+facetorytest.lastname();  
    $scope.servicetest = servicetest.firstname+" "+servicetest.lastname();  
    $scope.providertest = providertest.firstname+" "+providertest.lastname;  
});  
  
//以注入的方式来调用，服务名称可以改变  
phonecatControllers.controller('TestCtrl',['$scope',"facetorytest","servicetest","providertest",  
    function($scope,facetory111,service111,provider111) {     //自定义,服务名称  
        $scope.facetorytest = facetory111.firstname+" "+facetory111.lastname();  
        $scope.servicetest = service111.firstname+" "+service111.lastname();  
        $scope.providertest = provider111.firstname+" "+provider111.lastname;  
    }  
]);  