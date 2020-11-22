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
  1. 不独占一行，可与其它行内元素并行
  2. 设置宽高无效，默认宽度为内容宽度

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
  .clearfloat::after{
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

二、在结尾处添加空div标签使用clear:both属性
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
元素选择符 | 0001
class选择符 | 0010
id选择符 | 0100
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

```html
<div class="box">
 <span>垂直水平居中</span>
</div>
```

1. flex布局

```css
.box{
  display:flex;
  flex-derition:row;
  justifly-content:center;
  aligin-items:center;
}
```

2. 定位 

未知子元素宽高情况
```css
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

```css
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

```css
.box{
  display:table-cell;
  vertical-aligin:middle;
  text-align:center;
}
```

当然还有其他的方法可以实现垂直水平居中，常用的是这几种。

### 左右两栏布局 （左定宽、右自适应）

html 结构

```html
<div class="box">
	<div class="left">left</div>
	<div class="right">right</div>
</div>
```
1. 定位
```css
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

```css
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
``` css
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

```css
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

```css
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
```css
// html
<i class="left" ></div>
//css
.left{
 position: absolute;
}
.left::before,.left::after{
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

### 解决方案

#### 0.5px

在`IOS8+`,苹果系列都已经支持0.5px了，可以借助媒体查询来处理
```css
.border{border:1px solid red}
@media screen and (-webkit-min-device-pixel-ratio:2){
  .border{border:.5px solid red}
}
/*ios dpr=2和dpr=3情况下border相差无几，下面代码可以省略*/
@media screen and (-webkit-min-device-pixel-ratio: 3) {
    .border { border: 0.333333px solid #999 }
}
```
`IOS7`及以下和`Android`等其他系统里，0.5p将会显示为0px，那需要进行`Hack`处理

解决方案是通过JavaScript检测浏览器能否处理0.5px的边框，如果可以，给html标签元素添加个class。

```javascript
if(window.devicePixelRatio && devicePixelRatio >= 2){
  var elem = document.createElement('div')
  elem.style.border = '0.5px solid transparent'
  document.body.appendChild(elem)
  // 判断是否支持0.5属性  高度为1表示支持 如果为0就是不支持
  if(elem.offsetHeight ==1){
    document.querySelector('html').classList.add('hairlines')
  }
  document.body.removeChild(elem)
}


//css
div{
  border:1px solid red;
}
.hairlines div{
  border-width:0.5px
}
```

优点：简单，代码量少
缺点：无法兼容安卓设备、ios7以下设备

#### 伪类 + transform

原理：把原先元素的border去掉，然后利用:before或者:after重做border，并transform的scale缩小一半，原先的元素相对定位，新做的border绝对定位
```css
.border-1px, .border-top-1px, .border-bottom-1px, .border-left-1px, .border-right-1px{
  position: relative
}
.border-1px::after, .border-top-1px::after, .border-bottom-1px::after, .border-left-1px::after, .border-right-1px::after{
  background-color: #000000;
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  transform-origin: 0 0;
}
.border-1px::after {
    border: 1px solid gray;
}

@media(-webkit-min-device-pixel-ratio:2){
  .border-bottom-1px::after,.border-top-1px::after{
    transform:scaleY(0.5)
  }
  .border-left-1px:after,.border-right-1px::after{
    transform:scaleX(0.5)
  }
  .border-1px::after{
    width:200%;
    height:200%;
    transform:scale(0.5)
  }
}
@media (-webkit-min-device-pixel-ratio: 3)  {
    .border-bottom-1px::after, .border-top-1px::after {
        transform: scaleY(0.333);
    }

    .border-left-1px::after, .border-right-1px::after {
        transform: scaleX(0.333);
    }

    .border-1px::after {
        width: 300%;
        height: 300%;
        transform: scale(0.333);
    }
}
/*需要注意<input type="button">是没有:before, :after伪元素的*/
```

优点：所有场景都能满足，支持圆角(伪类和本体类都需要加border-radius)。
缺点：代码量也很大，对于已经使用伪类的元素(例如clearfix)，可能需要多层嵌套。

#### viewport + rem

原理:通过设置viewport的rem基准值

当`devicePixelRatio`等于2时，设置meta
```html
<meta name="viewport" content="width=device-width,initial-scale=0.5,maximum-scale=0.5,minmum-scale=0.5,user-scalable=no">
```
当`devicePixelRatio`等于3时，设置meta
```html
<meta name="viewport" content="width=device-width,initial-scale=0.333333,maxumum-scale=0.333333,minmum-scale=0.333333,user-scalavle=no">
```

示例
```javascript
var viewport = document.querySelector("meta[name=viewport]");
var dpr = window.devicePixelRatio || 1
var scale = 1 / dpr
viewport.setAttrivute("content","width=device-width,initial-scale="+scale+",maxumum-scale="+scale+",minmum-scale="+scale+",user-scalavle=no")

var doc = document.documentElement
var fontSize = 10 * (doc.clientWidth / 375) + 'px';
doc.style.fontSize = fontSize
```
详细的rem知识点可以查看[Flexible](https://github.com/amfe/article/issues/17)

优点：所有场景都能满足，一套代码，可以兼容基本所有布局。
缺点：老项目修改代价过大，只适用于新项目。

方法还有 border-image、background-image、 postcss-write-svg等 [参考链接](https://mp.weixin.qq.com/s/BZtfCAYvtEHf-ZKq4eB62g)

## 省略号的实现

### 单行省略号

```css
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
```

### 多行省略号

```css
overflow : hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 5;
-webkit-box-orient: vertical;
```

## link与@import的区别

1. 从属关系区别

@import是css提供的语法规则，只导入样式表的作用；

link是HTML标签，不仅可以加载css文件，还可以定义RSS、rel连接属性等

2. 加载顺序区别

加载页面时，link标签引入的css被同时加载

@import引入的css将在页面被加载完成后被加载

3. 兼容性区别

@import是css2.1才有的属性，所以可以在ie5以上被识别

link作为HTML标签，不存在兼容性

4. DOM可控性区别

可以通过JS来控制插入link标签来改变样式；由于DOM方法是基于文档的，无法使用@import的方式来插入标签

## CSS 性能优化

从两方面来说，分为实践型和建议性

### 实践型优化

1. 内联首屏关键CSS（Critial CSS）

性能优化中一个重要的指标----*首次有效绘制*（First Meaningful Paint,简称FMP）即指页面的首要内容出现在屏幕上的时间。这一指标影响用户看到页面前所需要等待的时间，而*内联首屏关键CSS*能减少这一时间。

许多同学习惯用link来引入外部CSS样式，或者在React、Vue等框架脚手架中很多CSS通过webpack打包之后也是通过link引入，虽然会做按需加载操作。但是需要知道的是直接将CSS内联到HTML文档中能是CSS更快速的下载。因为使用link引入外部CSS时，需要在HTML文档下载完成后才知道所需要的引用的CSS。内联是HTML加载完它也被加载了。

但是这种方法也有缺陷，在于内联的CSS不能过多，因为[TCP初始拥塞窗口](https://tylercipriani.com/blog/2016/09/25/the-14kb-in-the-tcp-initial-window)存在限制（TCP相关概念，通常是 14.6kB，压缩后大小），如果内联CSS后的文件超出了这一限制，系统就需要在服务器和浏览器之间进行更多次的往返。还有一点就是内联CSS不会被缓存。

在实际项目中，我们不需要自己手动提取首屏关键CSS，可以使用三方库例如：[criticalCSS](https://github.com/filamentgroup/criticalCSS)。

2. 异步加载CSS

CSS会阻塞渲染，在CSS文件请求、下载、解析完成之前，浏览器将不会渲染任何已处理的内容。有时，这种阻塞是必须的，因为我们并不希望在所需的CSS加载之前，浏览器就开始渲染页面。

* 通过JS手动插入link标签
* 将link元素的media属性设置为用户浏览器不匹配的媒体类型（或媒体查询），如media="print"，甚至可以是完全不存在的类型media="noexist"。对浏览器来说，如果样式表不适用于当前媒体类型，其优先级会被放低，会在不阻塞页面渲染的情况下再进行下载。
```html
<link rel="stylesheet" href="mystyles.css" media="noexist" onload="this.media='all'">
```

* 使用*rel=preload*属性来异步加载资源
```html
<link rel="preload" herf="xxx.css" as="style" onload="this.rel='stylesheet'">
```
注意，as是必须的。忽略as属性，或者错误的as属性会使preload等同于XHR请求，浏览器不知道加载的是什么内容，因此此类资源加载优先级会非常低


3. 文件压缩

文件的大小会直接影响浏览器的加载速度，这一点在网络较差时表现地尤为明显。相信大家都早已习惯对CSS进行压缩，现在的构建工具，如webpack、gulp/grunt、rollup等也都支持CSS压缩功能。压缩后的文件能够明显减小，可以大大降低了浏览器的加载时间。

4. 去除无用CSS

虽然文件压缩能够降低文件大小。但CSS文件压缩通常只会去除无用的空格。


一般情况下，会存在这两种无用的CSS代码：一种是不同元素或者其他情况下的重复代码，一种是整个页面内没有生效的CSS代码。

对于这两种情况手动去删除肯定是费时又费力，所以我们可以借用三方库[uncss](https://github.com/uncss/uncss)等来处理。

### 建议型优化

1. 有选择的使用选择器

CSS选择器的匹配是从右向左进行的,如果嵌套的层级更多，页面中的元素更多，那么匹配所要花费的时间代价自然更高。

建议：
* 不要使用嵌套过多过于复杂的选择器，建议不超过3层
* 通配符和属性选择器效率最低，需要匹配的元素最多，尽量减少使用


2. 减少使用昂贵的属性

在浏览器绘制屏幕时，所有需要浏览器进行操作或者计算的属性相对比都需要花费更大的代价。当页面发生重绘时，它们会降低浏览器的渲染性能。所以在编写CSS时，我们应该尽量减少使用昂贵属性，如box-shadow/border-radius/filter/透明度/:nth-child等。

3. 减少重排和重绘

* 减少重排

重排会导致浏览器重新计算整个文档，重新构建渲染树，这一过程会降低浏览器的渲染速度。如下所示，有很多操作会触发重排，我们应该避免频繁触发这些操作。
  1. 改变font-size和font-family
  2. 改变元素的内外边距
  3. 通过JS改变CSS类
  4. 通过JS获取DOM元素的位置相关属性（如width/height/left等）
  5. CSS伪类激活
  6. 滚动滚动条或者改变窗口大小

  此外，我们还可以通过[CSS Trigger](https://csstriggers.com/)查询哪些属性会触发重排与重绘。

* 减少重绘

当元素的外观（如color，background，visibility等属性）发生改变时，会触发重绘。在网站的使用过程中，重绘是无法避免的。不过，浏览器对此做了优化，它会将多次的重排、重绘操作合并为一次执行。不过我们仍需要避免不必要的重绘，如页面滚动时触发的hover事件，可以在滚动的时候禁用hover事件，这样页面在滚动时会更加流畅。

4. 不要使用@import

不建议使用@import主要有以下两点原因。

首先，使用@import引入CSS会影响浏览器的并行下载。使用@import引用的CSS文件只有在引用它的那个css文件被下载、解析之后，浏览器才会知道还有另外一个css需要下载，这时才去下载，然后下载后开始解析、构建render tree等一系列操作。这就导致浏览器无法并行下载所需的样式文件。

其次，多个@import会导致下载顺序紊乱。在IE中，@import会引发资源文件的下载顺序被打乱，即排列在@import后面的js文件先于@import下载，并且打乱甚至破坏@import自身的并行下载。



## 伪类和伪元素

### 伪类

伪类用于当已有元素处于某种状态时，为其添加对应的样式，这个状态是用户行为而动态变化的。

比如：
* hover
* link
* visited
等等

### 伪元素

伪元素用于创建一些不在文档中的元素，并为其添加样式。

比如：`:before`来为一个元素前添加一个文本，并为这个文本添加样式。用户虽然可以看到这些文本，但是这些文本不在文档树中。


**总结**

伪类的操作对象时文档树中已有的元素，而伪元素则创建一个文档树以外的元素。因此他们之间的区别在于：有没有创建一个文档树之外的元素。

CSS3 规范中要求使用双冒号`(::)` 表示伪元素，单冒号`(:)` 表示伪类


## CSS Grid


[CSS Grid 网格布局教程](http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)
