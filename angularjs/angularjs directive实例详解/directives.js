//directives.js增加exampleDirective  
'use strict';  
  
var phonecatDirectives = angular.module('phonecatDirectives', []);  
  
phonecatDirectives.directive('myTest', function() {  
    return {  
        restrict: 'ACEM',  
        require: '^ngModel',  
        scope: {  
            ngModel: '='  
        },  
        template: '<div><h4>Weather for {{ngModel}}</h4></div>'  
    }  
}); 

//controller先运行，compile后运行，link不运行 link和compile不兼容
phonecatDirectives.directive('exampleDirective', function() {  
    return {  
        restrict: 'E',  
        template: '<p>Hello {{number}}!</p>',  
        controller: function($scope, $element){  
            $scope.number = $scope.number + "22222 ";  
        },  
        link: function(scope, el, attr) {  
            scope.number = scope.number + "33333 ";  
        },
        compile: function(element, attributes) {  
            return {  
                pre: function preLink(scope, element, attributes) {  
                    scope.number = scope.number + "44444 ";  
                },  
                post: function postLink(scope, element, attributes) {  
                    scope.number = scope.number + "55555 ";  
                }  
            };  
        }  
    }  
});  