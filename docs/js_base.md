# JS 基础

## 基本数据类型

### 类型数量

到目前为止 JS 具有8种数据类型。

Number、String、Boolean、Null、Undefined、Object、Symbol、BigInt

1. Number

Number 类型包含整数和浮点数两种值。
NaN 非数字类型 1.涉及到任何关于NaN的操作都会返回NaN 2.NaN 不等于自身

2. String 

字符串是存储字符的变量，由双引号或者单引号表示，具有length属性。可使用String()或者toString()方法转换为String类型

3. Boolean

具有 true 和 false 2个值 true 为 1 ; false 为 0 

4. Undefined

undefined表示系统级的、出乎意料的或类似错误的值的空缺；表示缺少值，此处应该有值，但没有定义

5. Null 

null表示程序级的、正常的或在意料之中的值的空缺

6. Object

ECMAjavascript中的对象其实就是一组数据和功能的集合。对象可以通过执行new操作符后跟要创建的对象类型的名称来创建。创建object类型的实例并为其添加属性（或）方法，就可以自定义创建对象。

        如：var o = new Object( );

        object 的每个实例都有下列属性和方法：

        constructor：保存着用于创建当前对象的函数。（构造函数)constructor就是object();

        hasOwnProperty(propertyName):用于检查给定的当前属性在当前对象实例中）而不是在实例原型中）是否存在。

        isPrototypeOf(object):用于检查传入的对象是否是传入对象原型。

        propertyIsEnumerable(propertyName):用于检查给定属性是否能够用for-in语句。

        toLocaleString( ):返回对象的字符串表示，该字符串与执行环境的地区对应。

        toString( ):返回对象的字符串表示。

        valueOf( ):返回对象的字符串、数值或者布尔值表示。通常与toString( )方法的返回值得相同。

        ECMAJS中object是所有对象的基础，因些所有对象都具有这些基本的属性和方法。


7. Symbol

Symbol 类型的对象永远不相等，即便创建的时候传入相同的值。因此，可以用解决属性名冲突的问题（适用于多少编码），做为标记。ES6 新增的

8. BigInt

BigInt 提供了一种方法来表示大于  2^53 - 1 的整数。这原本是 Javascript中可以用 Number 表示的最大数字。BigInt 可以表示任意大的整数。

可以用在一个整数字面量后面加 n 的方式定义一个 BigInt ，如：10n，或者调用函数BigInt()。


## 数据类型判断

JS 数据类型的判断主要有以下几种方法：typeof、instanceof 、Objeact.prototype.toString.call()、constructor

### typeof 

返回一个表示数据类型的字符串，返回结果包含：number、boolean、string、symbol、object、undefined、function、bigint等 缺点不能判断null和array

```
typeof ''                 // string    有效
typeof 1                  // number    有效
typeof NaN                // number    有效
typeof true               // boolean   有效
typeof undefined          // undefined 有效
typeof new Function()     // function  有效
typeof 11n                // bigint    有效
typeof null               // object    无效
typeof []                 // object    无效
typeof new Date()         // object    无效
typeof new RegExp()       // object    无效
```

### instanceof

instanceof 是用来判断 A 是否为 B 的实例，表达式为 A instanceof B；如果 A 是 B 的实例，则返回 true，否则返回 false。

```
[] instanceof  Array            // true
{} instanceof  Objeact          // true
new Date() instanceof Date      // true

[] instanceof  Objeact          // true
null instanceof Null            // 报错
null instanceof Objeact         // false 
```

会发现 [] 既是 Array的实例，又是Object的实例。因为 instanceOf 检测的是原型。[] 的 __proto__ 直接指向 Array.prototype, Array的 __proto__ 指向 Object.prototype. 所以 [] 间接指向了 Object.prototype. 所以 instanceof 只能用来判断两个对象是否属于实例关系，而不能判断一个对象实例具体属于哪种类型。

#### instanceof 的实现原理

原理是在实例的 原型对象链 中找到该构造函数的prototype属性所指向的 原型对象，就返回true。

##### 简易实现

```
function newInstanceof(l,r){
  var o = r.prototype;
  l = l.__proto__;
  while(true){
    if(l=== null){
      return false
    }
    if(o===l){
      return true
    }
    l = l.__proto__
  }
}
```
### Object.prototype.toString.call()

这是最准确的类型判断方法

