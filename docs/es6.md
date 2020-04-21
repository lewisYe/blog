# ES6

## let 和 const

### 块级中作用域

ES5只有全局作用域和函数作用域，没有块级作用域，这带来很多不合理的场景。

1. 内层变量可能会覆盖外层变量
```
var tmp = 'global'

function f(){
  console.log(temp)
  if(false){
    var temp = 'fuction'
  }
}

f() // undefied
```
输出结果为undefined,原因在于变量提升，导致内层的tmp变量覆盖外层的tmp变量

2.用来计数的循环变量泄露为全局变量

```
var str = 'hello'
for(var i=0;i<str.length;i++){
  console.log(str[i])
}
console.log(i) // 5
```
变量只用来控制循环，但是循环结束后，它并没有消失，泄露成为了全局变量

### let、const

ES6 新增了 let 和 const 关键字用来声明变量，实际上为JavaScript新增了块级作用域。

注意点：ES6 的块级作用域必须有大括号，如果没有大括号，JavaScript 引擎就认为不存在块级作用域。

接下来看一下let 和 const 的特点

#### 1.不存在变量提升

```
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
let bar = 2;
```
#### 2.重复声明报错
```
// 报错
function func() {
  let a = 10;
  var a = 1;
}

// 报错
function func() {
  let a = 10;
  let a = 1;
}
```

#### 3.不绑定全局作用域

```
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1

let b = 1;
window.b // undefined
```

#### 4. 暂时性死区

```
var tmp = 123;

if (true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}
```
ES6 明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。

总之，在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。


#### let 与 const 区别

const 用于声明常量，其值一旦被设定不能再被修改，否则会报错。

const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针。

```
const data = {
    value: 1
}

// 没有问题
data.value = 2;
data.num = 3;

// 报错
data = {}; // Uncaught TypeError: Assignment to constant variable.
```

## arrow function

### 基本语法

```
var f = v => v;

// 等同于
var f = function (v) {
  return v;
};

// 如果需要给函数传入多个参数：
let func = (value, num) => value * num;

// 如果函数的代码块需要多条语句：
let func = (value, num) => {
    return value * num
};

//如果需要直接返回一个对象：需要使用括号括起来 
let func = (value, num) => ({total: value * num});

//与变量解构结合：
let func = ({value, num}) => ({total: value * num})

// 使用
var result = func({
    value: 10,
    num: 10
})

console.log(result); // {total: 100}
```

### 使用注意点

#### 没有this

函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。

this指向的固定化，并不是因为箭头函数内部有绑定this的机制，实际原因是箭头函数根本没有自己的this，导致内部的this就是外层代码块的this。正是因为它没有this，所以也就不能用作构造函数。

这就意味着如果箭头函数被非箭头函数包含，this 绑定的就是最近一层非箭头函数的 this。

```
function foo() {
  setTimeout(() => {
    console.log('id:', this.id);
  }, 100);
}

var id = 21;

foo.call({ id: 42 });
// id: 42
```

上述函数转换为ES5
```
function foo(){
  var _this = this;
  setTimeout(function(){
    console.log('id:',_this.id)
  },100)
}
```

由于箭头函数没有自己的this，所以当然也就不能用call()、apply()、bind()这些方法去改变this的指向。

#### 不能作为构造函数、不可以使用new命令

JavaScript 函数有两个内部方法：[[Call]] 和 [[Construct]]。

当通过 new 调用函数时，执行 [[Construct]] 方法，创建一个实例对象，然后再执行函数体，将 this 绑定到实例上。

当直接调用的时候，执行 [[Call]] 方法，直接执行函数体。

箭头函数并没有 [[Construct]] 方法，不能被用作构造函数，如果通过 new 的方式调用，会报错。

```
var Foo = () => {};
var foo = new Foo(); // TypeError: Foo is not a constructor
```

#### 不可以使用arguments对象

```
function foo() {
  setTimeout(() => {
    console.log('args:', arguments);
  }, 100);
}

foo(2, 4, 6, 8)
// args: [2, 4, 6, 8]
```
上面代码中，箭头函数内部的变量arguments，其实是函数foo的arguments变量。

你可以通过命名参数或者 rest 参数的形式访问参数:
```
let nums = (...nums) => nums;
```
## Symbol

