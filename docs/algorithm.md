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


## 链表

### 概念

链表是一个线性结构，同时也是一个天然的递归结构。链表结构可以充分利用计算机内存空间，实现灵活的内存动态管理。但是链表失去了数组随机读取的优点，同时链表由于增加了结点的指针域，空间开销比较大。

js 实现
```
class Node{
  constructor(value,next){
    this.value = value;
    this.next = next
  }
}

class LinkedList{
  constructor(){
    this.length = 0
    this.header = null
  }
  
  checkIndex(index) { // 判断是否越界
    if (index < 0 || index > this.length) throw Error('Index error')
  }
  find(node = this.header,index,currentIndex = 0 ){ // 查找对应位置的节点
    if(index == cunrrentIndex ) return node
    return this.find(node.next,index,currentIndex + 1)
  }
  addNode(element,index){ 
    this.checkIndex(index)
    if(index == 0){
      this.header = new Node(element,null);
      return 
    }
    let currentNode = this.find(index)
    currentNode.next = new Node(v,currentNode.next) // 变更点前位置node.next的值 并将新node的next 变更为之前的值
    this.length ++
  }
  remove(index){ // 从列表中移除一项。
    this.check(index)
    let currentNode = this.find(index)
    let node = currentNode.next
    currentNode.next = node.next
    node.next = null
    this.length --;
  }
}
```

### 双向链表

双向链表和普通链表的区别在于，在链表中， 一个节点只有链向下一个节点的链接，而在双向链表中，链接是双向的:一个链向下一个元素， 另一个链向前一个元素
![](./images/doublyLinkedList.png)

```
class DoublyNode extends Node {
   constructor(value,perv,next){
     super(value,next)
     this.next = next
   }
}
class DoublyLinkedList{
  constructor(){
    this.length = 0;
    this.header = null
    this.tail = null // 尾指针
  }
  checkIndex(index) { // 判断是否越界
    if (index < 0 || index > this.length) throw Error('Index error')
  }
  find(node = this.header,index,currentIndex = 0 ){ // 查找对应位置的节点
    if(index == cunrrentIndex ) return node
    return this.find(node.next,index,currentIndex + 1)
  }
  addNode(element,index){ 
    this.checkIndex(index)
    let currentNode = this.find(index)
    let newNode = new DoublyNode(v,currentNode,currentNode.next)
    currentNode.next.perv = newNode
    currentNode.next = newNode 
    this.length ++
  }
  remove(index){ // 从列表中移除一项。
    this.check(index)
    let currentNode = this.find(index)
    currentNode.next.perv = currentNode.perv
    currentNode.perv.next = currentNode.next
    this.length --;
  }
}
```