toString() 是 Object 的原型方法，调用该方法，默认返回当前对象的 [[Class]] 。这是一个内部属性，其格式为 [object Xxx] ，其中 Xxx 就是对象的类型。

对于 Object 对象，直接调用 toString() 就能返回 [object Object] 。而对于其他对象，则需要通过 call / apply 来调用才能返回正确的类型信息。

```
Object.prototype.toString.call('') ;               // [object String]
Object.prototype.toString.call(1) ;                // [object Number]
Object.prototype.toString.call(true) ;             // [object Boolean]
Object.prototype.toString.call(Symbol());          // [object Symbol]
Object.prototype.toString.call(undefined) ;        // [object Undefined]
Object.prototype.toString.call(null) ;             // [object Null]
Object.prototype.toString.call(new Function()) ;   // [object Function]
Object.prototype.toString.call(new Date()) ;       // [object Date]
Object.prototype.toString.call([]) ;               // [object Array]
Object.prototype.toString.call(new RegExp()) ;     // [object RegExp]
Object.prototype.toString.call(new Error()) ;      // [object Error]
Object.prototype.toString.call(document) ;         // [object HTMLDocument]
Object.prototype.toString.call(window) ;           // [object global] window 是全局对象 global 的引用
```

#### constructor 属性
constructor 属性返回所有 JavaScript 变量的构造函数。
```
"John".constructor                 // 返回函数 String()  { [native code] }
(3.14).constructor                 // 返回函数 Number()  { [native code] }
false.constructor                  // 返回函数 Boolean() { [native code] }
[1,2,3,4].constructor              // 返回函数 Array()   { [native code] }
{name:'John', age:34}.constructor  // 返回函数 Object()  { [native code] }
new Date().constructor             // 返回函数 Date()    { [native code] }
function () {}.constructor         // 返回函数 Function(){ [native code] }
```

例子： [].constructor.toString().indexOf("Array") > -1

## 操作符

### 一元操作符

只能操作一个值的操作符叫做一元操作符

#### 递增 (++) 和 递减 （--）操作符

具有前置型和后置型

**前置型**

`++num、--num`

执行前置递增和递减操作时，变量的值都是在语句被求值以前改变的

**后置型**

`num++、num--`

执行后置递增和递减操作是在包含它们的语句被求 值之后才执行的

区别示例
```
var num1  = 2;
var num2  = 20;
var _num1 = 2;
var num3  = --num1   + num2   // 21
var num4  = num1     + num2   // 21
var num5  = _num1--  + num2   // 22
var num6  = _num1    + num2   // 21
```

#### 一元加(+)和减（-）操作符

一元加操作符以一个加号 `+` 表示，放在数值前面，对数值不会产生任何影响。但是对于非数值应用一元操作符，该操作符会像Number()转型函数一样，对这个值执行转换

示例
```
var s1 = "01" 
var s2 = "1.1"
var s3 = "z"
var b = false'
var f = 1.1;
var o = {
  valueOf:function(){
    return -1
  }
}

+s1 // 1
+s2 // 1.1
+s3 // NaN
+b  // 0
+f  // 1.1
+0  // -1
```

一元减操作符主要用于表示负数，当应用于数值时，数值变为负数；当应用于非数值时，与一元加具有相同的规则，最后将得到的数值变为负数。


### 位操作符

位操作符用于在最基本的层次上，即按内存中表示数值的位来操作数值。ECMAScript 中的所有数值都以IEEE-754 64位格式存储，但是位操作符不直接操作64位的值，而是先将64位转换为32位，执行操作，然后在转换为64位

**二进制码、反码、补码** 

二进制码 就是每一位表示2的幂。例如 18 二级制表示 10010 

负数用二进制补码表示。

反码：将二进制每一位 0 替换为 1， 1 替换为 0

补码：反码加1

**位操作符包含**
1. 按位非（~）返回数值的反码
2. 按位与（&）
3. 按位或 (|)
4. 按位异或（^）
5. 左移（<<）
6. 有符号右移（>>）
7. 无符号右移（>>>）

### 布尔操作符

布尔操作符公有3个：非、与、或

#### 逻辑非

逻辑非操作符由一个`!`表示，可以应用于任何值，返回一个布尔值。先将操作数转换为布尔值，然后求反
* 操作数是对象，返回 false 
* 操作数是空字符串，返回ture
* 操作数是非空字符串，返回ture
* 操作数是数值0，返回ture
* 操作数是null，返回true
* 操作数是NaN，返回true
* 操作数是undefined，返回true