ES6 引入了一种新的原始数据类型 Symbol，表示独一无二的值。
#### 1. Symbol 值通过 Symbol 函数生成，使用 typeof，结果为 "symbol"
```
var s = Symbol();
console.log(typeof s); // "symbol"
```

#### 2. Symbol 函数前不能使用 new 命令，否则会报错。这是因为生成的 Symbol 是一个原始类型的值，不是对象。

#### 3. instanceof 的结果为 false
```
var s = Symbol('foo');
console.log(s instanceof Symbol); // false
```

#### 4. 相同参数的 Symbol 函数的返回值是不相等的。

#### 5. Symbol 值不能与其他类型的值进行运算，会报错。


## Set 和 Map

### Set

ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

Set 本身是一个构造函数，用来生成Set 数据结构
```
var s = new Set()
```

#### 属性和方法

属性：
1. Set.Prototype.constructor 构造函数，默认Set 函数
2. Set.Prototype.size  实例的成员总数

方法：
1. Set.Prototype.add(value) 添加某个值 返回Set结构本身
2. Set.Prototype.delete(value) 删选某个值，返回一个布尔值，表示删除是否成功
3. Set.Prototype.has(value) 判断是否具有否值
4. Set.Prototype.clear() 清楚所有成员 没有返回值

注意 在Set 内部认为NaN 是相等的

遍历方法有：

keys()：返回键名的遍历器
values()：返回键值的遍历器
entries()：返回键值对的遍历器
forEach()：使用回调函数遍历每个成员，无返回值

#### 作用 

数组去重
```
var s = new Set([1,2,3,4,4])

return [...s] // 1,2,3,4
```

### Map

JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键。这给它的使用带来了很大的限制。

为了解决这个问题，ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。

```
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```

#### 属性和方法

1. size属性返回 Map 结构的成员总数。

2. Map.prototype.set(key, value)

set方法设置键名key对应的键值为value，然后返回整个 Map 结构。如果key已经有值，则键值会被更新，否则就新生成该键。

3. Map.prototype.get(key)

get方法读取key对应的键值，如果找不到key，返回undefined。

4. Map.prototype.has(key)
has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。

5. Map.prototype.delete(key)
delete方法删除某个键，返回true。如果删除失败，返回false。

6. Map.prototype.clear()

clear方法清除所有成员，没有返回值。

#### 遍历

Map 结构原生提供三个遍历器生成函数和一个遍历方法。

Map.prototype.keys()：返回键名的遍历器。
Map.prototype.values()：返回键值的遍历器。
Map.prototype.entries()：返回所有成员的遍历器。
Map.prototype.forEach()：遍历 Map 的所有成员。

## Proxy 和 defineProperty

### defineProperty

ES5 提供了 Object.defineProperty 方法，该方法可以在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回这个对象

语法：
```
Object.defineProperty(obj, prop, descriptor)
```
参数：
* obj 要定义属性的对象。
* prop 要定义或修改的属性的名称或 Symbol 。
* descriptor 要定义或修改的属性描述符。

返回值：被传递给函数的对象

举个例子
```
var o = {}; // 创建一个新对象

// 在对象中添加一个属性与数据描述符的示例
Object.defineProperty(o, "a", {
  value : 37
});
```

你可能会觉得给一个对象定义一个新属性需要这么麻烦吗 有必要吗 直接赋值不就行了 那接下来我们做个对比 看看差别：

```
var obj1 = {}
obj1.name = 'obj1'
console.log(Object.keys(obj1)) // ["name"]
console.log(obj1.name) // obj1
obj1.name = 'obj3'
console.log(obj1.num) //  obj3
delete obj1.name
console.log(obj1.name) // undefined

var obj2 = {}

Object.defineProperty(obj2,'name',{
  value:'obj2'
})
console.log(Object.keys(obj2)) // []
console.log(obj2.name) // obj2
obj2.name = 'obj3' 
console.log(obj2.name) // obj2
delete obj2.name
console.log(obj2.name) // obj2
``` 

对比会发现通过defineProperty定义的对象属性竟然不能被修改和删除和被枚举 这是为什么呢。那就接下往下

#### descriptor

对象里目前存在的属性描述符主要有2种形式：**数据描述符** 和 **存取描述符**

