# CSS

## 盒模型

  盒模型分为标准盒模型 width = content 和 怪异盒模型(IE) width = content + padding + border
  可以通过box-sizing进行切换

  * content-box 默认值，只计算内容的高度，border和padding不计算入宽度之内
  * padding-box padding计算宽度之内(火狐特有)
  * border-box  border 和 padding 计算入宽度之内

## 文档流

  文档流指的是元素排版布局过程中，元素会默认自动从左往右，从上往下的流式排列方式。并最终窗体自上而下分成一行行，并在每行中从左至右的顺序排放元素。

  文档流分为两种等级：块级元素和行内元素

  #### 块级元素
  1. 独占一行，不能与其它元素并行
  2. 可以设置宽高
  3. 如果不设置宽度，默认为父级的宽度 既width：100%

  例如：div、h1等

  #### 行内元素
  1.不独占一行，可与其它行内元素并行
  2.设置宽高无效，默认宽度为内容宽度

  例如：span i等

  块级元素与行内元素可以相互转换，通过display属性

  浮动和定位会脱离文档流(relative 相对定位不脱离文档流)

## 浮动

  ### 定义

  浮动的本质是让元素脱离正常流(文档流),向父容器的左边或者右边移动直到碰到包含容器的边（碰到容器的边指的是容器的padding内边。） 或者其他的浮动元素。文本和行内元素将环绕浮动元素。

  浮动的产生虽然有利于了布局，但是也带来了副作用。使用浮动之后会导致父元素的高度塌陷。因为浮动脱离了文档流，但是父元素没有脱离，所以不能被浮动元素撑大。

  ### 清除浮动

   一、万能清除法
```javascript
  <div class="clearfloat">
    <div class="left">left</div>
    <div class="right">right</div>
  </div>

  // css
  .clearfloat:after{
      display:block;
      clear:both;
      content:"";
      visibility:hidden;
      height:0;
  }
  .clearfloat{
      zoom:1;
  }
  ```
  该方法支持大部分浏览器，缺点代码量过长，不好记忆。还是比较推荐使用。

二、在结尾处添加空div标签clear:both
```javascript
<div>
	<div class="left">left</div>
	<div class="right">right</div>
	<div class="clearfloat"></div>
</div>

// css
.clearfloat{
    clear:both;
}
```
该方法是添加一个空的div 利用clear 属性来清除浮动。如果页面中浮动效果过多的话，就会产生许多多余的div，不利于理解，所以不是很推荐。

三、父级div定义overflow:hidden

```javascript
<div class="clearfloat">
	<div class="left">left</div>
	<div class="right">right</div>
</div>
// css
.clearfloat{
  overflow:hidden;
}
```
该方法代码简单，但是具有一定的局限性，不能和position配合使用。所以也不是很推荐。

综上所述的三种方法中，第一种方法是比较推崇的。其实清楚浮动不光这三种方法还有许多其他的。比如：父元素定高、父元素overflow：auto、父元素一起浮动等 但都有一些弊端，这上述三种是比较常见的。


## BFC

### 定义
BFC(Block formatting context)直译为"块级格式化上下文"。它是一个独立的渲染区域。让内部元素和外部的元素相互隔离，使内外元素的互相不影响。

### 规则
1. 内部的Box会在垂直方向上，一个接一个的摆放
2. Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻的Box的margin会发生重叠
3. 每个元素的margin box的左边，与包含border box的左边相接触，即使存在浮动也是如此。
4. BFC的区域不会与float box 重叠
5. BFC是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也是如此。
6. 计算BFC的高度时，浮动元素也参与计算

### 生成条件

1. 根元素 `<html>`
2. float 属性值不为 none
3. position 属性值为 absolute 或者 fixed
4. display 属性值为 inline-block 、table-cell 、table-caption、flex、flex-inline等
5. overflow 属性值不为visible  

`overflow：hidden` 可以解决浮动问题 就是触发了BFC机制

## 选择器

### 分类

1. 标签选择器 如：body div 等
2. 类选择器
3. id选择器
4. 全局选择器 如： *号
5. 组合选择器 如：.head .head-logo
6. 后代选择器
7. 群组选择器
8. 继承选择器
9. 伪类选择器 如：a:link,a:hover
10. 字符串匹配的属性选择符(^ $ *三种，分别对应开始、结尾、包含)
11. 子选择器 如：div > p
12. 相邻兄弟选择器 如：h1 + p

### 权重

