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

### Tuple

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