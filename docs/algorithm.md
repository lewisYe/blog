# 数据结构与算法

## 栈

### 概念

栈是一种遵从**后进先出(LIFO)**原则的有序集合。新添加的或待删除的元素都保存在栈的末尾，称作栈顶，另一端叫栈底。

接着我们用js来实现主要的功能点：
1. push(element(s)):添加一个(或几个)新元素到栈顶
2. pop():移除栈顶的元素，同时返回被移除的元素。
3. peek():返回栈顶的元素，不对栈做任何修改(这个方法不会移除栈顶的元素，仅仅返回它)。
4. isEmpty():如果栈里没有任何元素就返回true，否则返回false。
5. clear():移除栈里的所有元素。
6. size():返回栈里的元素个数。

```
function Stack(){
  constructor(){
    this.stack = []
  }
  push(item){
    this.stack.push(item)
  }
  pop(){
    return this.stack.pop()
  }
  peek(){
    return this.stack[this.stack.length - 1]
  }
  size(){
    return this.stack.length
  }
  isEmpty(){
    return this.stack.length === 0
  }
  clear(){
     this.stack = []
  }
}
```
### 场景运用

Leetcode上[有效的括号](https://leetcode-cn.com/problems/valid-parentheses/)

该题就是一道可以运用栈的思想来解题

```
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
  let map = {
    '(': -1,
    ')': 1,
    '[': -2,
    ']': 2,
    '{': -3,
    '}': 3,
  }
  let stack = []

  for(var v of s){
    if(map[v] < 0){
      stack.push(map[v])
    }else{
      let n  = stack.pop()
      if(n + map[v] !=0) return false
    }
  }
  if(stack.length > 0) return false
  return true
};
```

## 队列

### 概念

队列是遵循**先进先出（FIFO)**原则的一组有序的项。队列在尾部添加新元素，并从顶部移除元素。最新添加的元素必须排在队列的末尾。

在现实中，最常见的队列的例子就是排队。

用js来实现主要的功能点：
1. enqueue(element(s)):向队列尾部添加一个或多个新的项
2. dqueue():移除队列的第一项，并返回被移除的元素
3. front():返回队列中第一个元素。。队列不做任何变动
4. isEmpty():如果队列中不包含任何元素，返回true，否则返回false。
5. size():返回队列包含的元素个数

```
class Queue(){
  constructor(){
    this.queue = []
  }
  enqueue(item){
    this.queue.push(item)
  }
  dqueue(){
    return this.queue.shift()
  }
  front(){
    return this.queue[0]
  }
  isEmpty(){
    return this.queue.length === 0
  }
  size(){
    return this.queue.length
  }
}
```

队列的扩展还有 最小优先队列、最大优先队列、循环队列等

最小优先队列，是把优先级的值较小的元素被放置在队列最前面

最大优先队列，是把优先级的值较大的元素被放置在队列最前面