选择器 | 权重
-- | --
元素选择符 | 1
class选择符 | 10
id选择符 | 100
内联样式表 | 1000
1. !important 声明的样式优先级最高，如果冲突再进行计算。
2. 如果优先级相同，则选择最后出现的样式。
3. 继承得到的样式的优先级最低。

总结排序：!important > 行内样式>ID选择器 > 类选择器 > 标签 > 通配符 > 继承 > 浏览器默认属性；后写的会覆盖先写的样式


## 单位

### 绝对单位

* px: Pixel 像素
* pt: Points 磅
* pc: Picas 派卡
* in: Inches 英寸
* mm: Millimeter 毫米
* cm: Centimeter 厘米
* q: Quarter millimeters 1/4毫米

### 相对单位

* %: 百分比
* em: Element meter 根据文档字体计算尺寸
* rem: Root element meter 根据根文档（ body/html ）字体计算尺寸
* ex: 文档字符“x”的高度
* ch: 文档数字“0”的的宽度
* vh: View height 可视范围高度
* vw: View width 可视范围宽度
* vmin: View min 可视范围的宽度或高度中较小的那个尺寸
* vmax: View max 可视范围的宽度或高度中较大的那个尺寸

### 运算

使用 `calc` 属性进行四则运算

```javascript
div {
  width: calc(100% - 10px + 2rem)
}
```

### 单位比例

 1. `1in = 2.54cm = 25.4 mm = 101.6q = 72pt = 6pc = 96px`
 2. `1px=0.75pt`

### 常用单位

#### px - Pixel 像素

像素px相对于设备显示器屏幕分辨率而言

#### 百分比 %

相对于父元素宽度

#### em 

相对于当前文档对象内文本的字体尺寸而言，若未指定字体大小则继承自上级元素，以此类推，直至body，若body未指定则为浏览器大小。


#### rem

相对于根文档对象内文本的字体尺寸的字体尺寸而言，若未指定字体大小则继承为浏览器默认字体大小

```javascript
1 html{font-size:62.5%;} 
2 body{font-size:12px;font-size:1.2rem ;} 
3 p{font-size:14px;font-size:1.4rem;}
```

#### vh、vw

相对于可是范围的高度和宽度，可视范围被均分为100单位的vh/vw;可视范围是指屏幕可见范围，不是父元素的，百分比是相对于包含它的最近的父元素的高度和宽度。

## 层叠上下文

元素提升为一个比较特殊的图层，在三维空间中（z轴）高出普通元素

### 触发条件

* 根层叠上下文 html
* 定位 position属性为非static 并且设置z-index属性值
* css3属性
    * flex
    * transfrom
    * opacity
    * filter

### 层叠等级

层叠上下文在z轴的排列顺序

* 在同一个层叠上下文中，它描述定义的是该层叠上下文中的层叠上下文元素在z轴上的顺序

1. 普通元素的层叠等级优先由其所在的层叠上下文决定。
2. 层叠等级的比较只有在当前层叠上下文元素中才有意义。不同层叠上下文中比较层叠等级是没有意义的。


## Flex

### 定义 

Flex 是 Flexible Box 的缩写，顾名思义为“弹性布局”，用来为盒装模型提供最大的灵活性。

任何一个容器都可以指定为Flex布局。 使用`display:flex` 行内元素也可以使用`display:inline-flex`

### 基本概念

采用Flex布局的元素，称为Flex容器 （flex container）, 简称“容器”。它的所有子元素自动成为容器的成员，称为Flex项目 （flex item）,简称“项目”。

容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做main start，结束位置叫做main end；交叉轴的开始位置叫做cross start，结束位置叫做cross end。

项目默认沿主轴排列。单个项目占据的主轴空间叫做main size，占据的交叉轴空间叫做cross size。

### 容器属性

* flex-direction
* flex-warp
* flex-flow 
* justifly-content
* align-items
* align-content

#### flex-direction

flex-direction 属性决定主轴的方向，即项目的排列方向。具有4个属性值。

* row: 默认值。主轴为水平方向，起点在左端。
* row-reverse: 主轴为水平方向，起点在右端。
* column: 主轴为垂直方向，起点在上沿。
* column-reverse: 主轴为垂直方向，起点在下沿。

#### flex-warp

flex-warp 属性定义，项目在主轴方向上排列不下的时候，如何换行。

* nowarp：默认值 不换行
* warp: 换行，第一行在上面
* warp-reverse: 换行，第一行在下面


#### flex-flow

