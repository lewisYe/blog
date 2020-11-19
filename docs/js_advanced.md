# JS 进阶

## call、apply、bind

### call

语法

```javascript
func.call(thisArg,arg1,arg2,...)
```

该方法有2个参数，第一个参数为需要被指定的this值，第二个参数为一个参数列表

thisArg 取值有以下四种情况：
* 不传、或者传null、undefined，this指向window对象
* 传递另一个函数的函数名，this指向这个函数的引用
* 传递字符串、数组或布尔类型等基础类型，this指向其对应的包装对象。
* 传递一个对象时，this指向这个对象

示例使用：
```javascript
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

### apply

apply和call 很相似，区别在于第二个参数。apply 是需要参数数组，call 是需要参数列表。

语法

```javascript
func.apply(thisArg, argsArray)
```

该方法有2个参数，第一个参数为需要指定的this值，第二个参数为一个数组。

### bind

bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。

语法
```javascript
func.bind(thisArg[, arg1[, arg2[, ...]]])
```

参数：thisArg
调用绑定函数时作为 this 参数传递给目标函数的值。 如果使用new运算符构造绑定函数，则忽略该值。当使用 bind 在 setTimeout 中创建一个函数（作为回调提供）时，作为 thisArg 传递的任何原始值都将转换为 object。如果 bind 函数的参数列表为空，执行作用域的 this 将被视为新函数的 thisArg。


使用示例：
```javascript
var foo = {
  value:1
}
function bar(){
  console.log(console.log(this.value))
}

var bindFoo = bar.bind(foo)

bindFoo() // 1
```

### 三者的区别

#### call与apply的唯一区别

传给函数的参数写法不同：
* apply 第二个参数是数组；传给函数的参数都写在数组中
* call 从第2-n的参数都是传给函数的

#### call/apply 与 bind的区别

执行：

* call/apply改变了函数的**this**的指向并马上**执行该函数**
* bind是返回改变了this指向后的函数，**不执行该函数**

返回值：

* call/apply返回func的执行结果
* bind返回func的拷贝，并指定了func的this指向，保存了func的参数
### 实现call

实现思路：

1. 参考call的语法规则，需要设置一个参数`thisArg`,也就是this的指向
2. 将thisArg封装为一个Object
3. 通过为thisArg创建一个临时方法，这样thisArg就是调用该临时方法的对象了，会将该临时方法的this隐式指向到thisArg上
4. 执行thisArg的临时方法，并传递参数
5. 删除临时方法，返回方法的执行结果

```javascript
Function.prototype.myCall = function(thisArg,...arr){
  //1. 判断thisArg是否为空
  if(thisArg === null || thisArg === undefined){
    // 当thisArg为null和undefined 指向全局对象(浏览器中为window)
    thisArg = window
  }else{
    thisArg = Object(thisArg) ///创建一个可包含数字/字符串/布尔值的对象
  }

  //2. 改变this指向
  const fn = Symbol('fn') // 创建一个唯一的变量
  thisArg[fn] = this // //给thisArg对象建一个临时属性来储存this（这里this就是func函数)
  const result = thisArg[fn](..arr);

  //3. 处理结果
  delete thisArg[fn]
  return result
}
```

### 实现apply

apply的实现与call差不多，指向参数不同而已

```javascript
Function.prototype.myApply = function(thisArg, arr){
  if(thisArg === null || thisArg === undefined){
    thisArg = window
  }else{
    thisArg = Object(thisArg)
  }

  const fn = Symbol('fn')
  thisArg[fn] = this
  let result

  if(arr){
    result = thisArg[fn](..arr)
  }else{
    result = thisArg[fn]()
  }

  delete thisArg[fn]
  return result
}
```

### 实现bind

```javascript
Function.prototype.myBind = function(thisArg){
  if(typeof this !== 'function'){
    throw new TypeError(this + 'must be a function');
  }

  var that = this // this为调用myBind的函数
  var args = Array.prototype.slice.call(arguments,1) // 获取myBind函数从第二个参数到最后一个参数
  var bound =  function(){
     // 这个时候的arguments是指bind返回的函数传入的参数
    var bindArgs = Array.prototype.slice.call(arguments);
    if(this instanceof bound){
      if(that.prototype){  // that可能是ES6的箭头函数，没有prototype，所以就没必要再指向做prototype操作。
        bound.prototype = Object.create(that.prototype)

        // 可以模拟实现Object.create
        // function Empty(){}
        // Empty.prototype = that.prototype
        // bound.prototype = new Empty()
      }
      var result =  that.apply(thisArg,[...args,...bindArgs])

      var isObject = typeof result ==='object'&& result !== null
      var isFunc = typeof result === 'function'

      if(isObject || isFunc){
        return result
      }
      return this
    }else{
      return that.apply(thisArg,[...args,...bindArgs])
    }
    
  }
  return bound
}
```
参考资料：[能否模拟实现JS的bind方法](https://juejin.im/post/6844903718089916429)



## new 操作符

### new 的作用

示例说明new操作的作用

```javascript
function Foo(name){
  this.name = name;
}