#### 逻辑与

逻辑与操作符由`&&`表示，可以应用于任何类型的操作数，但是不一定返回布尔值。

在一个操作数不是布尔的情况下，遵循如下规则：
* 如果第一个操作数是对象，则返回第二个操作数
* 如果第二个操作数是对象，则在第一个操作数结果为true的情况下返回
* 如果两个操作数都是对象，返回第二个
* 如果有一个操作数为null，返回null
* 如果有一个操作数为NaN，返回NaN
* 如果有一个操作数为undefined，返回undefined

逻辑与操作属于短路操作，如果第一个操作数能够决定结果，则不会对第二个操作数**求值**。这一点很重要。示例说明

```
var a = true;
var res = (a || b)
console.log(res) // 报错

如果 var a = false,则会输出false ，因为进行了求值操作

```

#### 逻辑或

逻辑或操作符由`||`表示，与逻辑与相似，也不一定返回布尔值。遵循如下规则：
* 如果第一个操作数是对象，则返回第一个操作数
* 如果第一个个操作数的求值结果为false，返回第二个
* 如果两个操作数都是对象，返回第一个个
* 如果有一个操作数为null，返回null
* 如果有一个操作数为NaN，返回NaN
* 如果有一个操作数为undefined，返回undefined

逻辑或操作也属于短路操作，如果第一个操作数能够决定结果，则不会对第二个操作数**求值**。


### 加性操作符

具有加法（+） 和 减法（-）2个操作符

#### 加法（+）

遵循如下规则：
* 两个都是数值，常规计算
* 有一个为NaN,然后NaN
* 两个都是字符串时，则进行拼接
* 其中一个为字符串，则将另一个转换为字符串，进行拼接
* 有一个为对象、数组、布尔值，则调用它们的toSting()方法取相应字符串值，然后应用上述关于字符串的规则。
* 对应null和undefined，则调用String()取得"undefined"和"null"

只要`+`号两边有一边是字符串 作为字符串连接理解，反之作为算术运算符理解。

```
1. console.log(1 + "true")        // 1true
2. console.log(1 + true )         // 2
3. console.log(1 + undefined )    // NaN
4. console.log(1 + null )         // 1

问题对应转换理解
1. String(1) + 'true' = '1true'
2. 1 + Number(true) = 1 + 1 = 2
3. 1 + Number(undefined) = 1 + NaN = NaN
4. 1 + Number(null) = 1 + 0 = 1
```


#### 关系运算符

小于（<）、大于（>）、小于等于（>=）、大于等于（>=）等关系操作符对两个值进行比较，返回一个布尔值。

当关系操作符的操作数为非数值时，也需要进行数据转换。遵循如下相应规则：
* 两个都为数值时，进行数值比较
* 两个都为字符串时，比较两个字符串对应的字符编码值
* 一个为数值时，则将另一个转换为数值进行数值比较
* 如果一个为布尔值时，则转换为数值,进行比较
* 如果一个是对象，则调用这个对象的valueOf(),用得到的结果按照前面的规则执行比较，如果没有valueOf方法，则调用toString().

```
1. console.log('2' > 10)              // false
2. console.log('2' > '10')            // true
3. console.log('abc' > 'b')           // false
4. console.log('abc' > 'aad')         // false

// 解析
1. console.log('2' > 10) -> Number('2') > 10 
2. console.log('2' > '10')  -> '2'.charCodeAt() > '10'.charCodeAt() = 59 > 49
3. console.log('abc' > 'b') -> 'abc'.charCodeAt() > 'b'.charCodeAt() = 97 > 98
4. console.log('abc' > 'aad')  先是比较'a'和 'a' 比较 然后是第二个字符  // 将2个数都是多位字符串时从左往右依次对位比较
```

#### 相等操作符

具有 相等和不相等、全等和不全等；相等和不相等先转换再比较，全等和不全等仅比较不转换

##### 相等和不相等

相等（==） 和 不相等（!=）两个操作符都会先转换操作数(强制转换),然后再比较他们的相等性。

在转换不同的数据类型时，遵循如下规则

* 如果有一个为布尔值，先转换为数值，再比较
* 如果有一个为字符串，另一个为数值，则将字符串转数值比较
* 如果一个操作数是对象，另一个不是，则调用对象的valueOf(),得到基本类型值再按照前面的规则比较
* null 和 undefined 相等
* 要比较相等性之前，不能讲null和undefined转换成其他任何值
* NaN == NaN // false ;NaN != NaN // true
* 如果两个操作数都是对象，则比较它们是不是同一个对象，指向同一个对象返回true