flex-flow 属性是 flex-direction 和 flex-warp 的简写形式，默认值为 row nowarp。

#### justifly-content

justifly-content 属性定义了项目在主轴的对齐方式。

* flex-start: 默认值，起点对齐
* flex-end: 终点对齐
* center: 居中
* space-between: 两端对齐，项目之间的间隔都相等。
* space-around: 每个项目两侧的间隔相等。所以项目之间的间隔比项目与边框的间隔大一倍。

#### align-items属性

align-items 属性定义项目在交叉轴上如何对齐。

* flex-start: 起点对齐
* flex-end: 终点对齐
* center: 居中
* baseline: 项目的第一行文字的基线对齐
* stretch: 默认值 如果项目未设置高度或者为auto，将占满整个容器的高度

#### align-content

align-content 属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

* flex-start：与交叉轴的起点对齐。
* flex-end：与交叉轴的终点对齐。
* center：与交叉轴的中点对齐。
* space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。
* space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
* stretch（默认值）：轴线占满整个交叉轴。

### 项目属性

* order
* flex-grow
* flex-shrink
* flex-basis
* flex
* align-self


#### order

order 属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。

#### flex-grow

flex-grow 属性 定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。

如果所有项目的flex-grow属性都为1，则它们将等分剩余空间（如果有的话）。如果一个项目的flex-grow属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍。

#### flex-shrink

flex-shrink 属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。

如果所有项目的flex-shrink属性都为1，当空间不足时，都将等比例缩小。如果一个项目的flex-shrink属性为0，其他项目都为1，则空间不足时，前者不缩小。

#### flex-basis

flex-basis属性定义了在分配多余空间之前，项目占据的主轴空间。浏览器根据这个属性，计算主轴是否有多余空间。默认是值 auto，即本来项目的大小。

它可以设为跟width或height属性一样的值（比如350px），则项目将占据固定空间。

#### flex

flex 是 flex-grow、flex-shrink、flex-basis 的简写。默认值 0 1 auto。后两个属性可选。

该属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto)。

建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值。

#### align-self

align-self属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。
属性值与align-items值相同，多增加了auto属性值。

### 注意点

flex 布局具有浏览器兼容问题 需要加上前缀；设为 Flex 布局以后，子元素的float、clear和vertical-align属性将失效。

## 经典布局

### 垂直水平居中

html 结构

```javascript
<div class="box">
 <span>垂直水平居中</span>
</div>
```

1. flex布局

```javascript
.box{
  display:flex;
  flex-derition:row;
  justifly-content:center;
  aligin-items:center;
}
```

2. 定位 

未知子元素宽高情况
```javascript
.box{
  position:relative;
}
.box span{
  position:absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%)
}
```

已知子元素宽高情况

```javascript
.box{
  position:relative;
}
.box span{
  position:absolute;
  left:50%;
  top:50%;
  margin-left:负的一半宽度；
  margin-top:负的一半高度；
}
```

3. table-cell

```javascript
.box{
  display:table-cell;
  vertical-aligin:middle;
  text-align:center;
}
```

当然还有其他的方法可以实现垂直水平居中，常用的是这几种。

### 左右两栏布局 （左定宽、右自适应）

html 结构

```javascript
<div class="box">
	<div class="left">left</div>
	<div class="right">right</div>
</div>
```
1. 定位
```javascript
.left{
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    width:200px;
}
.right{
    position:absolute;
    top:0;
    left:200px;
    right:0;
    bottom:0;
}
```
2. flex

```javascript
.box{
    display:flex;
}
.left{
   width:200px;
}
.right:{
    flex:1;
}
```
3. 浮动
```javascript
.left{
    float:left;
    width:200px;
}
.right{
    margin-left:200px;
}
```

## 动画

css 实现动画效果可以通过transition、tansform、animation等3个属性。

### transition

使用语法：`transition: property duration timing-function delay`; 默认值：all 0 ease 0。

1. transition-property

设置过渡效果的css属性名称，具有以下等值。
* none 表示没有属性获得过渡效果
* all 表示所有属性都将获得过渡效果
* property 表示css属性列表，多个属性用逗号隔开

2. transition-duration 

规定完成过渡效果需要多少秒或毫秒(s/ms)。

3. transition-timing-funtion

规定速度效果的速度曲线。默认 ease 还有linear、ease-in、ease-out、ease-in-out和cubic-bezier等

4. transition-delay

定义过渡效果何时开始。

### transform