Foo.prototype.sayName = function (){
  console.log(this.name)
}

const f = new Foo('ye')
console.log(f.name) // ye
f.sayName() //ye
```

根据例子可以得到以下结论：
1. new 通过构造函数 Foo 创建出来的实例可以访问到构造函数中的属性
2. new 通过构造函数 Foo 创建出来的实例可以访问到构造函数原型链中的属性

构造函数一般是没有显示的返回值的，默认返回是undefined,那么当设置了返回值对于new 操作符会有什么影响呢。看下面的例子：

```javascript
1. function Foo(name){
  this.name = name
  return 1
}
const f = new Foo('ye')
console.log(t.name) // ye

2. function Foo(name){
  this.name = name
  return { age:26}
}
const f = new Foo('ye')
console.log(f) // {age:26}
console.log(f.name) // undefined
```

从例子可以看出，当具有返回值时，构造函数内部 this 还是正常的，但当返回值是对象时，返回值会被正常使用。

### new 模拟实现

主要要实现的功能：
1. new 操作符会返回一个对象
2. 返回的对象，可以访问到挂载在this身上的任意属性
3. 返回的对象可以访问到构造函数原型上的属性
4. 返回原始值需要忽略，返回对象需要正常处理

实现代码
```javascript
function myNew(){
  var obj = new Object()
  var fn = [].shift.call(arguments) //取出第一个参数，就是我们要传入的构造函数
  obj.__proto__ = fn.prototype
  var result = fn.apply(obj,arguments)
  return result instanceof Object ? result : obj
}
```

## 深浅拷贝

先用简单的例子来说明深浅拷贝的作用。

```javascript
let Tom = {
  age:18
}

ley Jack = Tom;
Tom.age = 20;
console.log(Jack.age) //20
```

从上面的例子中可以发现，如果给一个变量赋值一个对象，那么两者的值为同一个引用，其中一方改变，另一方也会改变。这在我们实际的开发场景中是不希望看见的。那么深浅拷贝就为了解决这个问题的。

### 浅拷贝

针对对象的情况可以使用Object.assgin 和 展开运算符（...）;针对数组的可以使用slice、concat等方法。

```javascript
let Tom = {
  age:18
}
let Jack = Object.assign({},Tom) 或者 let Jack = {...Tom}
Tom.age = 20
console.log(Jack.age) // 10
```
浅拷贝基本上可以解决大部分问题，但是如果是下面的情况，还是需要深拷贝。

```javascript
let Tom = {
    age: 18;
    hair:{
        color:'black',
        length:'long'
    }
}
let Jack = { ...Tom };
Tom.hair.color = 'red';
console.log(Jack.hair.color) // red
```
当有多层嵌套的时候，浅拷贝就不能满足需求了，那就需要深拷贝

### 深拷贝

那如何深拷贝呢，最简单的方法就是使用`JSON.parse(JSON.stringify(obj))`,但是这个方法具有一定的局限性。如图所示:
![An image](./images/deepCopy.png)

从上图中你会发现
1. 不拷贝undefined和Symbol类型的值
2. 不拷贝函数


### 浅拷贝实现

```javascript
function shallowCopy(obj){
   // 只拷贝对象
  if(typeof obj !== 'object') return;
  var newObj = Array.isArray(obj) ? [] : {}
  for(var key in obj){
     // 遍历obj，并且判断是obj的属性才拷贝
    if(obj.hasOwnProperty(key)){
      newObj[key] = obj[key]
    }
  }
  return newObj
}
```

思路:
1. 前提针对引用类型
2. 判断类型进行不同的初始化
3. 遍历排除不是自身的属性时不进行拷贝

### 深拷贝实现

```javascript
function deepCopy(obj){
  if(typeof(obj) !== 'object') return;
  var newObj = Array.isArray(obj) ? [] : {}
  for(var key in obj){
    if(obj.hasOwnProperty(key)){
      if(typeof(obj[key]) == 'object'){
        deepCopy(obj[key])
      }else{
        newObj[key] = obj[key]
      }
    }
  }
  return newObj
}
```
思路与浅拷贝类似，只是添加在遍历中判断子项是否为object，如果是递归遍历，不是就赋值。

## 函数防抖与节流

### 概念

函数 防抖(debounce)与节流(throttle)都是为了限制函数的执行次数，以优化函数触发频率过高导致的响应速度跟不上触发频率，出现延迟、假死或者卡顿的现象。

**函数防抖** 是指触发事件后在n秒内 函数只能被执行一次，如果在n秒内又触发了事件，则会重新计算函数执行时间。

**函数节流** 对于持续触发的事件，规定一个间隔时间，每一个段间隔时间中函数只执行一次


形象描述
> 函数防抖 ：如果有人进电梯（触发事件），那电梯将在10秒钟后出发（执行事件监听器），这时如果又有人进电梯了（在10秒内再次触发该事件），我们又得等10秒再出发（重新计时）。

> 函数节流 ：保证如果电梯第一个人进来后，10秒后准时运送一次，这个时间从第一个人上电梯开始计时，不等待，如果没有人，则不运行

#### 使用场景
* 窗口大小Resize
* 拖拽时的mousemove事件
* 搜索框搜索输入
* 高频点击提交，表单重复提交
* 滚动加载

### 函数防抖实现

```javascript
function debounce(fn,time){
  var timer = null;
  return function(){
    clearTimeout(timer);
    timer = setTimeout(()=>{
      fn()
    },time)
  }
}
```

### 函数节流实现

```javascript
function throttle(fn,time){
  var timer = null;
  var stratTime = + new Date()
  return furnction(){
    clearTimeout(timer);
    var now = + new Date();
    if(now - startTime <= time){
      timer = setTimeout(()=>{
        fn()
      },time)
    }else{
      fn();
      startTime = now
    }
  }
}
```


以上的函数防抖与节流的实现，都只是一个简单版本；还有许多细节需要补充。但是理解了它们的原理。在实际运用中其实可以使用一些成熟的三方库。例如lodsh、underscore等

## 函数柯里化

### 概念

函数柯里化（Currying）是把接受多个参数的函数变成接受一个单一参数的函数切返回结果的新函数的技术。

举个例子：
```javascript
function add(a,b){
  returun a + b
}
add(1,2) //3

