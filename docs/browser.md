# 浏览器系列

## 浏览器内核
| 浏览器/RunTime | 内核（渲染引擎） | JavaScript 引擎 |
| :-:| :-: | :-: |
| Chrome | Blink（28~）Webkit（Chrome 27） | V8 |
| FireFox | Gecko | SpiderMonkey |
| Safari | Webkit | JavaScriptCore |
| Edge | EdgeHTML | Chakra(for JavaScript) |
| IE | Trident | Chakra(for JScript) |
| Node.js | - | Node.js |

## 浏览器渲染机制

### 渲染流程
1. 浏览器获取HTML文件，然后对文件进行解析，形成DOM Tree
2. 与此同时，进行CSS解析，生成Style Rules
3. 接着将DOM Tree 与 Style Rules 合成为 Render Tree
4. 接着进入布局（Layout）阶段，也就是为每个节点分配一个应该出现在屏幕上的确切坐标
5. 随后调用GPU进行绘制（Paint） 遍历Render Tree 的节点，将元素呈现出来

webkit 具体流程如图

![](./images/webkitflow.png)

### DOM Tree的创建

DOM 是以 `Bytes -> Characters -> Tokens -> Nodes -> DOM` 这样的流程生成的。如下图所示：

![](./images/domTree.png)

1. 当服务器返回HTML文件给浏览器的时候，浏览器接收到的是一些字符数据

2. 然后浏览器根据相应的编码模式，解析字节数据得到字符。如果这时候编码方式和文件字节编码不一致就会出现乱码

3. 浏览器再根据DTD中的对元素（标签）的定义，对这些字符进行语义化（Token）

4. 浏览器使用这些语义块（Token） 创建对象，形成一个个节点

5. HTML解析器就会从HTML文件的头部到尾部，一个个地遍历这些节点。这时会遇到一些情况：
      * 当遇到普通节点就会直接加入DOM树；
      * 当节点是JS代码会将控制权交给JS解析器；
      * 当节点是CSS代码会将解析权交给CSS解析器；
      * 当外联的JS代码和CSS代码还没从服务器传到浏览器的时候，如果DOM树上有可视元素的话，浏览器通常会选择将一些内容提前渲染到屏幕上。

6. 当HTML解析器读到最后一个节点的时候，整个DOM树也构建完成了，这个时候就会触发domContentloaded事件。

### Render Tree

当 DOM 和 CSSOM 构建完成，一个存储了节点信息，一个存储了节点渲染信息，都不能直接用来渲染，浏览器将两者结合，生成渲染树 Render Tree，这棵树包含了页面所有可见元素及其渲染信息。如下图所示