```
null == undefined  // true
5    == NaN        // flase
true == 1          // true
true == 2          // false
0    == undefined  // false
0    == null       // false
'5'  == 5          // true
```
##### 全等和不全等

使用全等符号时，不会自动转换数据类型，所有该符号也对数据类型进行了比较。

```
null === undefined      // false
null === null           // true
undefined === undefined // true
```

## 类型转换之隐式转换

### 定义

在js中，当运算符在运算时，如果两边数据不统一，cpu就无法计算，这时编辑器会自动将运算符两边的数据进行类型转换，转换成一样的类型进行计算。
这种编辑器自动转换的操作被称为隐式转换。

### 触发条件

* 转成String 类型  `+` (字符串连接符)
* 转成Number 类型  `++/--`(自增自减运算符) `+ - * / %` (算法运算符) `> < >= <= == != `(关系运算符)
* 转成Boolean 类型 `!`（逻辑非运算符）

### 问题解析

#### 字符串连接符与算术运算符

```
1. console.log(1 + "true")        // 1true
2. console.log(1 + true )         // 2
3. console.log(1 + undefined )    // NaN
4. console.log(1 + null )         // 1
```
**解析**

只要`+`号两边有一边是字符串 作为字符串连接理解，反之作为算术运算符理解。
1. 作为字符串连接符时，会将其他数据类型调用String()方法转为字符串然后拼接
2. 作为算法运算符时，会将其他数据调用Number()方法转为数字然后加法运算

问题对应转换理解
```
1. String(1) + 'true' = '1true'
2. 1 + Number(true) = 1 + 1 = 2
3. 1 + Number(undefined) = 1 + NaN = NaN
4. 1 + Number(null) = 1 + 0 = 1
```

#### 关系运算符

```
1. console.log('2' > 10)              // false
2. console.log('2' == 2)              // false
3. console.log('2' > '10')            // true
4. console.log('abc' > 'b')           // false
5. console.log('abc' > 'aad')         // false
6. console.log(undefined == null)     // false
7. console.log(NaN == NaN)            // false
```

**解析**

1. 当关系运算符两边有一边是字符串时，会将其他数据类型使用Number()转换后比较。
```
1. console.log('2' > 10) -> Number('2') > 10 
2. console.log('2' == 2) -> Number('2') == 2
```

2. 当关系运算符两边都是字符串的时候，此时同时转成Number然后比较关系，但此时不用Number()方法来转换，而是按照字符串的unicode编码来转换为数字

charCodeAt 方法可以查看字符的unicode编码

```
1. console.log('2' > '10')  -> '2'.charCodeAt() > '10'.charCodeAt() = 59 > 49
2. console.log('abc' > 'b') -> 'abc'.charCodeAt() > 'b'.charCodeAt() = 97 > 98
// 将2个数都是多位字符串时从左往右依次对位比较
3. console.log('abc' > 'aad')  先是比较'a'和 'a' 比较 然后是第二个字符 
```

3. 特殊情况 如果数据类型是 Undefined 和 Null 得出固定结果；NaN与任何数据类型比较都是NaN 

```
1. console.log(undefined == null)                 // true
2. console.log(undefined == undefined)            // true
3. console.log(nul == null)                       // true
4. console.log(NaN == NaN)                        // false
```

#### 复杂数据类型隐式转换

复杂数据类型在隐式转换时会先使用valueOf()方法获取原始值如果原始值不是Number类型，则使用toString()转成String，然后再将String转成Number运算

例如：
```
console.log([1,2]=='1,2');

[1,2].valueOf() -> [1,2] -> [1,2].toString() -> '1,2'

var a = {}
console.log(a == "[object Object]")

a.valueOf() -> {} -> a.valueOf().toString() -> "[object Object]"
```

**经典试题**

如何完善a，使得能正确输出
```
var a = ? 
if(a == 1 && a == 2 && a == 3){
  console.log(1)
}
```
分析题目得出要有输出结果 那么需要满足a等于1且等于2且等于3，在数学逻辑上一个简单类型的常量是不能实现的，那么转变思维，那是一个复杂数据类型呢。当a是一个对象时是不是可以满足。这就满足了上面讲述的复杂数据类型隐式转换.

