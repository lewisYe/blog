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

### cookies

cookie 是指存储在用户本地终端上的数据，同时它是与具体的web页面或者站点相关。cookie数据会自动在web浏览器和web服务器之间传输。

#### 特性

* 不同的浏览器存放的cookie位置不一样
* cookie的存储是以域名形式区分的，不同的域下存储的cookie是独立
* 可以设置cookie生效的域，也就是说我们能操作的cookie是当前域以及当前域下的子域
* 一个域名下存储的cookie个数是有限的
* 每个cookie存放的内容大小也是有限制的，不同的浏览器存放大小不一样，一般为4KB。
* cookie也可以设置过期的时间，默认是会话结束的时候，当时间到期自动销毁


#### cookie的增删改

**设置**

cookie的设置可以分为服务端设置和客户端设置

1. **服务端设置**

服务器端响应的response header 中 set-cookie,是服务端专门用来设置cookie的。

语法：`Set-Cookie: value[; expires=date][; domain=domain][; path=path][; secure]`

注意： 
  * 一个set-Cookie字段只能设置一个cookie，当你要想设置多个 cookie，需要添加同样多的set-Cookie字段。
  * 服务端可以设置cookie 的所有选项：expires、domain、path、secure、HttpOnly 
  * 通过 Set-Cookie 指定的这些可选项只会在浏览器端使用，而不会被发送至服务器端。

2. **客户端设置**

语法：`document.cookie = "key=value[;expires=date][;domain=domain][;path=path][;secure]" `

注意：客户端可以设置cookie 的下列选项：expires、domain、path、secure（有条件：只有在https协议的网页中，客户端设置secure类型的 cookie 才能成功），但无法设置HttpOnly选项。

**读取**

通过document.cookie来获取当前网站下的cookie的时候，得到的字符串形式的值，它包含了当前网站下所有的cookie（为避免跨域脚本(xss)攻击，这个方法只能获取非 HttpOnly 类型的cookie）。它会把所有的cookie通过一个分号+空格的形式串联起来 例如username=xx; age=xxx

**修改**

要想修改一个cookie，只需要重新赋值就行，旧的值会被新的值覆盖。但要注意一点，在设置新cookie时，path/domain这几个选项一定要旧cookie 保持一样。否则不会修改旧值，而是添加了一个新的 cookie。

**删除**

把要删除的cookie的过期时间设置成已过去的时间,path/domain/这几个选项一定要旧cookie 保持一样。

#### 属性

1. expires

用来设置cookie的有效时间，默认为浏览器会话(Session)。

时间必须是 GMT 格式的时间；可以通过 new Date().toGMTString()或者new Date().toUTCString() 来获得 。

例如`expires=Thu, 25 Feb 2020 14:18:00 GMT`表示cookie讲在2020年2月25日14:18分之后失效，对于失效的cookie浏览器会清空。

注意:

expires 是 http/1.0协议中的选项，在新的http/1.1协议中expires已经由 max-age 选项代替，两者的作用都是限制cookie 的有效时间。

expires的值是一个时间点（cookie失效时刻= expires），而max-age 的值是一个以秒为单位时间段（cookie失效时刻= 创建时刻+ max-age）。

max-age 的默认值是 -1(即有效期为 session )；若max-age有三种可能值：负数、0、正数。负数：有效期session；0：删除cookie；正数：有效期为创建时刻+ max-age

假如 Expires 和 Max-Age 都存在，Max-Age 优先级更高。

2. Domain

Domain 指定了 Cookie 可以送达的主机名。假如没有指定，那么默认值为当前文档访问地址中的主机部分（但是不包含子域名）。

但是很多网址不止有一个域名比如：a.example.com和b.example.com如果他们想要共享cookie那么cookie的domain需要设置为domain=.example.com

注意的是不能跨域设置 Cookie

3. Path

Path 指定了一个 URL 路径，这个路径必须出现在要请求的资源的路径中才可以发送 Cookie 首部。比如设置 Path=/docs，/docs/Web/ 下的资源会带 Cookie 首部，/test 则不会携带 Cookie 首部。