![](https://camo.githubusercontent.com/82823ba106facc98434a7137fbd7ec8022499c7f/68747470733a2f2f75706c6f61642d696d616765732e6a69616e7368752e696f2f75706c6f61645f696d616765732f323639393539342d353237306563326161626432653735622e706e673f696d6167654d6f6772322f6175746f2d6f7269656e742f7374726970253743696d61676556696577322f322f772f313030302f666f726d61742f77656270)

生成渲染树，浏览器做了这些：
1. 从DOM的根节点开始，遍历每个可视节点;script、link、meta都属于不可视节点，另外，display: none的节点也属于不可视节点
2. 从CSSOM中搜索可视节点的样式
3. 计算这些样式，将计算值应用到可视节点上

### 布局和渲染
渲染树生成后，浏览器便可以根据渲染树中的样式信息，结合设备的屏幕信息，计算每个元素的位置和尺寸。得到了渲染树及其节点的布局信息，浏览器便可以将最终的页面渲染到屏幕。

对于渲染我们还需要知道一个概念：设备刷新率

设备刷新率是设备屏幕渲染的频率60HZ 也就是屏幕在1s内渲染60次，约16.7ms渲染一次屏幕。这就意味着，我们的浏览器最佳的渲染性能就是所有的操作在一帧16.7ms内完成。

### 重绘（Repaint）和回流（Reflow）

重绘和回流是渲染步骤中的一小节，但是这两个步骤对于性能影响很大。

**重绘**：当节点需要更改外观而不会影响布局的，比如改变color属性

**回流**：元件的几何尺寸变了，我们需要重新验证并计算Render Tree 。回流也被称为重排

#### 引发回流的操作：

* 页面初始渲染
* 改变字体，改变元素尺寸（宽高、内外边距、边框、元素位置）
* 改变元素内容（文本、图片、输入框输入文字等）
* 添加、删选可见DOM元素 （注意：如果是删除本身就display:none的元素不会发生回流；visibility:hidden的元素显示或隐藏不影响回流）
* 浏览器窗口变化 滚动或缩放
* 伪类样式激活

回流必定会发生重绘，重绘不一定会引发回流。回流所需的成本比重绘高的多，改变深层次的节点很可能导致父节点的一系列回流，所以我们需要减少回流。

#### 避免重绘与回流

* 使用 translate 替代 top
* 使用 visibility 替换 display: none ，因为前者只会引起重绘，后者会引发回流（改变了布局）
* 把 DOM 离线后修改，比如：先把 DOM 给 display:none (有一次 Reflow)，然后你修改 100 次，然后再把它显示出来
* 要把 DOM 结点的属性值放在一个循环里当成循环里的变量
* 将频繁运行的动画变为图层，图层能够阻止该节点回流影响别的元素。比如对于 video 标签，浏览器会自动将该节点变为图层
* 集中改变样式
* 使用DocumentFragment

我们可以通过createDocumentFragment创建一个游离于DOM树之外的节点，然后在此节点上批量操作，最后插入DOM树中，因此只触发一次重排
```
var fragment = document.createDocumentFragment();

for (let i = 0;i<10;i++){
  let node = document.createElement("p");
  node.innerHTML = i;
  fragment.appendChild(node);
}

document.body.appendChild(fragment);
```

#### 图层

一般来说，可以把普通文档流看成一个图层。特定的属性可以生成一个新的图层。不同的图层渲染互不影响，所以对于某些频繁需要渲染的建议单独生成一个新图层，提高性能。但也不能生成过多的图层，会引起反作用。

通过以下几个常用属性可以生成新图层

* 3D 变换：translate3d、translateZ
* will-change
* video、iframe 标签
* 通过动画实现的 opacity 动画转换
* position: fixed

### Load 和 DOMContentLoaded 区别
Load 事件触发代表页面中的 DOM，CSS，JS，图片已经全部加载完毕。

DOMContentLoaded 事件触发代表初始的 HTML 被完全加载和解析，不需要等待 CSS，JS，图片加载


## 跨域

### 跨域的产生

因为浏览器有一种安全机制叫做同源策略。

同源策略是一种约定，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到XSS、CSRF等攻击。所谓同源是指"协议+域名+端口"三者相同，即便两个不同的域名指向同一个ip地址，也非同源。


同源策略限制内容有：
* Cookie、LocalStorage、IndexedDB 等存储性内容
* DOM 节点
* AJAX 请求发送后，结果被浏览器拦截了

以下三个标签可以不受限制：

* `<img src=XXX>`
* `<link href=XXX>`
* `<script src=XXX>`

### 跨域的解决

#### JSONP

JSONP 是 JSON with padding的简写. JSONP本质上是一个Hack，它利用`<script>`标签不受同源策略限制的特性进行跨域操作。由两部分组成:回调函数和数据。回调函数是当响应到来时应该在页面中调用的函数。回调 函数的名字一般是在请求中指定的。而数据就是传入回调函数中的 JSON 数据。下面是一个典型的 JSONP 请求。

```
<script src="http://domain/api?callback=jsonp"></script>
```
优点：
1. 实现简单
2. 兼容性非常好

缺点：

1. 只支持get请求（因为`<script>`标签只能get）
2. 有安全性问题
3. 需要服务端配合jsonp进行一定程度的改造

#### CORS

跨域资源共享(CORS) 是一种机制，它使用额外的 HTTP 头来告诉浏览器  让运行在一个 origin (domain) 上的Web应用被准许访问来自不同源服务器上的指定的资源。

CORS 需要浏览器和后端同时支持。服务端设置 Access-Control-Allow-Origin 就可以开启 CORS。

#### Nginx

使用nginx反向代理实现跨域，是最简单的跨域方式。只需要修改nginx的配置即可解决跨域问题，支持所有浏览器，支持session，不需要修改任何代码，并且不会影响服务器性能。

## 本地存储

## 浏览器缓存

## 浏览器兼容问题