```
var a = {
  i:0,
  valueOf:()=>{
    return ++a.i
  }
}
```

我们重写valueOf 方法 便可以满足条件成功输出，因为每一次 比较 '==' 时 都会调用一次valueOf 方法


#### 逻辑非隐式转换 与 关系运算符结合

```
[].toString() -> ''
{}.toSrring() -> '[object Object]'
```
注意：空数组的toString()得到的是空字符串，空对象得到的是'[object,Object]'

**例题**

```
1. console.log([]  == 0)              //true
2. console.log(![] == 0)              //true
3. console.log([]  == ![])            //true
4. console.log([]  == [])             //false
5. console.log({}  == !{})            //false
6. console.log({}  == {})             //false
```
1. 关系运算符：将其他数据类型转换成数字
2. 逻辑非：将其他数据类型使用Boolean()转换成布尔类型

以下情况转换为布尔值为false,反则为true
* 0 或 -0
* NaN
* undefined
* null
* 空字符串

**问题分析**

问题1：该问题是复杂数据类型和关系运算符的结合，[].valueOf().toString()得到空字符串，空字符串使用Number()转换得到的是0 所以输出true

问题2：逻辑非优先级高于关系运算符，所以问题变为![] 和 0 比较，[]转换为布尔值为ture，取非为false，0为false 所以输出ture

问题3：问题本质是[] 与 ![] 但是不是转换为布尔值比较而是转变为数字比较 []转为数字 [].valueOf().toString() -> '' -> Number('') -> 0,![]转化为数字 ![] -> false -> 0 所以输出为true

问题4：[]为引用类型,数据存在堆中,栈中存储的是地址，所以结果是false

问题5：问题本质是{} 与 !{} 也是转换为数字比较不是布尔值比较。{}.valueOf().toString() -> '[object Object]' -> Number('[object Object]') -> NaN, !{} -> false -> 0 所以结果是 false

问题6：该问题同问题4 都是引用类型数据的比较问题。


## 基本类型和引用类型

基本类型值指的是简单的数据段；引用类型值指那些可能由多个值构成的对象

基本类型：Number、String、Null、Undefined、Boolean
引用类型：object、Fuction、Array、Date等

js的变量的存储方式--栈（stack）和堆（heap）

栈：自动分配内存空间，系统自动释放，里面存放的是基本类型的值和引用类型的地址

堆：动态分配的内存，大小不定，也不会自动释放。里面存放引用类型的值。

基本类型的比较是值比较；引用类型的比较是引用的比较。

### 动态属性 

对于引用类型的值，可以添加属性和方法，也可以改变和删除其属性和方法,基本类型不行。

```
var o = new Objeact()
o.name = 'name'
console.log(0.name) // 'name'

var name = 'name'
name.age = 1
console.log(name.age) // undefined
```
### 复制变量值

基本类型复制的是值，引用类型复制的是地址。

```
var num1 = 5
var num2 = num1;

num1 = 6 

console.log(num1) // 6
console.log(num2) // 5

var obj1 = new Object()
var obj2 = obj1;
obj1.name = 'name'

console.log(obj2.name)  // name

obj1、obj2 指向的是同一片内存
```

### 传递参数

函数的参数都是按值传递的。

```
1.
function addTen(num){
  return num += 10;
}

var count = 20;
var res = addTen(count)

console.log(count) // 20
console.log(res) // 30

2.
function setName(obj){
  obj.name = 'ye'
}

var person = new Object()
setName(person)
console.log(person.name) // ye

3.
function setName(obj){
  obj.name = 'ye'
  obj = new Object()
  obj.name = 'a'
}

var person = new Object()
setName(person)
console.log(person.name) // ye
```

示例3与示例2的比较在于重新定义了一个对象，如果是按传地址的方式话  name 会被修改的



## 原型和原型链

### 原型

每个构造函数(constructor)都有一个原型对象(prototype),原型对象都包含一个指向构造函数的指针,而实例(instance)都包含一个指向原型对象的内部指针(`__proto__`).

每个对象都有__proto__ 属性，指向创建该对象的构造函数的原型。大多数情况下 `__proto__` 可以理解为 构造器的原型，即：`__proto__ === constructor.prototype`

Object.__proto__ === Function.prototype;

Function.prototype.__proto__ === Object.prototype;

Object.prototype.__proto__ === null;

Function.__proto__ === Function.prototype;
