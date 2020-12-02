# React 源码解析理解

## 架构层

### v15
React v15 架构分为 Reconciler 和 Renderer 两部分。reconciler 负责找出变化的组件，renderer负责渲染。

每次当有更新时 reconciler 会做如下工作
* 将组件返回的jsx转化为虚拟dom
* 将新的虚拟dom与上次的虚拟dom进行比较找出差异
* 通知Renderer将差异渲染到页面

在reconciler中，mount的组件会调用mountComponent ，update的组件会调用updateComponent。这两个方法都会递归更新子组件。

由于递归执行，所以更新一旦开始，中途就无法中断。当层级很深时，递归更新时间超过了16ms，用户交互就会卡顿。这就是v15架构渲染的弊端

### v16

React v16 架构 新增了Scheduler，使得架构分为了 Scheduler、Reconciler、Renderer 三部分。

Scheduler 的功能：具有在空闲时触发回调的功能，还提供了多种调度优先级供任务设置。

判断浏览器是否有空闲时间，其实是具有API requestIdleCallback.但是由于它的兼容性和触发频率不稳定，受很多因素影响等原因。React团队自己实现了功能更完备的
requestIdleCallback pilyfill 这就是Scheduler

v15中Reconciler是递归调用虚拟DOM的，v16中将递归变为了可中断的循环遍历。具体的为：当Scheduler将任务交给Reconciler后，Reconciler会为变化的虚拟DOM打上代表增/删/更新的标记。整个Scheduler与Reconciler的工作都在内存中进行。只有当所有组件都完成Reconciler的工作，才会统一交给Renderer。

## Fiber

架构的改变导致之前的虚拟dom数据结构无法在新架构中使用，所以reconciler中产用了全新的Fiber架构。

Fiber包含三层含义：
1. 作为架构来说，之前React15的Reconciler采用递归的方式执行，数据保存在递归调用栈中，所以被称为stack Reconciler。React16的Reconciler基于Fiber节点实现，被称为Fiber Reconciler。
2. 作为静态的数据结构来说，每个Fiber节点对应一个React element，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。
3. 作为为动态的工作单元来说，每个Fiber节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。

### Fiber的数据结构中 

如下属性作用于架构层
```javascript
// 指向父级Fiber节点
this.return = null;
// 指向子Fiber节点
this.child = null;
// 指向右边第一个兄弟Fiber节点
this.sibling = null;
```

如下属性作用于静态数据结构
```javascript
// Fiber对应组件的类型 Function/Class/Host...
this.tag = tag;
// key属性
this.key = key;
// 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
this.elementType = null;
// 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
this.type = null;
// Fiber对应的真实DOM节点
this.stateNode = null;
```

如下属性作用于动态的工作单元

```javascript
// 保存本次更新造成的状态改变相关信息
this.pendingProps = pendingProps;
this.memoizedProps = null;
this.updateQueue = null;
this.memoizedState = null;
this.dependencies = null;

this.mode = mode;

// 保存本次更新会造成的DOM操作
this.effectTag = NoEffect;
this.nextEffect = null;

this.firstEffect = null;
this.lastEffect = null;
```

## Fiber工作原理

在React中最多会同时存在两棵Fiber树。当前屏幕上显示内容对应的Fiber树称为current Fiber tree，正在内存中构建的Fiber树称为workInProgress Fiber tree。


current Fiber树中的Fiber节点被称为current fiber，workInProgress Fiber树中的Fiber节点被称为workInProgress fiber，他们通过alternate属性连接。

React应用的根节点通过current指针在不同Fiber树的rootFiber间切换来实现Fiber树的切换。

当workInProgress Fiber树构建完成交给Renderer渲染在页面上后，应用根节点的current指针指向workInProgress Fiber树，此时workInProgress Fiber树就变为current Fiber树。

每次状态更新都会产生新的workInProgress Fiber树，通过current与workInProgress的替换，完成DOM更新。


## Fiber 的创建

render阶段开始于 `performSyncWorkOnRoot`或`performConcurrentWorkOnRoot`方法的调用。这取决于本次更新是同步更新还是异步更新.

```javascript
// performSyncWorkOnRoot会调用该方法
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

// performConcurrentWorkOnRoot会调用该方法
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```
可以看到，他们唯一的区别是是否调用shouldYield。如果当前浏览器帧没有剩余时间，shouldYield会中止循环，直到浏览器有空闲时间后再继续遍历。

`workInProgress`代表当前已创建的`workInProgress fiber`。

`performUnitOfWork`方法会创建下一个`Fiber节点`并赋值给`workInProgress`，并将`workInProgress`与已创建的`Fiber节点`连接起来构成`Fiber树`。

我们知道Fiber Reconciler是从Stack Reconciler重构而来，通过遍历的方式实现可中断的递归，所以performUnitOfWork的工作可以分为两部分：“递”和“归”。

### “递”阶段

首先从rootFiber开始向下深度优先遍历。为遍历到的每个Fiber节点调用beginWork方法 (opens new window)。

该方法会根据传入的Fiber节点创建子Fiber节点，并将这两个Fiber节点连接起来。

当遍历到叶子节点（即没有子组件的组件）时就会进入“归”阶段。

beginWork的工作可以分为两部分：
1. update时：如果current存在，在满足一定条件时可以复用current节点，这样就能克隆current.child作为workInProgress.child，而不需要新建workInProgress.child。
2. mount时：除fiberRootNode以外，current === null。会根据fiber.tag不同，创建不同类型的子Fiber节点

### reconcileChildren
beginWork 会调用 reconcileChildren函数，该方法是Reconcile的核心模块。

该函数的作用:

* 对于mount的组件，他会创建新的子Fiber节点
* 对于update的组件，他会将当前组件与该组件在上次更新时对应的Fiber节点比较（也就是俗称的Diff算法），将比较的结果生成新Fiber节点

最终它将生成的新的子Fiber节点赋值给workInProgress.child，作为本次beginWork返回值，并作为下次performUnitOfWork执行时workInProgress的传参

### effectTag

render阶段的工作是在内存中进行，当工作结束后会通知Renderer需要执行的DOM操作。要执行DOM操作的具体类型就保存在fiber.effectTag中。



### “归”阶段

在“归”阶段会调用completeWork (opens new window)处理Fiber节点。

当某个Fiber节点执行完completeWork，如果其存在兄弟Fiber节点（即fiber.sibling !== null），会进入其兄弟Fiber的“递”阶段。

如果不存在兄弟Fiber，会进入父级Fiber的“归”阶段。

“递”和“归”阶段会交错执行直到“归”到rootFiber。至此，render阶段的工作就结束了