transform 属性应用于2D 或 3D 转换。该属性允许我们能够对元素进行旋转、缩放、倾斜、移动等操作

使用语法：`transform: none|transform-functions`

#### 旋转

roate(): 通过指定的角度参数对原元素指定一个2D rotation （2D 旋转），需先有transfrom-origin属性的定义。transform-origin定义的是旋转的基点，其中angle是指旋转角度，如果设置的值为正数表示顺时针旋转，如果设置的值为负数表示逆时针旋转。例如：`transform:rotate(30deg)`

#### 缩放

用法：transform: scale(0.5) 或者 transform: scale(0.5, 2);一个参数时：表示水平和垂直同时缩放该倍率； 两个参数时：第一个参数指定水平方向的缩放倍率，第二个参数指定垂直方向的缩放倍率

#### 倾斜

transform: skew(30deg) 或者 transform: skew(30deg, 30deg);一个参数时：表示水平方向的倾斜角度；两个参数时：第一个参数表示水平方向的倾斜角度，第二个参数表示垂直方向的倾斜角度。

#### 移动

transform: translate(45px) 或者 transform: translate(45px, 150px);

一个参数时：表示水平方向的移动距离；两个参数时：第一个参数表示水平方向的移动距离，第二个参数表示垂直方向的移动距离。

###  基准点 transform-origin

在使用transform方法进行文字或图像的变形时，是以元素的中心点为基准点进行的。使用transform-origin属性，可以改变变形的基准点。

用法：transform-origin: 10px 10px;

共两个参数，表示相对左上角原点的距离，单位px

第一个参数表示相对左上角原点水平方向的距离，第二个参数表示相对左上角原点垂直方向的距离；

其中第一个参数也可以指定为left、center、right，第二个参数也可以指定为top、center、bottom。

这四种变形方法顺序可以随意，但不同的顺序导致变形结果不同，原因是变形的顺序是从左到右依次进行。

### animation

* animation-name 规定需要绑定到选择器的 keyframe 名称
* animation-duration 规定完成动画所花费的时间，以秒或毫秒计。
* animation-timing-function 规定动画的速度曲线。
* animation-delay 规定在动画开始之前的延迟。
* animation-iteration-count 规定动画应该播放的次数
* animation-direction 规定是否应该轮流反向播放动画

```javascript
@-webkit-keyframes anim1 {
	0% {
	opacity: 0;
	font-size: 12px;
	}
	100% {
	opacity: 1;
	font-size: 24px;
	}
}
.anim1Div {
-webkit-animation-name: anim1 ;
-webkit-animation-duration: 1.5s;
-webkit-animation-iteration-count: 4;
-webkit-animation-direction: alternate;
-webkit-animation-timing-function: ease-in-out;

}
transition 和 animation 区别 transition需要触发事件。
```

## css实现各种效果

### 三角形

三角形是利用border 来实现的。例如

```javascript
// html
<div class="example"></div>

//css 
.example{
  width:0;
  height:0;
  border-width:100px;
  border-style:solid;
  border-color:#000000 transparent transparent transparent;
}
```

##### 扩展

1.实现箭头 
变换思维你会发现箭头可以使用2个三角形叠加在一起颜色不同产生偏移量就可以了。
```javascript
// html
<i class="left" ></div>
//css
.left{
 position: absolute;
}
.left:before,.left:after{
 position: absolute;
 content: '';
 border-top: 10px transparent dashed;
 border-left: 10px transparent dashed;
 border-bottom: 10px transparent dashed;
 border-right: 10px #fff solid;
}
.left:before{
 border-right: 10px #0099CC solid;
}
.left:after{
 left: 1px; /*覆盖并错开1px*/
 border-right: 10px #fff solid;
}

```
## 移动端适配1px的问题

在移动端web开发中，UI设计稿中设置边框为1像素，前端在开发过程中如果出现border:1px，测试会发现在retina屏机型中，1px会比较粗，即是较经典的移动端1px像素问题

### 产生原因

1. 设备像素比 `dpr = window.devicePixelRatio` 也是就是设备的物理像素与逻辑像素的比值
2. 在retina屏的手机上，dpr为2或者3，那css里面写的1px映射到物理像素上就是2px或者3px

例如 iPhone6的dpr为2，物理像素是750（x轴）,它的逻辑像素为375。也就是说，1个逻辑像素，在x轴和y轴方向，需要2个物理像素来显示，即：dpr=2时，表示1个CSS像素由4个物理像素点组成。