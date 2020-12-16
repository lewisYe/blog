# 设计模式

**分类**

设计模式分为三大类：创建型模式、结构型模式、行为型模式。

创建型模式：工厂模式、抽象工厂模式、单例模式、建造者模式、原型模式

结构型模式：适配器模式、桥接模式、过滤器模式、组合模式、装饰器模式、外观模式、享元模式、代理模式

行为型模式：责任链模式、命令模式、解释器模式、迭代器模式、中介者模式、备忘录模式、观察者模式、状态模式、空对象模式、策略模式、模板模式、访问者模式

**设计模式的六大原则**

1. 开闭原则

开闭原则的意思是：**对扩展开发，对修改关闭**。在程序需要进行拓展的时候，不能去修改原有的代码，实现一个热插拔的效果。简言之，是为了使程序的扩展性好，易于维护和升级。想要达到这样的效果，我们需要使用接口和抽象类，后面的具体设计中我们会提到这点。

2. 里氏代换原则（LSP）

里氏代换原则是面向对象设计的基本原则之一。 里氏代换原则中说，任何基类可以出现的地方，子类一定可以出现。LSP 是继承复用的基石，只有当派生类可以替换掉基类，且软件单位的功能不受到影响时，基类才能真正被复用，而派生类也能够在基类的基础上增加新的行为。里氏代换原则是对开闭原则的补充。实现开闭原则的关键步骤就是抽象化，而基类与子类的继承关系就是抽象化的具体实现，所以里氏代换原则是对实现抽象化的具体步骤的规范。

3. 依赖倒转原则

这个原则是开闭原则的基础，具体内容：针对接口编程，依赖于抽象而不依赖于具体。

4. 接口隔离原则

这个原则的意思是：使用多个隔离的接口，比使用单个接口要好。它还有另外一个意思是：降低类之间的耦合度。由此可见，其实设计模式就是从大型软件架构出发、便于升级和维护的软件设计思想，它强调降低依赖，降低耦合。

5. 迪米特法则，又称最少知道原则

最少知道原则是指：一个实体应当尽量少地与其他实体之间发生相互作用，使得系统功能模块相对独立。

6. 合成复用原则

合成复用原则是指：尽量使用合成/聚合的方式，而不是使用继承。


## 工厂模式

工厂模式根据抽象程度可分为三种，分别为简单工厂(静态工厂方法)、工厂方法、抽象工厂。其核心在于将创建对象的过程封装其他，然后通过同一个接口创建新的对象。

### 简单工厂模式

简单工厂模式又叫静态工厂方法，用来创建某一种产品对象的实例，用来创建单一对象。

```javascript
class Factory{
  constructor(name,pwd,role){
    this.name = name;
    this.pwd = pwd;
    this.role = role;
  }
}

class CreateRoleFactory {
  static create (name, pwd, role){
    return new Factory(name, pwd, role)
  }
}

const user = CreateRoleFactory.create('ye','123456','admin')
```

在实际工作中，简单工厂模式是满足不了许多需求场景的，所以需要考虑使用到工厂方法。

### 工厂方法

工厂方法的本意是将实际创建对象的工作推迟到子类中。

```javascript
class User {
  constructor(name,sex){
    if(new.target === User ) throw new Error('User 不能被实例化');
    this.name = name;
    this.sex = sex;
  }
}

class UserFactory extends User {
  constructor(...props){
    super(...props)
  }
  static create(role){
    const roleCollection = new Map([
      ['admin',()=> new UserFactory('admin','male')],
      ['user',()=> new UserFactory('user','female')],
    ])
    
    return roleCollection.get(role)()
  }
}

const admin = UserFactory.create('admin') // {name:'admin',sex:'male'}
const user = UserFactory.create('admin') // {name:'user',sex:'female'}
```

随着业务形态的变化，一个用户可能在多个平台上同时存在，显然工厂方法也不再满足了，这时候就要用到抽象工厂。

### 抽象工厂

抽象工厂模式是对类的工厂抽象用来创建产品类簇，不负责创建某一类产品的实例。

```javascript
class User {
  constructor(type){
    if(new.target === User) throw new Error('抽象类不能实例化');
    this.type = type
  }
}

// 教师
class Teacher extends User {
  constructor(name,sex){
    super('teacher');
    this.name = name;
    this.sex = sex
  }
}
// 学生
class Student extends User {
  constructor(name,sex){
    super('student');
    this.name = name;
    this.sex = sex
  }
}

const getUserFactory = (type) => {
  switch(type){
    case 'teacher':
      return Teacher;
      break;
    case 'student';
      return Student;
      break;
    default:
      return Teacher;
  }
}

const TeacherClass = getUserFactory('teacher');
const StudentClass = getUserFactory('student');

const user1 = new TeacherClass('ye1','male')
const user2 = new StudentClass('ye2','female')
```