// 假设有一个curry 函数可以做到柯里化

var addCurry = curry(add)
addCurry(1)(2) // 3
```

### 函数实现

#### 第一版
```javascript
var curry = function(fn){
  var params = [].slice.call(arguments,1)
  return function(){
    var _params = [].slice.call(arguments)
    return fn.apply(this,params.concat(_params))
  }
}
```
测试用例：
```javascript
function add(a,b){
  return a + b
}

var addCurry1 = curry(add,1,2)
var addCurry2 = curry(add,1)
var addCurry3 = curry(add)

console.log(addCurry1())  //3
console.log(addCurry2(2)) //3
console.log(addCurry3(1,2)) //3
console.log(addCurry3(1)(2)) // Uncaught TypeError: addCurry3(...) is not a function
```

会发现好像基本满足了要求，但是测试用例4好像不满足。需要改进

#### 第二版

```javascript
function subCurry(fn){
  var params = [].slice.call(arguments,1)
  return function(){
    var _params = [].slice.call(arguments);
    return fn.apply(this,params.concat(_params))
  }
}

function curry(fn,length){
  var lenghth = length || fn.length // 参数长度
  return function(){
    var len = arguments.length
    if(len < length){
      var params = [fn].concat([].slice.call(arguments))
      return curry(subCurry.apply(this,params),len)
    }else{
      return fn.apply(this,arguments)
    }
  }
}
```

#### ES6写法

```javascript
var curry = fn =>
    judge = (...args) =>
        args.length === fn.length
            ? fn(...args)
            : (arg) => judge(...args, arg)
```



## instanceof 的实现

instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。

语法：`object instanceof constructor`

object 代表实例 constructor 代表构造函数

```javascript
function instanceof(left,right){
  let leftValue = left.__proto__
  let rightValue = right.prototype
  while(1){
    if(!leftValue){ // 最顶层null
      return false
    }
    if(leftValue === rightValue){
      return true
    }
    leftValue = leftValue.__proto__
  }
}
```

## Object.create() 的实现

## Async函数实现

<!-- [async参考链接](https://mp.weixin.qq.com/s/ykrZZxCoC8O8D__Qimrtrg) -->
<!-- https://mp.weixin.qq.com/s/-Jf48IVOoOSLgOV60rm0Wg -->

## EventEmitter

## Class继承ES5实现

```javascript
function Super() {
  this.a = 1;
}

function Child() {
  // 属性继承
  Super.call(this);
  this.b = 2;
}
// 原型继承
Child.prototype = new Super();

const child = new Child();
child.a;  // 1


