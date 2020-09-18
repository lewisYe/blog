# TypeScript

## TS 与 JS 对比

|                   **TypeScript**              |                **Javascript**            |
| :--------------------------------------------:| :--------------------------------------: |
| JavaScript 的超集用于解决大型项目的代码复杂性       |      一种脚本语言，用于创建动态网页           |
|            在编译期间发现并纠正错误               | 解释型语言，只能在运行时发现错误               |
|           强类型，支持静态和动态类型              |         弱类型，没有静态类型选项         |
| 最终被编译成 JavaScript 代码，使浏览器可以理解     |          可以直接在浏览器中使用          |
|              支持模块、泛型和接口                |          不支持模块，泛型或接口          |

## 基础类型

### Boolean

```typescript
let isDone: boolean = false
```

### Number

TypeScript里的所有数字都是浮点数。 这些浮点数的类型是 number。 除了支持十进制和十六进制字面量，TypeScript还支持ECMAScript 2015中引入的二进制和八进制字面量。

```typescript
let decLiteral: number = 6 //十进制
let hexLiteral: number = 0xf00d // 十六进制
let binaryLiteral: number = 0b1010 // 二进制
let octalLiteral: number = 0o744 // 八进制
```

### String

``` typescript
let name: string = 'lewisye'
let sayName: string = `My name is ${name}`
```

### Array

```typescript
let list: number[] = [1, 2, 3]

let list: Array<number> = [1, 2, 3]
```

### Tuple 元组

元组类型允许表示一个**已知元素数量和类型**的数组，各元素的类型不必相同。


```typescript
let x: [string, number] 

x = ['hello', 10] // ok
x = [10, 10] // error
```

当访问一个已知索引的元素，会得到正确的类型：
```typescript
  console.log(x[0].substr(1)); // OK
  console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'  
```

当访问一个越界的元素，会使用联合类型替代：
```typescript
  x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型

  console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString

  x[6] = true; // Error, 布尔不是(string | number)类型
```

### enum 枚举

```typescript
enum Dirction {
  East,
  South,
  West,
  North
}
```

默认情况下 East的初始值是0,依次往后递增，也可以在定义的时候附上初始值，可以是数字，也可以是字符串

数字枚举除了支持 从成员名称到成员值 的普通映射之外，它还支持 从成员值到成员名称 的反向映射


```typescript
enum Dirction {
  East,
  South,
  West,
  North
}

let dirName = Direction[0]; // East
let dirVal = Direction.East; // 0
```

### Any

为一个不清楚类型的变量指定一个类型 可以使用any类型

```typescript
let notSure: any = 4;
notSure = "maybe a string instead"
notSure = true

let list: any[] = [1, true, "free"];
list[1] = 100;
```

### Void

某种程度上来说，void类型像是与any类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是 void：

```typescript
  function warning(): void{
    console.log("This is warning")
  }
```

声明一个void类型的变量没有什么大用，因为你只能为它赋予undefined和null:`let unusabel: void = undefined`

### Null 和 Undefined

TypeScript里，undefined和null两者各自有自己的类型分别叫做undefined和null。 和 void相似，它们的本身的类型用处不是很大：
```typescript
let u: undefined = undefined;
let n: null = null
```

默认情况下null和undefined是所有类型的子类型。 就是说你可以把 null和undefined赋值给number类型的变量。**然而，当你指定了--strictNullChecks标记，null和undefined只能赋值给void和它们各自。**

### Never

never类型表示的是那些永不存在的值的类型。never类型是任何类型的子类型，也可以赋值给任何类型.然而，没有类型是never的子类型或可以赋值给never类型（除了never本身之外）。 即使 any也不可以赋值给never。

```typescript
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}
```

### Object

object表示非原始类型，也就是除number，string，boolean，symbol，null或undefined之外的类型。

使用object类型，就可以更好的表示像Object.create这样的API。例如：
```typescript
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```

