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


