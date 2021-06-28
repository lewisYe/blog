# Webpack

## 基础配置

本文就不过多的说明基础配置, 具体配置可查看[本链接](https://github.com/lewisYe/react-cli)

## 性能优化

### 分析工具

在进行性能优化之前，是不是需要知道哪里需要被优化，所以我们需要分析工具。

#### 速度分析

使用 `speed-measure-webpack-plugin` 插件

``` javascript

// 安装

npm i speed-measure-webpack-plugin -D

// webpack.config.js配置
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const swp = new SpeedMeasureWebpackPlugin()

swp.warp({
    // webpack配置
})
```

使用warp方法将webpack配置包裹 [具体配置查看](https://www.npmjs.com/package/speed-measure-webpack-plugin)

效果如下图：
![](./images/smp.png)


该插件主要的工作是：计算整个打包总消耗；具体loader和plugin所花费的具体时间


#### 体积分析

打包后的体积优化是一个可以着重优化的点，比如引入的一些第三方组件库过大，这时就要考虑是否需要寻找替代品了。例如moment

使用 `webpack-bundle-analyzer` 插件来分析包体积大小

``` javascript

// 安装 
npm i webpack-bundle-analyzer -D

//webpack.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
    plugins: [
        new BundleAnalyzerPlugin()
    ]
}
```

[具体配置查看](https://www.npmjs.com/package/webpack-bundle-analyzer)

然后在命令行工具中输入npm run build，它默认会起一个端口号为 8888 的本地服务器：

![](./images/analyzer.jpg)

###  优化方案

* 使用高版本的webpack 和 node.js
* 多进程/多实例构建
  * thread-loader
  * happypack
  * parallel-webpack
* 多进程并行压缩
  * terser-webpack-plugin
  * uglifyjs-webpack-plugin
  * parallel-uglify-plugin
* 分包 与 预编译
  * webpack externals
* 开启缓存
  * babel-loader 开始缓存
  * terser-webpack-plugin 开启缓存 cache  true
  * cache-loader 和 hard-source-webpack-plugin
* 缩小构建目标
  * babel-loader 的时候 不解析node_modules里面的内容 使用exclude,和include的使用
  * 优化 resolve.modules 配置 缩小搜索范围层级
  * 优化 resolve.mainFields 配置 查询入口文件
  * 优化 resolve.extensions 后缀名
  * 合理使用 resolve.alias
* tree shaking 
* 图片压缩
* polyfill service优化构建体积
* socpe hoisting


#### 使用高版本的webpack 和 node.js

比如webpack4 的打包速度就快于webpack3；node 的版本更高速度也会更快

webpack 优化原因

V8 带来的优化 使用for of 代替了forEach 、Map和Set代替了Object 、includes代替了indexOf

默认使用更快的md4 hash算法

webpacks AST可以直接从loader传递给 AST 减少传递时间

使用字符串代替正则表达式

#### 多进程/多实例构建

可以使用的插件有

* thread-loader
* happypack
* parallel-webpack

**thread-loader 用法**

thread-loader 会将你的 loader 放置在一个 worker 池里面运行，以达到多线程构建。

``` javascript
// 安装
npm i thread-loader -D

//webpack.config.js
module.exports = {
    module: {
        rules: [{
            test: /\.js$/,
            include: path.resolve("src"),
            use: [
                {
                    loader: 'thread-loader',
                    options: {
                    workers: 4,
                    },
                },
                'babel-loader',
            ],
        }]
    }
}
```

把这个 loader 放置在其他 loader 之前（如下面示例的位置）， 放置在这个 loader 之后的 loader 就会在一个单独的 worker 池(worker pool)中运行。

[更多配置查看](https://www.npmjs.com/package/thread-loader)

**HappyPack 用法**

HappyPack 可以让 Webpack 同一时间处理多个任务，发挥多核 CPU 的能力，将任务分解给多个子进程去并发的执行，子进程处理完后，再把结果发送给主进程。通过多进程模型，来加速代码构建。

``` javascript
// 安装

npm i happypack -D

// webpack.config.js
const HappyPack = require('happypack');

exports.module = {
    rules: [{
        test: /.js$/,
        use: 'happypack/loader',
    }]
};

exports.plugins = [
    new HappyPack({
        loaders: ['babel-loader']
    })
];
```

该方法在webpack3中使用比较多，而且目前作者都不在维护该库，并推荐在webpack 4中使用 `thread-loader` 更多happypack配置查看[配置连接](https://www.npmjs.com/package/happypack)


`thread-loader` 和 `happypack` 对于小型项目来说打包速度几乎没有影响，甚至可能会增加开销，所以建议尽量在大项目中采用。

#### 多进程并行压缩

webpack默认提供了UglifyJS插件来压缩JS代码，但是它使用的是单线程压缩代码，也就是说多个js文件需要被压缩，它需要一个个文件进行压缩。所以说在正式环境打包压缩代码速度非常慢(因为压缩JS代码需要先把代码解析成用Object抽象表示的AST语法树，再应用各种规则分析和处理AST，导致这个过程耗时非常大)。

所以我们要对压缩代码这一步骤进行优化，常用的做法就是多进程并行压缩


目前有三种主流的压缩方案：

* terser-webpack-plugin
* uglifyjs-webpack-plugin
* parallel-uglify-plugin

#### terser-webpack-plugin

不知道你有没有发现：webpack4 已经默认支持 ES6语法的压缩。而这离不开terser-webpack-plugin。

```javascript
// 安装
npm i terser-webpack-plugin -D

//webpack.config.js

const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: 4,
      }),
    ],
  },
};
```

#### uglifyjs-webpack-plugin

```javascript
// 安装 
npm i uglifyjs-webpack-plugin -D

//webpack.config.js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        warnings: false,
        parse: {},
        compress: {},
        ie8: false
      },
      parallel: true
    })
  ]
};
```
通过设置parallel: true开启多进程压缩。

#### parallel-uglify-plugin

当webpack有多个JS文件需要输出和压缩时，原来会使用UglifyJS去一个个压缩并且输出，而ParallelUglifyPlugin插件则会开启多个子进程，把对多个文件压缩的工作分给多个子进程去完成，但是每个子进程还是通过UglifyJS去压缩代码。并行压缩可以显著的提升效率。

```javascript
// 安装
npm i webpack-parallel-uglify-plugin -D

//webpack.comfig.jss

import ParallelUglifyPlugin from 'webpack-parallel-uglify-plugin';

module.exports = {
  plugins: [
    new ParallelUglifyPlugin({
      // Optional regex, or array of regex to match file against. Only matching files get minified.
      // Defaults to /.js$/, any file ending in .js.
      test,
      include, // Optional regex, or array of regex to include in minification. Only matching files get minified.
      exclude, // Optional regex, or array of regex to exclude from minification. Matching files are not minified.
      cacheDir, // Optional absolute path to use as a cache. If not provided, caching will not be used.
      workerCount, // Optional int. Number of workers to run uglify. Defaults to num of cpus - 1 or asset count (whichever is smaller)
      sourceMap, // Optional Boolean. This slows down the compilation. Defaults to false.
      uglifyJS: {
        // These pass straight through to uglify-js@3.
        // Cannot be used with uglifyES.
        // Defaults to {} if not neither uglifyJS or uglifyES are provided.
        // You should use this option if you need to ensure es5 support. uglify-js will produce an error message
        // if it comes across any es6 code that it can't parse.
      },
      uglifyES: {
        // These pass straight through to uglify-es.
        // Cannot be used with uglifyJS.
        // uglify-es is a version of uglify that understands newer es6 syntax. You should use this option if the
        // files that you're minifying do not need to run in older browsers/versions of node.
      }
    }),
  ],
};
```

注意：webpack-parallel-uglify-plugin已不再维护，这里不推荐使用

#### 分包 与 预编译

什么是预编译

在使用webpack进行打包时候，对于依赖的第三方库，比如React，Redux等这些不会修改的依赖，我们可以让它和我们自己编写的代码分开打包，这样做的好处是每次更改我本地代码的文件的时候，webpack只需要打包我项目本身的文件代码，而不会再去编译第三方库。

那么第三方库在第一次打包的时候只打包一次，以后只要我们不升级第三方包的时候，那么webpack就不会对这些库去打包，这样的可以快速的提高打包的速度。其实也就是预编译资源模块。

webpack中，我们可以结合DllPlugin 和 DllReferencePlugin插件来实现。

但是发现在 vue-cli 和 create-react-app 抛弃了 该种方法 也可以使用hard-source-webpack-plugin 来代替 所以该方法作为了解吧。有兴趣的同学可以深入了解一下。

#### 开启缓存

* babel-loader 开始缓存
* terser-webpack-plugin 开启缓存
* cache-loader 和 hard-source-webpack-plugin

缓存对于首次构建时间没有太大变化，但是第二次构建有显著提升

#### 缩小构建目标

* babel-loader 的时候 不解析node_modules里面的内容 使用exclude,和include的使用
* 优化 resolve.modules 配置 缩小搜索范围层级
* 优化 resolve.mainFields 配置 查询入口文件
* 优化 resolve.extensions 后缀名
* 合理使用 resolve.alias

#### tree shaking 

* purgecss-webpack-plugin 去除无效css

#### 图片压缩

* image-webpack-loader

#### polyfill service优化构建体积


es6语法不兼容 需要使用到polyfill去转换

|方案|优点|缺点|推荐|
|:-:|:-:|:-:|:-:|
|babel-polyfill|react推荐|1.包体积200k+，难以单独抽离Map、Set|❎|
|babel-plugin-transform-runtime|能只polyfill用到的类和方法，相对体积小|不能polyfill原型上的方法，不能应用于复杂的业务场景|❎|
|自己写一个库|定制化、体积小|重复造轮子、需要更新维护|❎|
|polyfill-service|只给用户返回用到的polyfill、社区维护|国内奇葩浏览器UA不能识别、但可以降级处理返回全部的polyfill|✅|


https://polyfill.io/v3/ 官网

#### socpe hoisting

Scope hoisting 直译过来就是「作用域提升」。熟悉 JavaScript 都应该知道「函数提升」和「变量提升」，JavaScript 会把函数和变量声明提升到当前作用域的顶部。「作用域提升」也类似于此，webpack 会把引入的 js 文件“提升到”它的引入者顶部。

Scope Hoisting 可以让 Webpack 打包出来的代码文件更小、运行的更快。

要在 Webpack 中使用 Scope Hoisting 非常简单，因为这是 Webpack 内置的功能，只需要配置一个插件，相关代码如下：

```javascript
module.exports = {
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
};
```
该插件在webpack4中是默认开启的。

**对比使用效果**

现在有个文件分别是：
```javascript
// constant.js

export default 'Hello,Jack-cool';


// 入口文件 main.js
import str from './constant.js';
console.log(str);

```

未启用Scope Hoisting打包之后
```javascript
[
  (function (module, __webpack_exports__, __webpack_require__) {
    var __WEBPACK_IMPORTED_MODULE_0__constant_js__ = __webpack_require__(1);
    console.log(__WEBPACK_IMPORTED_MODULE_0__constant_js__["a"]);
  }),
  (function (module, __webpack_exports__, __webpack_require__) {
    __webpack_exports__["a"] = ('Hello,Jack-cool');
  })
]
```

在开启 Scope Hoisting 后

```javascript
[
  (function (module, __webpack_exports__, __webpack_require__) {
    var constant = ('Hello,Jack-cool');
    console.log(constant);
  })
]

```

从中可以看出开启 Scope Hoisting 后，函数申明由两个变成了一个，constant.js 中定义的内容被直接注入到了 main.js 对应的模块中。

这样做的好处是：

* 代码体积更小，因为函数申明语句会产生大量代码；
* 代码在运行时因为创建的函数作用域更少了，内存开销也随之变小。


Scope Hoisting 的实现原理其实很简单：分析出模块之间的依赖关系，尽可能的把打散的模块合并到一个函数中去，但前提是不能造成代码冗余。因此只有那些被引用了一次的模块才能被合并。

注意： 由于 Scope Hoisting 需要分析出模块之间的依赖关系，因此源码必须采用 ES6 模块化语句，不然它将无法生效。


## Writing a Loader

[文档链接](https://webpack.js.org/contribute/writing-a-loader/)

开发插件中一般会用到的工具库 `loader-utils` 和 `schema-utils`

`loader-utils` 有很多工具类方法 [具体配置项链接](https://github.com/webpack/loader-utils)

`schema-utils`用于参数校验

可以直接return 单个结果  多个结果可以使用`this.callback(err, values...)`

比如实现一个中文转unicode

```javascript
module.exports = function unicodeLoader(source) {
  const res = source.replace(/([\u0080-\uffff])/g, (str) => {
    let hex = str.charCodeAt().toString(16);
    for (let i = hex.length; i < 4; i += 1) {
      hex = `0${hex}`;
    }
    return `\\u${hex}`;
  })
  this.callback(null, res)
}
```

## Writing a Plugin

开发一个插件 必须是一个类，类中必须有一个apply 方法。 apply方法会有一个`compiler`参数。

然后通过监听hooks 进行操作 比如监听emit hook
```javascript
 compiler.hooks.emit.tapAsync('MyPlugin',(compilation,callback)=>{
     // 插件功能
 })
```

[文档链接](https://webpack.js.org/contribute/writing-a-plugin/)


## webpack核心原理
webpack本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是Tapable，webpack中最核心的负责编译的Compiler和负责创建bundles的Compilation都是Tapable的实例。

Tapable 提供了很多钩子函数 包含sync 和 async 的 供编写插件使用 有点事件监听的感觉 

Webpack 的运行流程是一个串行的过程,从启动到结束会依次执行以下流程 :

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数,得出最终的参数。
2. 开始编译：用上一步得到的参数初始化 Compiler 对象,加载所有配置的插件,执行对象的 run 方法开始执行编译。
  webpack的编译都按照下面的钩子调用顺序执行。
  * before-run 清除缓存
  * run 注册缓存数据钩子
  * before-compile
  * compile 开始编译
  * make 从入口分析依赖以及间接依赖模块，创建模块对象
  * build-module 模块构建
  * seal 构建结果封装， 不可再更改
  * after-compile 完成构建，缓存数据
  * emit 输出到dist目录
3. 确定入口：根据配置中的 entry 找出所有的入口文件。
  在webpack make钩子中, tapAsync注册了一个DllEntryPlugin, 就是将入口模块通过调用compilation.addEntry方法将所有的入口模块添加到编译构建队列中，开启编译流程。在addEntry 中调用_addModuleChain开始编译。在_addModuleChain首先会生成模块，最后构建。
  _addModuleChain调用buildModule方法进行编译代码，build中 其实是利用acorn编译生成AST 设计loader的加载使用
  在编译完成后，调用compilation.seal方法封闭，生成资源，这些资源保存在compilation.assets, compilation.chunk
4. 编译模块：从入口文件出发,调用所有配置的 Loader 对模块进行翻译,再找出该模块依赖的模块,再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。
5. 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后,得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。
6. 输出资源：根据入口和模块之间的依赖关系,组装成一个个包含多个模块的 Chunk,再把每个 Chunk 转换成一个单独的文件加入到输出列表,这步是可以修改输出内容的最后机会。
7. 输出完成：在确定好输出内容后,根据配置确定输出的路径和文件名,把文件内容写入到文件系统。


## webpack 热更新原理



<!-- https://mp.weixin.qq.com/s/TTIRDG15T3l5VDm8SrUZWg -->
 
## AST

<!-- https://mp.weixin.qq.com/s/ek97O_jKk5_bD2WBdd95Yw -->


## webpack5


2020年10月10号webpack5发布了，带了许多的变更。下面就聊一聊我所认识的对我有影响的点。（其实我就是看懂了哪些，哈哈哈哈）


本次重大发布的整体发展方向如下：

* 尝试用持久性缓存来提高构建性能。
* 尝试用更好的算法和默认值来改进长期缓存。
* 尝试用更好的 Tree Shaking 和代码生成来改善包大小。
* 尝试改善与网络平台的兼容性。
* 尝试在不引入任何破坏性变化的情况下，清理那些在实现 v4 功能时处于奇怪状态的内部结构。
* 试图通过现在引入突破性的变化来为未来的功能做准备，尽可能长时间地保持在 v5 版本上。



### 功能清除 

1. 清理已经废弃的功能

所有在webpack4标记即将过期的功能，都在该版本移除。所以再升级之前请确认没有废弃的功能点。

2. 不再为Node.js模块自动引用Polyfills

在webpack4及之前的版本，项目中有使用node.js内置模块会自动添加Polyfills；在webpack5中将不会再添加。如果你的项目中有需要用到请手动添加。

### 针对长期缓存的优化

1. 确定的Chunk、模块ID和导出名称

新增了长期的缓存的算法。这些算法在生产环境是默认开启的。

`chunkIds:"deterministic"` `moduleIds:"deterministic"` `mangleExports:"deterministic"`

该算法以确定性的方式为模块和分块分配短的（3 或 5 位）数字 ID，这是包大小和长期缓存之间的一种权衡。由于这些配置将使用确定的 ID 和名称，这意味着生成的缓存失效不再更频繁。

2. 真正的contenthash

在webpack5中将使用真正的文件内容哈希。之前的版本它"只"使用内容结构的哈希值。当只有注释被修改或者变量被重命名，这对长期缓存会有积极影响。这些变化在压缩后是不可见的。

### 构建优化

1. 嵌套的tree-shaking

webpack现在能够跟着对导出的嵌套属性的访问。这可以改善重新导出命名空间 对象时的 Tree Shaking（清除未使用的导出和混淆导出）。

```javascript
// inner.js
export const a = 1;
export const b = 2;

// module.js
export * as inner from './inner';
// 或 import * as inner from './inner'; export { inner };

// user.js
import * as module from './module';
console.log(module.inner.a);
```

在这个例子中，可以在生产模式下删除导出的b。

2. 内部模块tree-shaking

webpack4没有分析模块的导出和引用之间的依赖关系。webpack5中有一个新的选项`optimization.innerGrph`，在生产模式下是默认开启的，它可以对模块中的标志进行分析，找出导出和引用之间的依赖关系。

```javascript
import { something } from './something';

function usingSomething() {
  return something;
}

export function test() {
  return usingSomething();
}
```

内部依赖图算法会找出 something 只有在使用 test 导出时才会使用。这允许将更多的出口标记为未使用，并从代码包中省略更多的代码。

当设置`"sideEffects": false`时，可以省略更多的模块。在这个例子中，当 `test` 导出未被使用时，`./something` 将被省略。

3. commonJs tree-shaking

webpack 曾经不进行对 CommonJs 导出和 require() 调用时的导出使用分析。

webpack 5 增加了对一些 CommonJs 构造的支持，允许消除未使用的 CommonJs 导出，并从 require() 调用中跟踪引用的导出名称。

### 重大变更：长期未解决的问题

1. 单一文件目标的代码分割

只允许启动单个文件的目标（如 node、WebWorker、electron main）现在支持运行时自动加载引导所需的依赖代码片段。

这允许对这些目标使用 chunks: "all" 和 optimization.runtimeChunk。

2. 更新了解析器

`enhanced-resolve`更新到了v5版本，有以下改进：

* 追踪更多的依赖关系，比如丢失的文件
* 别名可能有多种选择
* 现在可以别名为`false`了
* 支持 exports 和 imports 字段等功能
* 性能提高

3. 没有JS的代码块

不包含 JS 代码的块，将不再生成 JS 文件。这就允许有只包含 CSS 的代码块。


### 主要的内部架构变更

1. 新的插件运行顺序

现在 webpack 5 中的插件在应用配置默认值之前就会被应用。这使得插件可以应用自己的默认值，或者作为配置预设。但这也是一个突破性的变化，因为插件在应用时不能依赖配置值的设置。

参考链接：[https://mp.weixin.qq.com/s/sh7rcv6hdhYfWr1bv_ssbg](https://mp.weixin.qq.com/s/sh7rcv6hdhYfWr1bv_ssbg)

2. 入口文件的新增配置

 webpack 5 中，入口文件除了字符串、字符串数组，也可以使用描述符进行配置了，如：
 
 ```javascript
module.exports = {
  entry: {
    catalog: {
      import: './catalog.js',
    },
  },
};
 ```

此外，也可以定义输出的文件名，之前都是通过 output.filename 进行定义的：
```javascript
module.exports = {
  entry: {
    about: { import: './about.js', filename: 'pages/[name][ext]' },
  },
};
```
3. Tapable 插件升级

webpack 3 插件的 compat 层已经被移除。它在 webpack 4 中已经被取消了。一些较少使用的 tapable API 被删除或废弃。

## babel

babel 的转译过程分为三个阶段：parsing、transforming、generating，以 ES6 代码转译为 ES5 代码为例，babel 转译的具体过程如下：

1. ES6 代码输入
2. babylon 进行解析得到 AST
3. plugin 用 babel-traverse 对 AST 树进行遍历转译,得到新的 AST 树
4. 用 babel-generator 通过 AST 树生成 ES5 代码