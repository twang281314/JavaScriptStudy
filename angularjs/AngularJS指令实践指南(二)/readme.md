**AngularJS 指令实践指南（二）**
>http://blog.jobbole.com/62999/

这个系列教程的第一部分给出了AngularJS指令的基本概述，在文章的最后我们介绍了如何隔离一个指令的scope。第二部分将承接上一篇继续介绍。首先，我们会看到在使用隔离scope的情况下，如何从指令内部访问到父scope的属性。接着，我们会基于对 controller 函数和 transclusions 讨论如何为指令选择正确的scope。这篇文章的最后会以通过一个完整的记事本应用来实践指令的使用。

# 隔离scope和父scope之间的数据绑定

通常，隔离指令的scope会带来很多的便利，尤其是在你要操作多个scope模型的时候。但有时为了使代码能够正确工作，你也需要从指令内部访问父scope的属性。好消息是Angular给了你足够的灵活性让你能够有选择性的通过绑定的方式传入父scope的属性。让我们重温一下我们的 helloWorld 指令，它的背景色会随着用户在输入框中输入的颜色名称而变化。还记得当我们对这个指令使用隔离scope的之后，它不能工作了吗？现在，我们来让它恢复正常。

假设我们已经初始化完成app这个变量所指向的Angular模块。那么我们的 helloWorld 指令如下面代码所示：

``` js
app.directive('helloWorld', function() {
  return {
    scope: {},
    restrict: 'AE',
    replace: true,
    template: '<p style="background-color:{{color}}">Hello World</p>',
    link: function(scope, elem, attrs) {
      elem.bind('click', function() {
        elem.css('background-color','white');
        scope.$apply(function() {
          scope.color = "white";
        });
      });
      elem.bind('mouseover', function() {
        elem.css('cursor', 'pointer');
      });
    }
  };
});
```
使用这个指令的HTML标签如下：

``` js
<body ng-controller="MainCtrl">
  <input type="text" ng-model="color" placeholder="Enter a color"/>
  <hello-world/>
</body>
```
上面的代码现在是不能工作的。因为我们用了一个隔离的scope，指令内部的 {{color}} 表达式被隔离在指令内部的scope中(不是父scope)。但是外面的输入框元素中的 ng-model 指令是指向父scope中的 color 属性的。所以，我们需要一种方式来绑定隔离scope和父scope中的这两个参数。在Angular中，这种数据绑定可以通过为指令所在的HTML元素添加属性和并指令定义对象中配置相应的 scope 属性来实现。让我们来细究一下建立数据绑定的几种方式。

## 选择一：使用 @ 实现单向文本绑定

在下面的指令定义中，我们指定了隔离scope中的属性 color 绑定到指令所在HTML元素上的参数 colorAttr。在HTML标记中，你可以看到 {{color}}表达式被指定给了 color-attr 参数。当表达式的值发生改变时，color-attr 参数也跟着改变。隔离scope中的 color 属性的值也相应地被改变。

``` js
app.directive('helloWorld', function() {
  return {
    scope: {
      color: '@colorAttr'
    },
    ....
    // the rest of the configurations
  };
});
```

更新后的HTML标记代码如下：

``` js
<body ng-controller="MainCtrl">
  <input type="text" ng-model="color" placeholder="Enter a color"/>
  <hello-world color-attr="{{color}}"/>
</body>
```

我们称这种方式为单项绑定，是因为在这种方式下，你只能将字符串(使用表达式{{}})传递给参数。当父scope的属性变化时，你的隔离scope模型中的属性值跟着变化。你甚至可以在指令内部监控这个scope属性的变化，并且触发一些任务。然而，反向的传递并不工作。你不能通过对隔离scope属性的操作来改变父scope的值。

注意点：
当隔离scope属性和指令元素参数的名字一样是，你可以更简单的方式设置scope绑定：

``` js
app.directive('helloWorld', function() {
  return {
    scope: {
      color: '@'
    },
    ....
    // the rest of the configurations
  };
});
```

相应使用指令的HTML代码如下：

``` js
<hello-world color="{{color}}"/>
```

## 选择二：使用 = 实现双向绑定

让我们将指令的定义改变成下面的样子：

``` js
app.directive('helloWorld', function() {
  return {
    scope: {
      color: '='
    },
    ....
    // the rest of the configurations
  };
});
```

相应的HTML修改如下：

``` html
<body ng-controller="MainCtrl">
  <input type="text" ng-model="color" placeholder="Enter a color"/>
  <hello-world color="color"/>
</body>
```

与 @ 不同，这种方式让你能够给属性指定一个真实的scope数据模型，而不是简单的字符串。这样你就可以传递简单的字符串、数组、甚至复杂的对象给隔离scope。同时，还支持双向的绑定。每当父scope属性变化时，相对应的隔离scope中的属性也跟着改变，反之亦然。和之前的一样，你也可以监视这个scope属性的变化。

## 选择三：使用 & 在父scope中执行函数

有时候从隔离scope中调用父scope中定义的函数是非常有必要的。为了能够访问外部scope中定义的函数，我们使用 &。比如我们想要从指令内部调用 sayHello() 方法。下面的代码告诉我们该怎么做：

``` js
app.directive('sayHello', function() {
  return {
    scope: {
      sayHelloIsolated: '&amp;'
    },
    ....
    // the rest of the configurations
  };
});
```

相应的HTML代码如下：

``` html
<body ng-controller="MainCtrl">
  <input type="text" ng-model="color" placeholder="Enter a color"/>
  <say-hello sayHelloIsolated="sayHello()"/>
</body>
```

这个 Plunker 例子对上面的概念做了很好的诠释。