Domain 和 Path 标识共同定义了 Cookie 的作用域：即 Cookie 应该发送给哪些 URL。

4. Secure

标记为 Secure 的 Cookie 只应通过被HTTPS协议加密过的请求发送给服务端。使用 HTTPS 安全协议，可以保护 Cookie 在浏览器和 Web 服务器间的传输过程中不被窃取和篡改。

5. HTTPOnly

设置 HTTPOnly 属性可以防止客户端脚本通过 document.cookie 等方式访问 Cookie，有助于避免 XSS 攻击。

6. SameSite

SameSite 是最近非常值得一提的内容，因为 2020年 2 月份发布的 Chrome80 版本中默认屏蔽了第三方的 Cookie。

SameSite 属性可以让 Cookie 在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击（CSRF）。

SameSite 可以有下面三种值：
1. **Strict** 仅允许一方请求携带Cookie，即浏览器将只发送相同站点请求的Cookie，即当前网页URL与请求目标URL完全一致
2. **Lax** 允许部分第三方请求携带Cookie
3. **None** 无论是否跨站都会发送Cookie

之前默认是None，Chrome80版本后默认是Lax

什么是跨站

Cookie中的「同站」判断就比较宽松：只要两个 URL 的 eTLD+1 相同即可，不需要考虑协议和端口。

其中，eTLD 表示有效顶级域名，注册于 Mozilla 维护的公共后缀列表（Public Suffix List）中，例如，.com、.co.uk、.github.io 等。eTLD+1 则表示，有效顶级域名+二级域名，例如 taobao.com 等。

举几个例子，www.taobao.com 和 www.baidu.com 是跨站，www.a.taobao.com 和 www.b.taobao.com 是同站，a.github.io 和 b.github.io 是跨站(注意是跨站)。

SameSite 的值从None 变为 Lax 所带来的影响有哪些

|请求类型|实例|Strict|Lax|None|
|:-:|:-:|:-:|:-:|:-:|
|链接|`<a href="..."></a>`|不发送|发送cookie|发送cookie|
|get表单|`<form method="GET" action="">`|不发送|发送cookie|发送cookie|
|post表单|`<form method="POST" action="">`|不发送|不发送|发送cookie|
|iframe|`<iframe src=".."></iframe>`|不发送|不发送|发送cookie|
|AJAX|`$.get()`|不发送|不发送|发送cookie|
|Image|`<img src="...">`|不发送|不发送|发送cookie|

从表格中可以看出，对大部分 web 应用而言，Post 表单，iframe，AJAX，Image 这四种情况从以前的跨站会发送三方 Cookie，变成了不发送。

Post表单：应该的，学 CSRF 总会举表单的例子。

iframe：iframe 嵌入的 web 应用有很多是跨站的，都会受到影响。

AJAX：可能会影响部分前端取值的行为和结果。

Image：图片一般放 CDN，大部分情况不需要 Cookie，故影响有限。但如果引用了需要鉴权的图片，可能会受到影响


不过也会有两点要注意的地方：

1. HTTP 接口不支持 SameSite=none

如果你想加 SameSite=none 属性，那么该 Cookie 就必须同时加上 Secure 属性，表示只有在 HTTPS 协议下该 Cookie 才会被发送。

2. 需要 UA 检测，部分浏览器不能加 SameSite=none
IOS 12 的 Safari 以及老版本的一些 Chrome 会把 SameSite=none 识别成 SameSite=Strict，所以服务端必须在下发 Set-Cookie 响应头时进行 User-Agent 检测，对这些浏览器不下发 SameSite=none 属性

#### Cookie 的作用与缺点

Cookie 主要用于以下三个方面：

会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
个性化设置（如用户自定义设置、主题等）
浏览器行为跟踪（如跟踪分析用户行为等）

缺点 可以从大小、安全、增加请求大小等方面回答。

### localStorage、sessionStorage

localStorage和sessionStorage都继承于Storage，提供了统一的api来访问和设置数据。API列表:

