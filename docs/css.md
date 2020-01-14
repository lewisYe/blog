# CSS

## 盒模型

  盒模型分为标准盒模型 width = content 和 怪异盒模型(IE) width = content + padding + border
  可以通过box-sizing进行切换

  * content-box 默认值，只计算内容的高度，border和padding不计算入宽度之内
  * padding-box padding计算宽度之内
  * border-box border 和 padding 计算入宽度之内

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

  浮动和定位会脱离文档流

## 浮动

  ### 定义

  浮动的本质是让元素脱离正常流(文档流),向父容器的左边或者右边移动直到碰到包含容器的边（碰到容器的边指的是容器的padding内边。） 或者其他的浮动元素。文本和行内元素将环绕浮动元素。

  浮动的产生虽然有利于了布局，但是也带来了副作用。使用浮动之后会导致父元素的高度塌陷。因为浮动脱离了文档流，但是父元素没有脱离，所以不能被浮动元素撑大。

  ### 清除浮动

   一、万能清除法
  ```
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
```
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

```
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
BFC(Block formatting context)直译为"块级格式化上下文"。它是一个独立的渲染区域。只有Block-levelbox参与，它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。

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

```
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

```
1 html{font-size:62.5%;} 
2 body{font-size:12px;font-size:1.2rem ;} 
3 p{font-size:14px;font-size:1.4rem;}
```

#### vh、vw

相对于可是范围的高度和宽度，可视范围被均分为100单位的vh/vw;可视范围是指屏幕可见范围，不是父元素的，百分比是相对于包含它的最近的父元素的高度和宽度。

## 层叠上下文

## Flex 布局

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
