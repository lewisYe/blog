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