* Storage.length 返回一个整数，表示存储在 Storage 对象中的数据项数量。
* Storage.key() 该方法接受一个数值 n 作为参数，并返回存储中的第 n 个键名。
* Storage.getItem() 该方法接受一个键名作为参数，返回键名对应的值。
* Storage.setItem() 该方法接受一个键名和值作为参数，将会把键值对添加到存储中，如果键名存在，则更新其对应的值
* Storage.removeItem() 该方法接受一个键名作为参数，并把该键名从存储中删除。
* Storage.clear() 调用该方法会清空存储中的所有键名。

localStorage和sessionStorage不同之处在于 localStorage 里面存储的数据没有过期时间设置，而存储在 sessionStorage 里面的数据在页面会话结束时会被清除。页面会话在浏览器打开期间一直保持，并且重新加载或恢复页面仍会保持原来的页面会话.

### cookie,localStorage,sessionStorage区别

相同：在本地（浏览器端）存储数据。

不同：

* localStorage只要在相同的协议、相同的主机名、相同的端口下，就能读取/修改到同一份localStorage数据。
* sessionStorage比localStorage更严苛一点，除了协议、主机名、端口外，还要求在同一窗口（也就是浏览器的标签页）下。
* localStorage是永久存储，除非手动删除。
* sessionStorage当会话结束（当前页面关闭的时候，自动销毁）
* cookie的数据会在每一次发送http请求的时候，同时发送给服务器而localStorage、sessionStorage不会。

### Service Worker

## 浏览器缓存

缓存按缓存策略来分可以分为**强制缓存**和**协商缓存**

### 强制缓存

强制缓存直接减少请求数，是提升最大的缓存策略。 如果考虑使用缓存来优化网页性能的话，强制缓存应该是首先被考虑的。可以造成强制缓存的字段是 Cache-control 和 Expires。

#### Expires

Expires 是 HTTP 1.0 的字段，表示缓存到期时间。 在Response Headers中，在响应http请求时告诉浏览器在过期时间前浏览器可以直接从浏览器缓存取数据，而无需再次请求。例如 Expires: Thu, 10 Nov 2019 08:45:11 GMT

但是该字段具有以下缺点：

* 由于服务器返回的时间是绝对时间，用户如果对本地时间进行修改，从而导致浏览器判断缓存失效，重新请求该资源。或者不考虑修改，客户端与服务器端时间可能存在时差或者误差。


#### Cache-control

在HTTP/1.1中，Cache-Control是**最重要**的规则，主要用于控制网页缓存。例如：Cache-control: max-age=60*5。

Cache-control 常用字段：[完整属性列表](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control)

* max-age 设置缓存存储的最大周期，超过这个时间缓存被认为过期(单位秒)。与Expires相比，时间使用的是相对于请求发起的时间。
* no-cache 在发布缓存副本之前，强制要求缓存把请求提交给原始服务器进行验证(协商缓存验证)。
* no-store 缓存不应存储有关客户端请求或服务器响应的任何内容，即不使用任何缓存。
* public 表明响应可以被任何对象（包括：发送请求的客户端，代理服务器，等等）缓存，即使是通常不可缓存的内容。
* private 表明响应只能被单个用户缓存，不能作为共享缓存（即代理服务器不能缓存它）。私有缓存可以缓存响应内容，比如：对应用户的本地浏览器。
* must-revalidate 一旦资源过期（比如已经超过max-

这些值可以混合使用。在混合使用时，它们的优先级如下图:

