http://blog.51yip.com/jsjquery/1602.html


使用angularjs，发现controller间的值传递，比较麻烦的，以后几篇文章会陆续说几种方法。

一，angularjs $broadcast $emit $on的处理思想

在一个controller里面通过事件触发一个方法，在方法里面通过$broadcast或$emit来定义一个变量，在父，子controller里面通过$on来获取。

二，实例说明angularjs $broadcast $emit $on的用法

1，html代码
查看复制打印?

    <div ng-controller="ParentCtrl">                  //父级  
        <div ng-controller="SelfCtrl">                //自己  
            <a ng-click="click()">click me</a>  
            <div ng-controller="ChildCtrl"></div>     //子级  
        </div>  
        <div ng-controller="BroCtrl"></div>           //平级  
    </div>  

2，js代码
查看复制打印?

    phonecatControllers.controller('SelfCtrl', function($scope) {  
        $scope.click = function () {  
            $scope.$broadcast('to-child', 'child');  
            $scope.$emit('to-parent', 'parent');  
        }  
    });  
      
    phonecatControllers.controller('ParentCtrl', function($scope) {  
        $scope.$on('to-parent', function(d,data) {  
            console.log(data);         //父级能得到值  
        });  
        $scope.$on('to-child', function(d,data) {  
            console.log(data);         //子级得不到值  
        });  
    });  
      
    phonecatControllers.controller('ChildCtrl', function($scope){  
        $scope.$on('to-child', function(d,data) {  
            console.log(data);         //子级能得到值  
        });  
        $scope.$on('to-parent', function(d,data) {  
            console.log(data);         //父级得不到值  
        });  
    });  
      
    phonecatControllers.controller('BroCtrl', function($scope){  
        $scope.$on('to-parent', function(d,data) {  
            console.log(data);        //平级得不到值  
        });  
        $scope.$on('to-child', function(d,data) {  
            console.log(data);        //平级得不到值  
        });  
    });  

3，点击Click me的输出结果

    child  
    parent  

用$broadcast赋的值，只能子级得到值；$emit赋的值，只能父级得到；而平级的什么都不能得到