const extends = (Child, Super) => {
  const fn = function () {};
  
  fn.prototype = Super.prototype;
  Child.prototype = new fn();
  Child.prototype.constructor = Child;
};
```
## 数组去重

数组去重是一道很常问的面试题，在日常开发也很频繁。那什么方法才是最优的呢？那又要哪些方法呢？

### 去重的方法

#### 双层for循环

最笨最直接的方法

```javascript
function unique(arr){
  let len = arr.length;
  let res = []
  for(let i=0; i < len; i++){
    let flag = false
    for(let j=i+1;j<len;j++){
      if(arr[i] === arr[j]){
        flag = true
      }
    }
    if(!flag){
      res.push(arr[i])
    }
  }
  return res
}
```
#### Array.filter() 加 indexOf

使用高级函数配合indexOf查找下标，如果下标等于当前索引就不存在重复元素。

```javascript
function unique(arr){
  return arr.filter((item,index)=>{
    return arr.indexOf(item) === index
  })
}
```
#### Array.sort() 加一层遍历相邻元素不相等

```javascript
function unique(arr){
  let res = []
  let _arr = arr.sort()
  let perNum = undefined
  let len = _arr.length
  for(let i=0;i<len;i++){
    if(!i || perNum !== _arr[i]){
      res.push(_arr[i])
    }
    perNum = _arr[i]
  }
  return res
}
```

思想: 调用了数组的排序方法 sort()，V8引擎 的 sort() 方法在数组长度小于等于10的情况下，会使用插入排序，大于10的情况下会使用快速排序。然后根据排序后的结果进行遍历及相邻元素比对，如果相等则跳过该元素，直到遍历结束。

#### Es6 Set方法

```javascript
let unique = (arr) => [...new Set(arr)]
```

#### Object 键值对

```javascript
function unique(arr){
  let obj = {};
  return arr.filter((item)=>{
    let str = typeof(item) + item
    return obj.hasOwnProperty(str) ? false : obj[str] = true
  })
}
```

这种方法是利用一个空的 Object 对象，我们把数组的值存成 Object 的 key 值，比如 Object[value1] = true，在判断另一个值的时候，如果 Object[value2]存在的话，就说明该值是重复的. 

但是需要注意的一点是因为对象的键值只能是字符串,那么其实值为 123 和 '123' 会是相等的。所以需要加上一个类型。

### 性能测试

那么哪种方法的性能最好呢？我们写一段简单的测试性能代码简单的测试一下。

```javascript
let arr1 = Array.from(new Array(100000), (x, index)=>{
    return index
})

let arr2 = Array.from(new Array(50000), (x, index)=>{
    return index*2
})

let example = [...arr1,...arr2]

console.log('初始数组长度',example.length)
let start = window.performance.now();
console.log('开始时间', start)

let res = unique(example)// 各个方法

console.log('去重后的长度', res.length)

let end = window.performance.now();
console.log('耗时', end - start)
```
按顺序测试得到的数据如下：


初始数组长度 150000
开始时间 69.05000004917383
去重后的长度 100000
耗时 14234.754999983124

初始数组长度 150000
开始时间 41.63500003051013
去重后的长度 100000
耗时 8617.219999956433


初始数组长度 150000
开始时间 135.97000000299886
去重后的长度 100000
耗时 22.514999960549176

初始数组长度 150000
开始时间 106.8849999574013
去重后的长度 100000
耗时 11.095000023487955

初始数组长度 150000
开始时间 48.134999989997596
去重后的长度 100000
耗时 90.00999998534098


分析数据得出结果

双重 for 循环 >  Array.filter()加 indexOf  > Array.sort() 加一行遍历冒泡 > Object 键值对去重复 > ES6中的Set去重 

可能的测试结果有问题,但是显然可以得出 后几种的方法性能更佳

### 注意事项

#### 特殊变量类型的考虑

以上几种方法对于特殊变量类型是否都适用，比如NaN,对象等。

NaN === NaN 输出的是false，indexOf底层适用的是恒等(===)进行的判断所以，indexOf查到不到NaN元素。

Set可以去重NaN类型， Set内部认为尽管 NaN === NaN 为 false，但是这两个元素是重复的。

用下面这个例子来测试一下：
```javascript
function test(){
  var array = [1, 1, '1', '1', null, null, undefined, undefined, false,false, NaN, NaN,{a:1},{a:1},{a:2}];
  let res = unique(array)// 各个方法
  console.log(res)
}
```
依次分别输出

```javascript
[1, "1", null, undefined, false, NaN, NaN, {a:1}, {a:1}, {a:2}] // 对象 和 NaN无效

[1, "1", null, undefined, false, {a:1}, {a:1}, {a:2}] //对象 和 NaN无效

[1, "1", NaN, NaN, {a:1}, {a:1}, {a:2}, false, null, undefined] //对象 和 NaN无效

[1, "1", null, undefined, false, NaN, {a:1}, {a:1}, {a:2}] //对象无效

[1, "1", null, undefined, false, NaN, {a:1}] //对象无效
```


#### 时间复杂度和空间复杂度

以上的所有数组去重方式，应该 Object 对象去重复的方式是时间复杂度是最低的，除了一次遍历时间复杂度为O(n) 后，查找到重复数据的时间复杂度是O(1)，但是对象去重复的空间复杂度是最高的。