使用场景： 比如根据权限生成不同用户。

## 单例模式

简单的理解单例模式：保证一个类仅有一个实例，并提供一个访问它的全局访问点。

适用场景：一个单一对象。比如：弹窗，无论点击多少次，弹窗只应该被创建一次。

单例模式又分懒汉式和饿汉式两种，其区别在于懒汉式在调用的时候创建实例，而饿汉式则是在初始化就创建好实例，具体实现如下：

懒汉式：
```javascript
// 懒汉式

class Single {
  static getInstance(){
    if(!Single.instance){
      Single.instance = new Single()
    }
    return Single.instance
  }
}

const t1 = Single.getInstacne()
const t2 = Single.getInstance()

console.log(t1 === t2) // true
```
饿汉式：
```javascript
//饿汉式
class Single{
  static instance = new Single()
  static getInstance(){
    return Single.instance
  }
}
const t1 = Single.getInstacne()
const t2 = Single.getInstance()

console.log(t1 === t2) // true

```

## 原型模式

对于前端来说，原型模式在常见不过了。当前创建的对象和已有对象存在较大共性时，可以通过对象的复制来达到创建新的对象，这就是原型模式。

```javascript
// Objeact.create() 实现原型模式

const user = {
  name: 'ye',
  age: 18
}

let userOne = Object.create(user)
console.log(userOne.__proto__) // { name:'ye',age:18 }

// 原型链继承现实原型模式

class User{
  constructor(name){
    this.name = name
  }
  getName (){
    return this.name
  }
}

class Admin extends User{
  constructor(name){
    super(name)
  }
  setName(_name){
    return this.name = _name
  }
}
const admin = new Admin('ye')
console.log(admin.getName()) // ye
console.log(admin.setName('ye1'));
console.log(admin.getName()) // ye1
```

## 策略模式

策略模式的定义：定义一系列的算法，把他们一个个封装起来，并且使他们可以相互替换。

策略模式的目的就是将算法的使用算法的实现分离开来。

一个基于策略模式的程序至少由两部分组成。

第一个部分是一组策略类（可变），策略类封装了具体的算法，并负责具体的计算过程。
第二个部分是环境类Context（不变），Context接受客户的请求，随后将请求委托给某一个策略类。

```javascript

/*策略类*/
var levelOBJ = {
    "A": function(money) {
        return money * 4;
    },
    "B" : function(money) {
        return money * 3;
    },
    "C" : function(money) {
        return money * 2;
    } 
};
/*环境类*/
var calculateBouns =function(level,money) {
    return levelOBJ[level](money);
};
console.log(calculateBouns('A',10000)); // 40000
```

## 装饰者模式

装饰者模式的定义：在不改变对象自身的基础上，在程序运行期间给对象动态地添加方法。

饰者模式适用的场景：原有方法维持不变，在原有方法上再挂载其他方法来满足现有需求；函数的解耦，将函数拆分成多个可复用的函数，再将拆分出来的函数挂载到某个函数上，实现相同的效果但增强了复用性。

## 观察者模式

定义了对象间的一种一对多的依赖关系，当一个对象的状态发 生改变时，所有依赖于它的对象都将得到通知

取代对象之间硬编码的通知机制，一个对象不用再显式地调用另外一个对象的某个接口。

与传统的发布-订阅模式实现方式（将订阅者自身当成引用传入发布者）不同，在JS中通常使用注册回调函数的形式来订阅

JS中的事件就是经典的发布-订阅模式的实现

```javascript
// 订阅
document.body.addEventListener('click', function() {
    console.log('click1');
}, false);

document.body.addEventListener('click', function() {
    console.log('click2');
}, false);

// 发布
document.body.click(); // click1  click2
```

### 发布-订阅 模式

在“发布者-订阅者”模式中，称为发布者的消息发送者不会将消息编程为直接发送给称为订阅者的特定接收者。这意味着发布者和订阅者不知道彼此的存在。存在第三个组件，称为代理或消息代理或事件总线，它由发布者和订阅者都知道，它过滤所有传入的消息并相应地分发它们

发布-订阅模式 与 观察者模式的区别 在于有没有调度中心