数据描述符是一个具有值的属性，该值可以是可写的，也可以是不可写的。

存取描述符是由 getter 函数和 setter 函数所描述的属性。


##### 两者均具有以下两种键值：

**configurable**

`当且仅当该属性的 configurable 键值为 true 时，该属性的**描述符**才能够被改变，同时该属性也能从对应的对象上被删除。 默认值 false`

**enumerable**

`当且仅当该属性的 enumerable 键值为 true 时，该属性才会出现在对象的枚举属性中 默认值 false`

##### 数据描述符还具有以下可选键值：

**value**

`该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined`

**writable**

`当且仅当该属性的 writable 键值为 true 时，属性的值，也就是上面的 value，才能被赋值运算符改变。 默认为 false。`

#### 存取描述符还具有以下可选键值：

**get**

`属性的 getter 函数，如果没有 getter，则为 undefined。当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 this 对象（由于继承关系，这里的this并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值。默认为 undefined。`

**set**

`属性的 setter 函数，如果没有 setter，则为 undefined。当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 this 对象。 默认为 undefined`


**注意点： 一个描述符只能是这两者其中之一；不能同时是两者。**

此外，所有的属性描述符都是非必须的，但是 descriptor 这个字段是必须的，如果不进行任何配置，你可以这样：

```
var obj = Object.defineProperty({}, "num", {});
console.log(obj.num); // undefined
```

### Setters 和 Getters

存取描述符中的 get 和 set，这两个方法又被称为 getter 和 setter。由 getter 和 setter 定义的属性称做”存取器属性“。

当程序查询存取器属性的值时，JavaScript 调用 getter方法。这个方法的返回值就是属性存取表达式的值。

当程序设置一个存取器属性的值时，JavaScript 调用 setter 方法，将赋值表达式右侧的值当做参数传入 setter。从某种意义上讲，这个方法负责“设置”属性值。可以忽略 setter 方法的返回值。

举个例子：
```
var obj = {}, value = null;
Object.defineProperty(obj, "num", {
    get: function(){
        console.log('执行了 get 操作')
        return value;
    },
    set: function(newValue) {
        console.log('执行了 set 操作')
        value = newValue;
    }
})

obj.num = 1 // 执行了 set 操作

console.log(obj.num); // 执行了 get 操作 // 1
```

这样是不是进行了数据监听，数据的改变可以感知到。

### 数据监听

现在有这么一个场景，页面中有一个按钮，每点击一次按钮数值都加1，数值在页面中显示。这改如何实现呢。

html 伪代码：
```
<div id="number">1</div>
<button id="button">点击+1</button>
```

原生js实现：
```
var num = document.getElementById('number')
var btn = document.getElementById('button')
btn.addEventListener('click',function()=>{
  num.innerHTML = Number(num.innerHTML) + 1
})
```

那上面扯了那么多，是不是说明使用defineProperty 也可以实现呢

```
var num = document.getElementById('number')
var btn = document.getElementById('button')

var obj = {
  num:1
}

var value = obj.num;

Object.defineProperty(obj,'num',{
  get:function(){
    return value
  },
  set:function(val){
    value = val; // 这里不能 obj.num = newValue 所以需要新设置一个value变量暂存下值
    num.innerHTML = val;
  }
})

btn.addEventListener('click',function(){
  obj.num += 1;
})
```
某些同学可能会觉得代码反而变多了而且通用性不搞，那就封装一下。

#### watch 

```
function watch(obj,name,fn){
  var value = obj[name]
  Object.defineProperty(obj,name,{
    get:function(){
      return name
    },
    set:function(val){
      value = val
      fn(val)
    }
  })
  if (value) obj[name] = value
}
```

### Proxy

Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。

Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。

```
proxy = new Proxy(target,handler)
```
Proxy 对象的所有用法，都是上面这种形式，不同的只是handler参数的写法。其中，new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。

```
var proxy = new Proxy({}, {
  get: function(target, propKey) {
    return 35;
  },
  set: function(target,propKey,value){
    target[propkey] = value
  }
});

proxy.time // 35
proxy.name // 35
proxy.title // 35
```

注意，要使得Proxy起作用，必须针对Proxy实例（上例是proxy对象）进行操作，而不是针对目标对象（上例是空对象）进行操作。

