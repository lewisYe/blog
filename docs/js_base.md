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


### 基本类型和引用类型

基本类型：Number、String、Null、Undefined、Boolean
引用类型：object、Fuction、Array、Date等

js的变量的存储方式--栈（stack）和堆（heap）

栈：自动分配内存空间，系统自动释放，里面存放的是基本类型的值和引用类型的地址

堆：动态分配的内存，大小不定，也不会自动释放。里面存放引用类型的值。

基本类型的比较是值比较；引用类型的比较是引用的比较。


### 相等与全等

“==” 相等 使用时会自动转换符号两边的数据类型再进行比较
“===”全等 使用全等符号时，不会自动转换数据类型，所有该符号也对数据类型进行了比较。

```
undefined == false      // false
undefined == null       // false
undefined == 0          // false
undefined == undefined  // true


null == false           // false
null == undefined       // true
null == null            // true
null == 0               // false

null === undefined      // false
null === null           // true
undefined === undefined // true

NaN == NaN              // false


```

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
Object.prototype.toString.call(Symbol());          //[object Symbol]
Object.prototype.toString.call(undefined) ;        // [object Undefined]
Object.prototype.toString.call(null) ;             // [object Null]
Object.prototype.toString.call(new Function()) ;   // [object Function]
Object.prototype.toString.call(new Date()) ;       // [object Date]
Object.prototype.toString.call([]) ;               // [object Array]
Object.prototype.toString.call(new RegExp()) ;     // [object RegExp]
Object.prototype.toString.call(new Error()) ;      // [object Error]
Object.prototype.toString.call(document) ;         // [object HTMLDocument]
Object.prototype.toString.call(window) ;           //[object global] window 是全局对象 global 的引用
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

```
var a = ? 
if(a == 1 && a == 2 && a === 3){
  console.log(1)
}
```
如何完善a，使得能正确输出

复杂数据类型在隐式转换时会先使用valueOf()方法获取原始值如果原始值不是Number类型，则使用toString()转成String，然后再将String转成Number运算
