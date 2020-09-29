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

## 创建型模式

### 工厂模式

工厂模式根据抽象程度可分为三种，分别为简单工厂(静态工厂方法)、工厂方法、抽象工厂。其核心在于将创建对象的过程封装其他，然后通过同一个接口创建新的对象。

#### 简单工厂模式

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

#### 工厂方法

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

#### 抽象工厂

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

### 单例模式

简单的理解单例模式：保证一个类仅有一个实例，并提供一个访问它的全局访问点。

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