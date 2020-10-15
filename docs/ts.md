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

## Interface

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


## 类

### 基本简单类

```javascript
class Animal {
  name: string;
  constructor(theName: string) { this.name = theName; }
  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`)
  }
}

let a = new Animal("Tom")
```
上述代声明了一个Animal类。该类有3个成员：一个是name属性，一个是构造函数和一个move方法。

访问类的成员时需要使用this.

我们使用 new构造了 Animal类的一个实例。 它会调用之前定义的构造函数，创建一个 Animal类型的新对象，并执行构造函数初始化它。

### 类的继承

基于类的程序设计中一种最基本的模式是允许使用继承来扩展现有的类。

一个基本的继承例子：
```javascript
class Animal {
  move(distanceInMeters: number = 0){
    console.log(`Animal moved ${distanceInMeters}m.`);
  }
}

class Dog extends Animal {
  bark(){
    console.log('Woof!')
  }
}

const dog = new Dog();
dog.bark();
dog.move(10);
```
Dog是一个 派生类，它派生自 Animal 基类，通过 extends关键字。 派生类通常被称作 子类，基类通常被称作 超类。

一个复杂的例子：
```javascript
class Animal {
  name: string;
  constructor(theName: string) { this.name = theName }
  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`)
  }
}

class Snake extends Animal {
  constructor(name: string) { super(name) }
  move(distanceInMeters = 5) {
    console.log("Slithering...");
    super.move(distanceInMeters);
  }
}

class Horse extends Animal {
  constructor(name: string) { super(name); }
  move(distanceInMeters = 45 ){
    console.log("Galloping...")
    super.move(distanceInMeters);
  }
}

let sam = new Sanke("Sammy the Python")
let tom: Animal = new Horse("Tommy the Palomino")

sam.move();
tom.move(34);
```

这一次，我们使用 extends关键字创建了 Animal的两个子类： Horse和 Snake。

与前一个例子的不同点是，派生类包含了一个构造函数，它 必须调用 super()，它会执行基类的构造函数。 而且，在构造函数里访问 this的属性之前，我们 一定要调用 super()。 这个是TypeScript强制执行的一条重要规则。

### 公共，私有与受保护的修饰符

#### public

在TypeScript里，成员都默认为 public。

重写上述Animal类:
```typescript
class Animal {
  public name: string;
  public constructor(theName: string) { this.name = theName; }
  public move(distanceInMeters: number) {
   console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}
```

#### private

当成员被标记成privates时，它就不能再声明它的类外部访问。比如：
```typescript
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

new Animal("Cat").name; // 错误: 'name' 是私有的.
```

TypeScript使用的是结构性类型系统。 当我们比较两种不同的类型时，并不在乎它们从何处而来，如果所有成员的类型都是兼容的，我们就认为它们的类型是兼容的。然而，当我们比较带有 private或 protected成员的类型的时候，情况就不同了。

如果其中一个类型里包含一个 private成员，那么只有当另外一个类型中也存在这样一个 private成员， 并且它们都是来自同一处声明时，我们才认为这两个类型是兼容的。 对于 protected成员也使用这个规则。


下面来看一个例子，更好地说明了这一点：
```typescript
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

class Rhino extends Animal {
    constructor() { super("Rhino"); }
}

class Employee {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
animal = employee; // 错误: Animal 与 Employee 不兼容.
```
因为 Animal和 Rhino共享了来自 Animal里的私有成员定义 private name: string，因此它们是兼容的。 然而 Employee却不是这样. 尽管 Employee里也有一个私有成员 name，但它明显不是 Animal里面定义的那个。

#### protected

protected修饰符与 private修饰符的行为很相似，但有一点不同， protected成员在派生类中仍然可以访问。例如：
```typescript
class Person {
    protected name: string;
    constructor(name: string) { this.name = name; }
}

class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name)
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch());
console.log(howard.name); // 错误
```


### readonly修饰符

你可以使用 readonly关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化。

```typescript
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // 错误! name 是只读的.
```

### 参数属性

在上面的例子中，我们必须在Octopus类里定义一个只读成员 name和一个参数为 theName的构造函数，并且立刻将 theName的值赋给 name，这种情况经常会遇到。 参数属性可以方便地让我们在一个地方定义并初始化一个成员。 下面的例子是对之前 Octopus类的修改版，使用了参数属性：
```typescript
class Octopus {
    readonly numberOfLegs: number = 8;
    constructor(readonly name: string) {
    }
}
```

注意看我们是如何舍弃了 theName，仅在构造函数里使用 readonly name: string参数来创建和初始化 name成员。 我们把声明和赋值合并至一处。

参数属性通过给构造函数参数前面添加一个访问限定符来声明。 使用 private限定一个参数属性会声明并初始化一个私有成员；对于 public和 protected来说也是一样。

## 泛型

软件工程中，我们不仅要创建一致的定义良好的API，同时也要考虑可重用性。 组件不仅能够支持当前的数据类型，同时也能支持未来的数据类型。这就需要使用到泛型。

下面来创建第一个使用泛型的例子：identity函数。 这个函数会返回任何传入它的值。

不用泛型实现的话：
```typescript
function identity(arg: any): any {
  return arg;
}
```
使用any类型会导致这个函数可以接收任何类型的arg参数，这样就丢失了一些信息：传入的类型与返回的类型应该是相同的。如果我们传入一个数字，我们只知道任何类型的值都有可能被返回。

因此可以使用`类型变量`，一种特殊的变量，只用于表示类型而不是值。来解决这个问题。

```typescript
function identity<T>(arg: T): T {
  return arg
}
```

我们给identity添加了类型变量T。 T帮助我们捕获用户传入的类型（比如：number），之后我们就可以使用这个类型。 之后我们再次使用了 T当做返回值类型。现在我们可以知道参数类型与返回值类型是相同的了。 这允许我们跟踪函数里使用的类型的信息。

我们把这个版本的identity函数叫做泛型，因为它可以适用于多个类型。 不同于使用 any，它不会丢失信息，保持准确性，传入数值类型并返回数值类型。

我们定义了泛型函数后，可以用两种方法使用。 

第一种是，传入所有的参数，包含类型参数：

`let output = identity<string>("myString");// type of output will be string`

第二种方法更普遍。利用了类型推论 -- 即编译器会根据传入的参数自动地帮助我们确定T的类型：

`let output = identity("myString") // type of output will be 'string'`


### 泛型变量

使用泛型创建像identity这样的泛型函数时，编译器要求你在函数体必须正确的使用这个通用的类型。 换句话说，你必须把这些参数当做是任意或所有类型。

看下面这个例子，比如你想打印出参数的长度：
```typescript
function identity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```
如果这么做，编译器会报错说我们使用了arg的length属性，但是没有地方指明arg具有这个属性。 记住，这些类型变量代表的是任意类型，所以使用这个函数的人可能传入的是个数字，而数字是没有length属性的。


现在假设我们想操作T类型的数组而不直接是T。由于我们操作的是数组，所以.length属性是应该存在的。 我们可以像创建其它数组一样创建这个数组：

```typescript
function identity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
//或者

function identity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

该函数可以理解为接收类型参数T和参数arg，arg是个元素类型是T的数组，并返回元素类型是T的数组。

### 泛型类型

泛型函数的类型与非泛型函数的类型没有什么不同，只是有一个类型参数在最前面，像函数声明一样：
```typescript
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: <T>(arg: T) => T = identity;
```

我们也可以使用不同的泛型参数名，只要在数量上和使用方式上能对应上就可以。

```typescript
unction identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <U>(arg: U) => U = identity;
```

还可以写泛型接口
```typescript
interface GenericIdentityFn {
    <T>(arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn = identity;

```
一个相似的例子，我们可能想把泛型参数当作整个接口的一个参数。 这样我们就能清楚的知道使用的具体是哪个泛型类型（比如： `Dictionary<string>`而不只是Dictionary）。 这样接口里的其它成员也能知道这个参数的类型了。

```typescript
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```
注意，我们的示例做了少许改动。 不再描述泛型函数，而是把非泛型函数签名作为泛型类型一部分。 当我们使用 GenericIdentityFn的时候，还得传入一个类型参数来指定泛型类型（这里是：number），锁定了之后代码里使用的类型。 

### 泛型类

泛型类看上去与泛型接口差不多。泛型类使用(<>)括起泛型类型，跟在类名后面。
```typescript
class GenericNumber<T> {
  value: T;
  add: (x: T, y: T) => T;
}


// 使用

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.value = 0;
myGenericNumber.add = function(x,y){ return x + y}
```
GenericNumber类的使用是十分直观的，并且你可能已经注意到了，没有什么去限制它只能使用number类型。 也可以使用字符串或其它更复杂的类型。

## 枚举

使用枚举可以定义一些带名字的常量。Typescript支持数字的和基于字符串的枚举。

### 数字枚举

```typescript
enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}
```

上诉例子定义了一个数字枚举，Up初始化为1.其余的成员会从1开始自动增长。简单的理解就是。Up的值是1，Down是2，Left是3，Right是4。如果不对Up进行初始化，那么它的值就是0.

使用枚举很简单：通过枚举的属性来访问枚举成员，和枚举的名字来访问枚举类型：

```typescript
enum Response {
    No = 0,
    Yes = 1,
}

function respond(recipient: string, message: Response): void {
    // ...
}

respond("Princess Caroline", Response.Yes)
```

### 字符串枚举

字符串枚举里，每个成员都必须用字符串字面量，或另外一个字符串枚举成员进行初始化。

```typescript
enum Direction {
  Up = "UP",
  Down = "Down",
  Left = "Left",
  Right = "Right"
}
```

由于字符串枚举没有自增长的行为，字符串枚举可以很好的序列化。

### 异构枚举

从技术的角度来说，枚举可以混合字符串和数字成员，但是似乎你并不会这么做,除非你真的想要利用JavaScript运行时的行为，否则我们不建议这样做。

```typescript
enum BooleanLikeHeterogeneousEnum {
    No = 0,
    Yes = "YES",
}
```

### 计算的和常量成员

每个枚举成员都带有一个值，它可以是`常量`或`计算出来`的。当满足如下条件时，枚举成员被当作是常量：

* 它是枚举的第一个成员且没有初始化，这种情况下它被赋值0
* 它不带有初始化器且它之前的枚举成员是一个`数字常量`。这种情况下，当前枚举成员的值为它上一个枚举成员的值加1。
* 枚举成员使用`常量枚举表达式`初始化。常数枚举表达式是Typescript表达式的子集，它可以在编译阶段求值。当一个表达式满足下面条件之一时，它就是一个常量枚举表达式：
    * 一个枚举表达式字面量（主要是字符串字面量或数字字面量）
    * 一个对之前定义的常量枚举成员的引用（可以是在不同的枚举类型中定义的）
    * 带括号的常量枚举表达式
    * 一元运算符 +, -, ~其中之一应用在了常量枚举表达式
    * 常量枚举表达式做为二元运算符 +, -, *, /, %, <<, >>, >>>, &, |, ^的操作对象。 若常数枚举表达式求值后为 NaN或 Infinity，则会在编译阶段报错。

所有其它情况的枚举成员被当作是需要计算得出的值。

### 反向映射

除了创建一个以属性名做为对象成员的对象之外，数字枚举成员还具有了 反向映射，从枚举值到枚举名字。 例如，在下面的例子中：
```typescript
enum Enum {
    A
}
let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```


## 类型推论

TypeScript里，在有些没有明确指出类型的地方，类型推论会帮助提供类型。如下面的例子

`let x = 3;`

变量x的类型被推断为数字。 这种推断发生在初始化变量和成员，设置默认参数值和决定函数返回值时。

### 最佳通用类型

当需要从几个表达式中推断类型时候，会使用这些表达式的类型来推断出一个最合适的通用类型。例如，

`let x = [0, 1, null];`

为了推断x的类型，我们必须考虑所有元素的类型。 这里有两种选择： number和null。 计算通用类型算法会考虑所有的候选类型，并给出一个兼容所有候选类型的类型。

由于最终的通用类型取自候选类型，有些时候候选类型共享相同的通用类型，但是却没有一个类型能做为所有候选类型的类型。例如：

`let zoo = [new Rhino(), new Elephant(), new Snake()];`

这里，我们想让zoo被推断为Animal[]类型，但是这个数组里没有对象是Animal类型的，因此不能推断出这个结果。 为了更正，当候选类型不能使用的时候我们需要明确的指出类型：

`let zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()];`

如果没有找到最佳通用类型的话，类型推断的结果为联合数组类型，(Rhino | Elephant | Snake)[]。

### 上下文类型

TypeScript类型推论也可能按照相反的方向进行。 这被叫做“按上下文归类”。按上下文归类会发生在表达式的类型与所处的位置相关时。比如：

```typescript
window.onmousedown = function(mouseEvent) {
    console.log(mouseEvent.button);  //<- Error
};
```
这个例子会得到一个类型错误，TypeScript类型检查器使用Window.onmousedown函数的类型来推断右边函数表达式的类型。 因此，就能推断出 mouseEvent参数的类型了。

如果函数表达式不是在上下文类型的位置， mouseEvent参数的类型需要指定为any，这样也不会报错了。


如果上下文类型表达式包含了明确的类型信息，上下文的类型被忽略。 重写上面的例子：

```typescript
window.onmousedown = function(mouseEvent: any) {
    console.log(mouseEvent.button);  //<- Now, no error is given
};
```

这个函数表达式有明确的参数类型注解，上下文类型被忽略。 这样的话就不报错了，因为这里不会使用到上下文类型。