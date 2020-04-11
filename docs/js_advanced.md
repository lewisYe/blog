# JS 进阶

## call、apply、bind的模拟实现

### call

语法

```
fn.call(thisArg,arg1,arg2,...)
```

该方法有2个参数，第一个参数为需要被指定的this值，第二个参数为一个参数列表

thisArg 取值有以下四种情况：
* 不传、或者传null、undefined，this指向window对象
* 传递另一个函数的函数名，this指向这个函数的引用
* 传递字符串、数组或布尔类型等基础类型，this指向其对应的包装对象。
* 传递一个对象时，this指向这个对象

示例使用：
```
var foo = {
  value:1
}

function bar(){
  console.log(this.value)
}

bar.call(foo) // 1
```
注意两点：

1. this指向被改变为指向foo
2. bar 被执行了

### 模拟实现call 

#### 第一版: 实现改变this指向

在上述例子中，试想当调用call方法时，把bar理解为foo内部一个函数时，this是不是就指向为foo，输出的值就为1啦。
```
var foo = {
  value:1,
  bar:function(){
    console.log(this.value)
  }
}
foo.bar() //1
```
所以我们的思路可以分为：
1.将函数设置为对象的属性
2.函数被调用
3.删选该函数

根据这个思路，尝试实现如下代码：

```
Function.prototype.myCall = function(obj){
  obj.fn = this;  //这里的this就是调用mycall的函数
  obj.fn();
  delete obj.fn
}
```
#### 第二版：实现传参数

call方法传入的参数是不确定的，那我们可以从argument对象中获取。
```
var args = []
for(var i = 1 ;i < arguments.length; i ++ ){
  args.push('arguments['+ i +']')
}

// 执行后 args为 [ "arguments[1]", "arguments[2]", "arguments[3]",... ]
```

你可能会对 为何不去直接拿arguments[1]的值呢，如果我们直接去拿arguments[1]的值的话，你测试一下传一个字符串参数，像这样，func.mycall(obj, ‘dd’);就会报错，告诉你dd is not defined。 因为eval会把字符串解析成一个变量。

不定长的参数问题解决了，我们接着要把这个参数数组放到要执行的函数的参数里面去。

具有三种方法：
1、eval('obj.fn('+ args +')');

2、obj.fn.apply(obj, args); 

3、obj.fn(…args);//es6解构语法

整合代码之后：

```
Function.prototype.myCall = function(obj){
  var args = [];
  for(var i = 1;i < arguments.length; i++){
    args.push('arguments[' + i +']')
  }
  obj.fn = this;
  eval('obj.fn('+args+')')
  delete obj.fn
}
```

#### 最终版 完善细节 

call方法第一个参数可以为null、函数调用具有返回值

```
Function.prototype.myCall = function(obj){
  var args = [];
  for(var i = 1; i < argumens.length; i++){
    args.push('arguments[' + i + ']')
  }
  obj.fn = obj || window
  var result = eval('obj.fn('+args+')')
  delete obj.fn
  return result
}

```

### apply

apply和call 很相似，区别在于第二个参数。apply 是需要参数数组，call 是需要参数列表。

语法

```
func.apply(thisArg, argsArray)
```

该方法有2个参数，第一个参数为需要指定的this值，第二个参数为一个数组。

由于apply和call区别在于第二个参数是否为数组，所以直接给出代码：
```
Function.prototype.myApply = function(obj,arr){
 obj.fn = this || window;
 var result;
 if(!arr){
   result = obj.fn()
 }else{
   var args = [];
   for(var i = 1; i < arr.length; i++){
     args.push('arr['+i+']')
   }
   result = eval('obj.fn('+args+')')
 }
 delete obj.fn
 return result
}
```


### bind

bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。(来自于 MDN )

语法
```
function.bind(thisArg[, arg1[, arg2[, ...]]])
```

参数：thisArg
调用绑定函数时作为 this 参数传递给目标函数的值。 如果使用new运算符构造绑定函数，则忽略该值。当使用 bind 在 setTimeout 中创建一个函数（作为回调提供）时，作为 thisArg 传递的任何原始值都将转换为 object。如果 bind 函数的参数列表为空，执行作用域的 this 将被视为新函数的 thisArg。


使用示例：
```
var foo = {
  value:1
}
function bar(){
  console.log(console.log(this.value))
}

var bindFoo = bar.bind(foo)

bindFoo() // 1
```

### 模拟实现

### 第一版 改变this

```
Function.prototype.myBind = function(obj){
  var that = this // this为调用myBind的函数
  return 
}
```