'use strict';  
  
/* Services */  
  
var phonecatServices = angular.module('phonecatServices', []);  
  
phonecatServices.factory('facetorytest', ['$window',         //factory方式  
    function($window){  
        var test = {  
            firstname:"tank",  
            lastname:function(){  
                return "zhang";  
            }  
        };  
        $window.alert('aaaa');         //内置服务可以注入  
        return test;  
    }  
]);  
  
phonecatServices.service('servicetest', ['$window',          //service方式  
    function($window){  
        $window.alert('bbbb');        //内置服务可以注入  
        this.firstname = "tank";  
        this.lastname = function(){  
            return "zhang";  
        }  
    }  
]);  
  
phonecatServices.provider('providertest',[                  //provider方式，内置服务不可以注入  
    function(){  
        this.test = {  
            "firstname":"tank",  
            "lastname":"zhang"  
        }  
        this.$get = function () {  
            return this.test;  
        };  
    }  
]);  