Proxy支持的拦截操作，共 13 种：
1. **get(target, propKey, receiver)**：拦截对象属性的读取，比如proxy.foo和proxy['foo']。
2. **set(target, propKey, value, receiver)**：拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
3. **has(target, propKey)**：拦截propKey in proxy的操作，返回一个布尔值。
4. **deleteProperty(target, propKey)**：拦截delete proxy[propKey]的操作，返回一个布尔值。
5. **ownKeys(target)**：拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
6. **getOwnPropertyDescriptor(target, propKey)**：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
7. **defineProperty(target, propKey, propDesc)**：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
8. **preventExtensions(target)**：拦截Object.preventExtensions(proxy)，返回一个布尔值。
9. **getPrototypeOf(target)**：拦截Object.getPrototypeOf(proxy)，返回一个对象。
10. **isExtensible(target)**：拦截Object.isExtensible(proxy)，返回一个布尔值。
11. **setPrototypeOf(target, proto)**：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
12. **apply(target, object, args)**：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
13. **construct(target, args)**：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。

拦截的具体细节可以查看阮一峰老师的 [《ECMAScript 6 入门》](https://es6.ruanyifeng.com/#docs/proxy)

值得注意的是，proxy 的最大问题在于浏览器支持度不够，而且很多效果无法使用 poilyfill 来弥补。

### Wacth Proxy 实现

```
function wacth(target,fn){
  var proxy = new Proxy(target,{
    get:function(target,prokey){
      return target[prokey]
    },
    set:function(taget,prokey,value){
      taget[prokey] = value
      fn(prokey,value)
    }
  })
  return proxy
}
```

### defineProperty 和 Proxy 区别

Proxy

* 代理的是 对象
* 可以拦截到数组的变化
* 拦截的方法多达13种
* 返回一个拦截后的数据

Object.defineProperty

* 代理的是属性
* 对数组数据的变化无能为力
* 直接修改原始数据


### 应用场景
vue 2 使用 defineProperty 通 getter / setter 进行数据劫持

vue 3 换成 Proxy, 存在向下兼容问题

## Promise对象

### 介绍

Promise 是异步编程的一种解决方案。相比传统的回调函数模式更加合理和强大。

Promise对象 具有3个状态：`pending(进行中)`、`fulfilled(已完成)`、`rejected(已失败)`

含有以下特点：
1. 对象的状态不受外界影响
2. 一旦状态改变，就不会再改变，而且任何时候可以获取到

缺点：
1. Promise 一旦新建它就会立即执行，无法中途取消。
2. Promise内部抛出的错误，不会反应到外部。
3. 当处于pending状态时，无法得知目前进展到哪一个阶段

注意，为了方便，本章后面的resolved统一只指fulfilled状态。

### 基本用法

ES6 规定，Promise对象是一个构造函数，用来生成Promise实例。
```
const promise = new Promise(function(resolve,reject){
  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
})

promise.then(function(value) {
  // success
}, function(error) {
  // failure
}).catch(function(error) {
  console.log('发生错误！', error);
});
```

Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

resolve函数的作用是，将Promise对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；

reject函数的作用是，将Promise对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

Promise 实例具有then、catch、finally等方法，也就是说这些方法是定义在原型对象 Promise.prototype 上的。

then方法 它的作用是为 Promise 实例添加状态改变时的回调函数。第一个参数是resolved状态的回调函数，第二个参数（可选）是rejected状态的回调函数。 返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。因此可以采用链式写法，即then方法后面再调用另一个then方法。

catch方法 用于指定发生错误时的回调函数

finally方法用于指定不管 Promise 对象最后状态如何，都会执行的操作


### Promise.all()

Promise.all()方法用于将多个Promise实例，包装成一个新的Promise实例。
```
var p = Promise.all([p1,p2,p3])
```
Promise.all()方法接受一个数组作为参数，参数必需都是 Promise 实例，如果不是，就会先调用下面讲到的Promise.resolve方法，将参数转为 Promise 实例，再进一步处理。参数也可以不是数组，但必须具有 Iterator 接口

Promise.all的实例状态由参数Promise实例决定，分成两种情况。

（1）只有参数的状态都变成resolve，状态才会变成resolved，此时参数实例的返回值组成一个数组，传递给实例的回调函数。

（2）只要参数之中有一个被rejected，状态就变成rejected，此时第一个被reject的实例的返回值，会传递给回调函数。

注意，如果作为参数的 Promise 实例，自己定义了catch方法，那么它一旦被rejected，并不会触发Promise.all()的catch方法。

```
  const p1 = new Promise((resolve, reject) => {
    resolve('hello');
  })
  .then(result => result)
  .catch(e => e);

  const p2 = new Promise((resolve, reject) => {
    throw new Error('报错了');
  })
  .then(result => result)
  .catch(e => e);

  Promise.all([p1, p2])
  .then(result => console.log(result))
  .catch(e => console.log(e));
  // ["hello", Error: 报错了]
```

### Promise.race(iterable)

Promise.race()方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

```
var p = Promise.race([p1, p2, p3]);
```

虽然该方法与Promise.all()参数相同，但是不同的在于参数实例中有一个实例率先改变状态，状态就会跟着改变。那个率先改变的 Promise 实例的返回值，就传递给回调函数。

### Promise.reject(reason)

返回一个状态为失败的Promise对象，并将给定的失败信息传递给对应的处理方法

### Promise.resolve(value)
返回一个状态由给定value决定的Promise对象


### 模拟实现Promise

#### 第一步

要实现的功能：
1. 具有3个状态值
2. 一个then方法挂载在Promise.prototype上
3. 具有resolve和reject 方法

```
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function Promise(fn){
  this.staus = PENDING;
  this.value = undefined;
  this.reason = undefiend;

  var that = this;
  function resolve(){

  }

  function reject(){

  }
  fn(resolve,resolve)
}

Promise.prototype.then=function(onResolved,onRejected){

}
```

#### 第二步
Promise的状态只能从pending -> resolved 或者 pending -> rejected.添加代码

```
function resolve(value){
  if(that.status === PEDNING){
    that.value = value
    that.status === RESOLEVD
  }
}

function reject(error){
  if(that.status == PENDING){
    that.reason = error
    that.status = REJECTED
  }
}
```

#### 第三步
then 方法有2个参数，第一个为onResolved 成功时调用，第二个为onRejected 失败时调用。

```
Promise.prototype.then=function(onResolved,onRejected){
  if(this.status == RESOLVED){
    onResolved(this.value)
  }
  if(this.status == REJECTED){
    onRejected(this.value)
  }
}
```

#### 第四步

当Promise的执行遇到错误时，会直接变成rejected状态.添加一段try catch

```
try{
  fn(resolve,reject)
}catch(e){
  rejected(e)
}
```

#### 第五步

目前基本的功能都已经完成，但是不能处理异步的情况。所以我们添加2个数组来保存异步方法。当状态改变时，遍历执行数组中的方法。

所以代码如下：
```
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'
function Promise(fn){
  var that = this
  this.status = PENDING
  this.value = undefined
  this.reason = undefined
  this.onResolvedStack = []
  this.onRejectedStack = []

  function resolve(value){
    if(that.status == PENDING){
      that.status = RESOLVED
      that.value = value
      that.onResolvedStack.forEach(function(fn){
        fn(that.value)
      })
    }
  }

  function reject(error){
    if(that.status == PENDING){
      that.status = REJECTED
      that.reason = error
      that.onRejectedStack.forEach(function(fn){
        fn(that.reason)
      })
    }
  }

  try{
    fn(resovle,reject)
  }catch(e){
    reject(e)
  }
}

Promise.prototype.then = function(onResolved,onRejected){
  if(this.status == RESOLVED){
    onResolved(this.value)
  }
  if(this.status == REJECTED){
    onRejected(this.reason)
  }
  if(this.status == PENDING){
    this.onResolvedStack.push(onResolved)
    this.onRejectedStack.push(onRejected)
  }
}
```
ok 这已经算是一个基础的Promise 实现了,但是还需要进行一些完成。比如then方法会返回一个新的promise值等

#### 添加Promise.all方法

```
Promise.all = function (promiseArrs) { //在Promise类上添加一个all方法，接受一个传进来的promise数组
    return new Promise((resolve,reject) => {
        let values = [];
        let count = 0;
        let len = promiseArrs.length; 
        for(let i=0; i<len； i++){
            this.resolve(promiseArrs[i]).then(res => {
                values[i] = res;
                count++;
                 // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
                if (count === len) resolve(values)
            },err => {
            	// 有一个被rejected时返回的MyPromise状态就变成rejected
                reject(err)
            })
        }
    })
}

```

#### 添加Promise.race方法

```
Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(resolve, reject);
        }
    })
}
```

## Iterator 和 for...of 循环

遍历器（Iterator）是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

Iterator 的作用有三个：
一是为各种数据结构，提供一个统一的、简便的访问接口；

二是使得数据结构的成员能够按某种次序排列；

三是 ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费。

其实本质就是一个具有 next() 方法的对象，每次调用 next() 都会返回一个结果对象，该结果对象有两个属性，value 表示当前的值，done 表示遍历是否结束。

用ES5语法模拟一个iterator:
```
function makeIterator(items){
  var index = 0;
  return{
    next:function(){
      var done = index >= items.length;
      var value = done ? undefined:items[index++]
      return{
        done:done,
        value:value
      }
    }
  }

}

var i = makeIterator([1,2,3])
console.log(i.next()); // { done: false, value: 1 }
console.log(i.next()); // { done: false, value: 2 }
console.log(i.next()); // { done: false, value: 3 }
console.log(i.next()); // { done: true, value: undefined }
```
### for ... of

ES6引入了for...of循环，作为遍历所有数据结构的统一的方法。

那使用for...of 遍历我们模拟生成的iterator对象是什么结果
```
var i = makeIterator([1,2,3])

for(var n of i){
  console.log(n) // Uncaught TypeError: i is not iterable
}

```
结果是报错了，那怎么才能使用for ... of遍历呢。

一个数据结构只要部署了Symbol.iterator属性，就被视为具有 iterator 接口，就可以用for...of循环遍历它的成员。也就是说，for...of循环内部调用的是数据结构的Symbol.iterator方法。

举例说明：
```
const obj = {
    value: 1
};

obj[Symbol.iterator] = function() {
    return createIterator([1, 2, 3]);
};

for (value of obj) {
    console.log(value);
}
```
for...of循环可以使用的范围包括数组、Set 和 Map 结构、某些类似数组的对象（比如arguments对象、DOM NodeList 对象）、后文的 Generator 对象，以及字符串。



## Generator 函数

Generator 函数也是ES6提供的一种异步编程解决方案。

Generator 函数有多种理解角度。

语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。执行 Generator 函数会返回一个遍历器对象。

形式上，Generator 函数是一个普通函数，但是有两个特征。一是，function关键字与函数名之间有一个星号；二是，函数体内部使用yield表达式，定义不同的内部状态。

基本用法

```
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();

hw.next() // { value: 'hello', done: false }

hw.next() // { value: 'world', done: false }

hw.next() // { value: 'ending', done: true }

hw.next() // { value: undefined, done: true }
```

由于 Generator 函数返回的遍历器对象，只有调用next方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。yield表达式就是暂停标志。

遍历器对象的next方法的运行逻辑如下。

（1）遇到yield表达式，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。

（2）下一次调用next方法时，再继续往下执行，直到遇到下一个yield表达式。

（3）如果没有再遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。

（4）如果该函数没有return语句，则返回的对象的value属性值为undefined。

需要注意的是，yield表达式后面的表达式，只有当调用next方法、内部指针指向该语句时才会执行，因此等于为 JavaScript 提供了手动的“惰性求值”（Lazy Evaluation）的语法功能。


Generator 函数返回的遍历器对象，还有有一个throw和return方法，throw可以在函数体外抛出错误，然后在 Generator 函数体内捕获。return可以返回给定的值，并且终结遍历 Generator 函数。

在一个 Generator 函数里面执行另一个 Generator 函数，可以yield*表达式。

```
function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

```

Generator 函数也不能跟new命令一起用，会报错。


## Async 函数

async 函数其实是 Generator 函数的语法糖。

用法：

```
async function () {
  const n = await 1
  const m = await 2
};
```
比较会发现，async函数就是将 Generator 函数的星号（*）替换成async，将yield替换成await，仅此而已。

但是async函数对 Generator 函数的改进，体现在以下四点

1. 内置执行器。
Generator 函数的执行必须靠执行器，所以才有了co模块，而async函数自带执行器。

2. 更好的语义。
async和await，比起星号和yield，语义更清楚了。async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。

3. 更广的适用性。

co模块约定，yield命令后面只能是 Thunk 函数或 Promise 对象，而async函数的await命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）。

4. 返回值是 Promise。

async函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了

使用注意点：

1. 第一点 把await命令放在try...catch代码块中  因为存在rejected的情况

2. 多个await命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。 使用Promise.all

3. await命令只能用在async函数之中，如果用在普通函数，就会报错。

4. async 函数可以保留运行堆栈。

## ES6 3种异步处理方法的区别

用一个例子的使用来比较 async 函数与Promise、Generator 函数的比较

假设有一系列的异步请求，前一个异步请求结束，才能开始下一个异步请求，其中一个异步请求出错，就不会继续向下执行，返回上一次的值。

1.**Promise 写法**

function chainRequestPromise(requests){
  let res = null // 返回值

  let p = Promise.resolve()

  for(let req of requests){
    p = p.then(function(val){
      res = val
      return req()
    })
  }

  return p.catch(functiob(e){

  }).then(function(){
    return res
  })
}

Promise 的写法是解决了回调函数的多层嵌套问题，改用then方法链式调用的形式。但是还是有大量的代码冗余，全是一些then方法。

2. **Generator写法**

```
var co = require('co');
function chainRequestGenerator(requests){
  return co(function* (){
    let res = null
    try{
      for(let req of request){
        res = yield req()
      }
    }catch(e){

    }
    return res
  })
}
```

这种写法的问题在于必须有一个任务运行器，自动执行Generator 函数;co函数就是自动执行器，它返回一个 Promise 对象，而且必须保证yield语句后面的表达式，必须返回一个 Promise。

3. **async函数**

```
async function chainRequestAsync(requests){
  let res = null
  try{
    for(let req of requests){
      res = await req()
    }catch(e){

    }
  }
  return res
}
```

async 函数的实现最简洁，最符合语义，而且将Generator 写法中的自动执行器内部实现啦。

## Class

ES6 引入了Class（类）这个概念，通过class 关键字可以定义类。其实 class  只是一个语法糖，可以使用ES5写法实现绝大部分功能。只是说class写法让对象原型的写法更加清晰、更像面向对象编程的语法。让写法更加与传统的面向对面语音差异不大。

class写法举例：
```
class Point{
  constructor(x,y){
    this.x = x;
    this.y = y;
  }

  toString(){
    return `(${this.x},${this.y})`
  }
}
```

如果改成ES5写法：
```
function Ponit(x,y){
  this.x = x;
  this.y = y
}

Ponint.prototype.toString = function(){
  return '('+this.x+','+this.y+')'
}
```

### constructor 方法

constructor 方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。 

一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加，constructor方法默认返回实例对象（即this）

### 类的实例

1. 通过 new 命令生成实例，而且类必须使用 new 调用生成实例，否则会报错。
```
class Point {
  // ...
}

// 报错
var point = Point(2, 3);

// 正确
var point = new Point(2, 3);
```

2. 实例的属性除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上（即定义在class上）。

```
//定义类
class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }

}

var point = new Point(2, 3);

point.toString() // (2, 3)

point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true
```

3. 类的所有实例共享一个原型对象。

```
var p1 = new Point(2,3);
var p2 = new Point(3,2);

p1.__proto__ === p2.__proto__
//true
```

### 静态方法

如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

```
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
// TypeError: foo.classMethod is not a function
```

注意，如果静态方法包含this关键字，这个this指的是类，而不是实例。

父类的静态方法，可以被子类继承。

### 静态属性

静态属性指的是 Class 本身的属性，即Class.propName，而不是定义在实例对象（this）上的属性。

```
// 老写法
class Foo {
  // ...
}
Foo.prop = 1;

// 新写法
class Foo {
  static prop = 1;
}
```

### 使用注意点

1. 严格模式

类和模块的内部，默认就是严格模式，所以不需要使用use strict指定运行模式。

2. 不存在提升

类不存在变量提升（hoist），这一点与 ES5 完全不同。

```
new Foo(); // ReferenceError
class Foo {}
```

3. this 的指向

类的方法内部如果含有this，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。

```
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
```

4. 类的内部所有定义的方法，都是不可枚举的

```
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```