# 父scope、子scope以及隔离scope的区别

作为一个Angular的新手，你可能会在选择正确的指令scope的时候感到困惑。默认情况下，指令不会创建一个新的scope，而是沿用父scope。但是在很多情况下，这并不是我们想要的。如果你的指令重度地使用父scope的属性、甚至创建新的属性，会污染父scope。让所有的指令都使用同一个父scope不会是一个好主意，因为任何人都可能修改这个scope中的属性。因此，下面的这个原则也许可以帮助你为你的指令选择正确的scope。

1. 父scope(scope: false) – 这是默认情况。如果你的指令不操作父scoe的属性，你就不需要一个新的scope。这种情况下是可以使用父scope的。
2. 子scope(scope: true) – 这会为指令创建一个新的scope，并且原型继承自父scope。如果你的指令scope中的属性和方法与其他的指令以及父scope都没有关系的时候，你应该创建一个新scope。在这种方式下，你同样拥有父scope中所定义的属性和方法。
3. 隔离scope(scope:{}) – 这就像一个沙箱！当你创建的指令是自包含的并且可重用的，你就需要使用这种scope。你在指令中会创建很多scope属性和方法，它们仅在指令内部使用，永远不会被外部的世界所知晓。如果是这样的话，隔离的scope是更好的选择。隔离的scope不会继承父scope。

# Transclusion（嵌入）

ransclusion是让我们的指令包含任意内容的方法。我们可以延时提取并在正确的scope下编译这些嵌入的内容，最终将它们放入指令模板中指定的位置。 如果你在指令定义中设置 transclude:true，一个新的嵌入的scope会被创建，它原型继承子父scope。 如果你想要你的指令使用隔离的scope，但是它所包含的内容能够在父scope中执行，transclusion也可以帮忙。

假设我们注册一个如下的指令：

``` js
app.directive('outputText', function() {
  return {
    transclude: true,
    scope: {},
    template: '<div ng-transclude></div>'
  };
});
```
它使用如下：

``` html
<div output-text>
  <p>Hello {{name}}</p>
</div>

```

ng-transclude 指明在哪里放置被嵌入的内容。在这个例子中DOM内容 <p>Hello {{name}}</p> 被提取和放置到 <div ng-transclude></div> 内部。有一个很重要的点需要注意的是，表达式{{name}}所对应的属性是在父scope中被定义的，而非子scope。你可以在这个Plunker例子中做一些实验。如果你想要学习更多关于scope的知识，可以阅读这篇文章。

transclude:’element’ 和 transclude:true的区别

有时候我我们要嵌入指令元素本身，而不仅仅是它的内容。在这种情况下，我们需要使用 transclude:’element’。它和 transclude:true 不同，它将标记了 ng-transclude 指令的元素一起包含到了指令模板中。使用transclusion，你的link函数会获得一个名叫 transclude 的链接函数，这个函数绑定了正确的指令scope，并且传入了另一个拥有被嵌入DOM元素拷贝的函数。你可以在这个 transclude 函数中执行比如修改元素拷贝或者将它添加到DOM上等操作。 类似 ng-repeat 这样的指令使用这种方式来重复DOM元素。仔细研究一下这个Plunker，它使用这种方式复制了DOM元素，并且改变了第二个实例的背景色。

同样需要注意的是，在使用 transclude:’element’的时候，指令所在的元素会被转换成HTML注释。所以，如果你结合使用 transclude:’element’ 和 replace:false，那么指令模板本质上是被添加到了注释的innerHTML中——也就是说其实什么都没有发生！相反，如果你选择使用 replace:true，指令模板会替换HTML注释，那么一切就会如果所愿的工作。使用 replade:false 和 transclue:’element’有时候也是有用的，比如当你需要重复DOM元素但是并不想保留第一个元素实例（它会被转换成注释）的情况下。对这块还有疑惑的同学可以阅读stackoverflow上的这篇讨论，介绍的比较清晰。

# controller 函数和 require

如果你想要允许其他的指令和你的指令发生交互时，你需要使用 controller 函数。比如有些情况下，你需要通过组合两个指令来实现一个UI组件。那么你可以通过如下的方式来给指令添加一个 controller 函数。

``` js
app.directive('outerDirective', function() {
  return {
    scope: {},
    restrict: 'AE',
    controller: function($scope, $compile, $http) {
      // $scope is the appropriate scope for the directive
      this.addChild = function(nestedDirective) { // this refers to the controller
        console.log('Got the message from nested directive:' + nestedDirective.message);
      };
    }
  };
});
```

这个代码为指令添加了一个名叫 outerDirective 的controller。当另一个指令想要交互时，它需要声明它对你的指令 controller 实例的引用(require)。可以通过如下的方式实现：

``` js
app.directive('innerDirective', function() {
  return {
    scope: {},
    restrict: 'AE',
    require: '^outerDirective',
    link: function(scope, elem, attrs, controllerInstance) {
      //the fourth argument is the controller instance you require
      scope.message = "Hi, Parent directive";
      controllerInstance.addChild(scope);
    }
  };
});
```

相应的HTML代码如下：

``` html
<outer-directive>
  <inner-directive></inner-directive>
</outer-directive>
```

require: ‘^outerDirective’ 告诉Angular在元素以及它的父元素中搜索controller。这样被找到的 controller 实例会作为第四个参数被传入到 link 函数中。在我们的例子中，我们将嵌入的指令的scope发送给父亲指令。如果你想尝试这个代码的话，请在开启浏览器控制台的情况下打开这个Plunker。同时，这篇Angular官方文档上的最后部分给了一个非常好的关于指令交互的例子，是非常值得一读的。
