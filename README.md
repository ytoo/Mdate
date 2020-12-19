## Mdate.js 是一款依托于iScroll.js的日期选择小型插件，可滑动选择年、月、日，只适用于移动端。支持显示yyyyMMdd  yyyyMM  yyyy格式


### 1、引入插件
```html

    <input type="text" id="dateSelectorOne" placeholder="选择日期" readonly data-year="" data-month="" data-day="">

    注：data-设置日期选择插件显示的默认时间

```
```js

    require("Mdate");

```

### 2、参数说明
```js 

    var MdateObj = new Mdate({ 
        el:"dateSelectorOne",//"dateSelectorOne"为你点击触发Mdate的id，必填项 建议是input输入框的id,当然其他元素也可以
        acceptId: "dateSelectorTwo", //此项为你选择日期后把数据回填的input输入框id 选填,不填时，可利用fCallback回调自行处理逻辑
        formatStyle: "yyyyMM",//此项为年月日页面显示UI样式，yyyy只显示年度，yyyyMM只显示年月，其他情况都是显示年月日
        beginYear: "2002",//此项为Mdate的初始年份，不填写默认为2000
        beginMonth: "10",//此项为Mdate的初始月份，不填写默认为1
        beginDay: "24",//此项为Mdate的初始日期，不填写默认为1
        endYear: "2017",//此项为Mdate的结束年份，不填写默认为当年
        endMonth: "1",//此项为Mdate的结束月份，不填写默认为当月
        endDay: "1",//此项为Mdate的结束日期，不填写默认为当天
        format: "-"//此项为Mdate需要显示的分隔格式，可填写"/"或"-"或".",不填写默认为"/"
        fCallback: function(){ //此项为Mdate的回调函数，可自定义处理业务逻辑

        }
    });

    // 注：如果实例化后，需要更新插件的起始截至年份，可以调用如下方法
    MdateObj.updateDate({beginYear:"",endYear:""});

```
::: tips 说明
本插件基于如下插件改进：https://www.jq22.com/jquery-info18385