![](https://camo.githubusercontent.com/6d856deffa6c56e887a610ae81e99b50a36172c1/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f31322f32362f313637653837333962633732346663623f696d61676556696577322f302f772f313238302f682f3936302f666f726d61742f776562702f69676e6f72652d6572726f722f31)

注意 在 HTTP/1.1 之前，如果想使用 no-cache，通常是使用 Pragma 字段，如 Pragma: no-cache(这也是 Pragma 字段唯一的取值)。

自从 HTTP/1.1 开始，Expires 逐渐被 Cache-control 取代。Cache-control 是一个相对时间，即使客户端时间发生改变，相对时间也不会随之改变，这样可以保持服务器和客户端的时间一致性。而且 Cache-control 的可配置性比较强大。

Cache-control 的优先级高于 Expires，为了兼容 HTTP/1.0 和 HTTP/1.1，实际项目中两个字段都会设置。

### 协商缓存

当强制缓存失效(超过规定时间)时，就需要使用协商缓存，由服务器决定缓存内容是否失效。

协商缓存在请求数上和没有缓存是一致的，但如果是 304 的话，返回的仅仅是一个状态码而已，并没有实际的文件内容，因此 在响应体体积上的节省是它的优化点。

协商缓存主要通过两组Http Header 值实现 `Last-Modified & If-Modified-Since` 和 `ETag & If-None-Match`

#### Last-Modified & If-Modified-Since

1. 服务器端在Response Header 中 `Last-Modified`字段告知客户端，资源最后一次被修改的时间，例如 `Last-Modified: Mon, 10 Nov 2018 09:10:11 GMT`

2. 下一次请求相同资源时时，浏览器从自己的缓存中找出“不确定是否过期的”缓存。因此在请求头中将上次的 `Last-Modified` 的值写入到Request Header的 `If-Modified-Since` 字段

3. 服务器会将 `If-Modified-Since` 的值与 `Last-Modified` 字段进行对比。如果相等，则表示未修改，响应 304；反之，则表示修改了，响应 200 状态码，并返回数据。

**缺点：**
* 如果资源更新的速度是秒以下单位，那么该缓存是不能被使用的，因为它的时间单位最低是秒。
* 如果文件是通过服务器动态生成的，那么该方法的更新时间永远是生成的时间，尽管文件可能没有变化，所以起不到缓存的作用。

#### ETag & If-None-Match

Etag是服务器响应请求时，返回当前资源文件的一个唯一标识(由服务器生成)，只要资源有变化，Etag就会重新生成。

1. 服务器端在Response Header 中 `ETag`字段告知客户端，代表当前资源的唯一标识。

2. 下一次请求相同资源时时，浏览器从自己的缓存中找出“不确定是否过期的”缓存。因此将上次的 `ETag` 的值写入到Request Header的 `If-None-Match` 字段

3. 服务器会将 `If-None-Match` 的值与 `ETag` 字段进行对比。如果相等，则表示未修改，响应 304；反之，则表示修改了，响应 200 状态码，并返回数据。

#### Last-Modified 与 Etag 比较

1. 首先在精确度上，Etag要优于Last-Modified。

Last-Modified的时间单位是秒，如果某个文件在1秒内改变了多次，那么他们的Last-Modified其实并没有体现出来修改，但是Etag每次都会改变确保了精度；如果是负载均衡的服务器，各个服务器生成的Last-Modified也有可能不一致。

2. 第二在性能上，Etag要逊于Last-Modified，毕竟Last-Modified只需要记录时间，而Etag需要服务器通过算法来计算出一个hash值。 

3. 第三在优先级上，服务器校验优先考虑Etag

### 缓存总结

缓存流程图：

![](./images/cache.png)

#### 用户行为对缓存的影响

| 用户操作 | Expries/Cache-Control | Last-Modied/Etag |
| :-: | :-: |:-: |
| 地址栏回车 | 有效 | 有效 |
| 页面链接跳转 | 有效 | 有效 |
| 新开窗口 | 有效 | 有效 |
| 浏览器前进后退 | 有效 | 有效 |
| F5刷新 | 无效 | 有效 |
| ctrl + F5 强制刷新 | 无效 | 无效 |

### 实际项目中的缓存问题

#### 微信浏览器H5页面缓存问题

问题描述：在微信公众号中添加h5跳转链接，当项目更新发布之后，在微信公众号中点击入口进入，页面出现白屏。

问题定位：跟过调试和分析发现是微信浏览器缓存问题，更新发布现代码之后，调用的还是上一次的js 资源

h5页面技术实现：react

问题解决：
1. app.js 添加 时间戳后缀 
2. index.html 文件中添加
```
 <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
```
3. nginx 配置中添加
```
location / {
    root   html;
    index  index.html;
    add_header Cache-Control no-cache; // 主要是这一行 忽略缓存
}
```