### 类型断言

类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用

类型断言有两种形式：
```typescript
let someValue: any = "this is a string"

// 尖括号语法
let strLength: number = (<string>someValue).length

// as语法
let strLength: number = (someValue as string).length
```

两种形式是等价的,然而，当你在TypeScript里使用JSX时，只有 as语法断言是被允许的。

## interface

### 基本调用

```typescript
interface Person {
  name: string;
  age: number
}

let ye: Person = {
  name: 'ye',
  age: 27
}
```

### 可选属性

接口里的属性不全都是必需的。 有些是只在某些条件下存在，或者根本不存在,带有可选属性的接口与普通的接口定义差不多，只是在可选属性名字定义的后面加一个?符号。

```typescript
interface Person {
  name: string;
  age: number;
  height?: number
}

let ye: Person = {
  name: 'ye',
  age: 27
}
```

### 只读属性

一些对象属性只能在对象刚刚创建的时候修改其值。 你可以在属性名前用 readonly来指定只读属性

```typescript
interface Person {
  readonly name: string;
  readonly age: number
}

let ye: Person = { name: 'ye', age: 27 }
ye.name = 'ye1' //error
```

TypeScript具有`ReadonlyArray<T>`类型，它与`Array<T>`相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改：

```typescript
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12 //error
ro.push(5) //error
ro.length = 100 //error
a = ro // error
```
上面代码的最后一行，可以看到就算把整个ReadonlyArray赋值到一个普通数组也是不可以的。 但是你可以用类型断言重写 `a = ro as number[]`

### 额外的属性检查

对于额外属性的检查最简单的是使用类型断言绕过检查，最佳的方式是添加一个字符串索引签名

```typescript
interface Person {
  name: string;
  age: number;
  height?: number;
  [propName: string]: any
}
```

### 函数类型

为了使用接口表示函数类型，我们需要给接口定义一个调用签名。它就像是一个只有参数列表和返回值类型的函数定义。参数列表的每个参数都需要名字和类型。

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean
}

let mySearch: SearchFunc
mySearch = function(source： string, subString: string){
  let result = source.search(subString);
  return result > -1
}
```

对于函数类型的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配.

### 可索引的类型

与使用接口描述函数类型差不多，我们也可以描述那些能够“通过索引得到”的类型，比如`a[10]`或`ageMap["daniel"]`。 可索引类型具有一个 索引签名，它描述了对象索引的类型，还有相应的索引返回值类型。 让我们看一个例子：
```typescript
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

TypeScript支持两种索引签名：字符串和数字。 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。


### 类类型

#### 实现接口

```typescript
interface ClockInterface{
  currentTime: Date;
  setTime(d: Date);
}

class Clock implements ClockInterface {
  currentTime: Date;
  setTime(d: Date) {
    this.currentTime = d
  }
  constructor(h: number, m: number){ }
}
```
#### 类静态部分与实例部分的区别

### 继承接口

和类一样，接口也可以相互继承

```typescript
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square = <Square>{};
square.color = "red";
square.sideLength = 10;
```

### 混合类型

有时你会希望一个对象可以同时具有上面提到的多种类型。

```typescript
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = <Counter>function (start: number) { };
  counter.interval = 123;
  counter.reset = function () {}
  return counter
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

### 接口继承类

当接口继承了一个类类型时，它会继承类的成员但不包括其实现。 就好像接口声明了所有类中存在的成员，但并没有提供具体实现一样。 接口同样会继承到类的private和protected成员。 这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）。

当你有一个庞大的继承结构时这很有用，但要指出的是你的代码只在子类拥有特定属性时起作用。 这个子类除了继承至基类外与基类没有任何关系。 例：
```typesacript
class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() { }
}

class TextBox extends Control {
    select() { }
}

// 错误：“Image”类型缺少“state”属性。
class Image implements SelectableControl {
    select() { }
}

class Location {

}
```


