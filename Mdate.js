/**
* 
* [Mdate]
* @author 归零者二向箔
* @DateTime    2020-12-19
* @memberof    {Mdate}
* @version     [1.0]
* @description [日期选择 支持yyyyMMdd yyyyMM yyyy]
* @param       {Object} opts [配置项]
* 
*/
;(function () {
    var d = document;
    var includeCss = function (url) {
        var link = d.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = url;
        d.getElementsByTagName("head")[0].appendChild(link);
    };
    var loadJs = function (url){
        var script = d.createElement('script');
        script.type = "text/javascript";
        script.src = url;
        d.getElementsByTagName("head")[0].appendChild(script);
    };
    includeCss("css/Mdate.css");
    loadJs("iScroll.js");
    var dateopts = {
        beginYear: 2000,
        beginMonth: 1,
        beginDay: 1,
        endYear: new Date().getFullYear(),
        endMonth: new Date().getMonth() + 1,
        endDay: new Date().getDate(),
        format: "/",
        fCallback:"",
        formatStyle:""
    };
    var MdSelectId = "";
    var MdAcceptId = "";
    var dateContentBox = "";
    var datePlugs = "";
    var yearTag = "";
    var monthTag = "";
    var dayTag = "";
    var indexY = 1;
    var indexM = 1;
    var indexD = 1;
    var initM = null;
    var initD = null;
    var yearScroll = null;
    var monthScroll = null;
    var dayScroll = null;
    Mdate = function (opts) {
        if (!opts) {
            opts = {};
        }
        this.id = opts.el;
        this.selectorId = d.getElementById(this.id);
        this.acceptId = d.getElementById(opts.acceptId) || "";
        this.beginYear = opts.beginYear || dateopts.beginYear;
        this.beginMonth = opts.beginMonth || dateopts.beginMonth;
        this.beginDay = opts.beginDay || dateopts.beginDay;
        this.endYear = opts.endYear || dateopts.endYear;
        this.endMonth = opts.endMonth || dateopts.endMonth;
        this.endDay = opts.endDay || dateopts.endDay;
        this.format = opts.format || dateopts.format;
        this.fCallback = opts.fCallback || dateopts.fCallback;
        this.formatStyle = opts.formatStyle || dateopts.formatStyle;
        this.dateBoxShow();
    };
    Mdate.prototype = {
        constructor: Mdate,
        dateBoxShow: function () {
            var that = this;
            that.selectorId.onclick = function () {
                that.createDateBox();
                that.dateSure();
            };
            that.selectorId.onfocus = function(){
                document.activeElement.blur();
            }
        },
        createDateBox: function () {
            var that = this;
            MdatePlugin = d.getElementById("MdatePlugin");
            if (!MdatePlugin) {
                dateContentBox = d.createElement("div");
                dateContentBox.id = "MdatePlugin";
                d.body.appendChild(dateContentBox);
                MdatePlugin = d.getElementById("MdatePlugin")
            }
            MdatePlugin.setAttribute("class", "slideIn");
            that.createDateUi();
            var yearUl = d.getElementById("yearUl");
            var monthUl = d.getElementById("monthUl");
            var dayUl = d.getElementById("dayUl");
            yearUl.innerHTML = that.createDateYMD("year");
            that.initScroll();
            that.refreshScroll();
        },
        createDateUi: function () {
            var that = this;
            var dateStr = '';
            if(that.formatStyle == "yyyy"){
                dateStr = '<div id="yearwrapper"><ul id="yearUl" class="yt-mgr40"></ul></div>';
            } else if(that.formatStyle == "yyyyMM"){
                dateStr = '<div id="yearwrapper"><ul id="yearUl"></ul></div>' + '<div id="monthwrapper"><ul id="monthUl" class="yt-mgr40"></ul></div>';
            } else {
                dateStr = '<div id="yearwrapper"><ul id="yearUl"></ul></div>' + '<div id="monthwrapper"><ul id="monthUl"></ul></div>' + '<div id="daywrapper"><ul id="dayUl"></ul></div>';
            }
            var str = '' + '<section class="getDateBg"></section>' + 
            '<section class="getDateBox" id="getDateBox">' + 
            '<div class="choiceDateTitle"><button id="dateCancel">取消</button><button id="dateSure" class="fr">确定</button></div>' + 
            '<div class="dateContent">' + 
            '<div class="checkeDate"></div>' + 
            '<div class="mdate-flex">' + 
            dateStr + 
            '</div>' + 
            '</div>' + 
            '</section>';
            MdatePlugin.innerHTML = str;
        },
        createDateYMD: function (type) {
            var that = this;
            var str = "<li>&nbsp;</li>";
            var beginNum = null,
                endNum = null,
                unitName = "年",
                dataStyle = "data-year";
            if (type == "year") {
                beginNum = that.beginYear;
                endNum = that.endYear;
            }
            if (type == "month") {
                unitName = "月";
                dataStyle = "data-month";
                beginNum = that.beginMonth;
                endNum = 12;
                if (yearTag != that.beginYear) {
                    beginNum = 1;
                }
                if (yearTag == that.endYear) {
                    endNum = that.endMonth;
                }
            }
            if (type == "day") {
                unitName = "日";
                dataStyle = "data-day";
                beginNum = 1;
                endNum = new Date(yearTag, monthTag, 0).getDate();
                if (yearTag == that.beginYear && monthTag == that.beginMonth) {
                    beginNum = that.beginDay;
                }
                if (yearTag == that.endYear && monthTag == that.endMonth) {
                    endNum = that.endDay;
                }
            }
            for (var i = beginNum; i <= endNum; i++) {
                str += "<li " + dataStyle + "=" + i + ">" + that.dateForTen(i) + unitName + "</li>";
            }
            return str + "<li>&nbsp;</li>";
        },
        initScroll: function () {
            var that = this;
            yearScroll = new iScroll("yearwrapper", {
                snap: "li",
                vScrollbar: false,
                onScrollEnd: function () {
                    indexY = Math.ceil(this.y / 40 * -1 + 1);
                    yearTag = yearUl.getElementsByTagName("li")[indexY].getAttribute("data-year");
                    if(that.formatStyle != "yyyy"){
                        monthUl.innerHTML = that.createDateYMD("month");
                        monthScroll.refresh();
                        try {
                            monthTag = monthUl.getElementsByTagName("li")[indexM].getAttribute("data-month")
                        } catch (err) {
                            return true;
                        }
                    }
                    if(that.formatStyle != "yyyy" && that.formatStyle != "yyyyMM"){
                        dayUl.innerHTML = that.createDateYMD("day");
                        dayScroll.refresh();
                        try {
                            dayTag = dayUl.getElementsByTagName("li")[indexD].getAttribute("data-day");
                        } catch (err) {
                            return true;
                        }
                    }
                    
                }
            });
            if(that.formatStyle != "yyyy"){
                monthScroll = new iScroll("monthwrapper", {
                    snap: "li",
                    vScrollbar: false,
                    onScrollEnd: function () {
                        indexM = Math.ceil(this.y / 40 * -1 + 1);
                        if (indexM == 1 && yearTag != that.beginYear) {
                            monthTag = 1;
                        } else {
                            monthTag = monthUl.getElementsByTagName("li")[indexM].getAttribute("data-month");
                        }
                        if(that.formatStyle != "yyyy" && that.formatStyle != "yyyyMM"){
                            dayUl.innerHTML = that.createDateYMD("day");
                            dayScroll.refresh();
                            try {
                                dayTag = dayUl.getElementsByTagName("li")[indexD].getAttribute("data-day");
                            } catch (err) {
                                return true;
                            }
                        }
                        
                    }
                });
            }
            if(that.formatStyle != "yyyy" && that.formatStyle != "yyyyMM"){
                dayScroll = new iScroll("daywrapper", {
                    snap: "li",
                    vScrollbar: false,
                    onScrollEnd: function () {
                        indexD = Math.ceil(this.y / 40 * -1 + 1);
                        if (indexD == 1 && monthTag != that.beginMonth) {
                            dayTag = 1;
                        } else {
                            dayTag = dayUl.getElementsByTagName("li")[indexD].getAttribute("data-day");
                        }
                    }
                });
            }
        },
        refreshScroll: function () {
            var that = this;
            var inputYear = that.selectorId.getAttribute("data-year");
            var inputMonth = that.selectorId.getAttribute("data-month");
            var inputDay = that.selectorId.getAttribute("data-day");
            inputYear = inputYear || that.beginYear;
            inputMonth = inputMonth || that.beginMonth;
            inputDay = inputDay || that.beginDay;
            initM = that.beginMonth;
            initD = that.beginDay;
            if (inputYear != that.beginYear && initM != 1) {
                initM = 1;
            }
            if (inputMonth != that.beginMonth && initD != 1) {
                initD = 1;
            }
            inputYear -= that.beginYear;
            inputMonth -= initM;
            inputDay -= initD;
            yearScroll.refresh();
            yearScroll.scrollTo(0, inputYear * 40, 300, true);
            if(that.formatStyle != "yyyy"){
               monthScroll.scrollTo(0, inputMonth * 40, 300, true);
            }
            if(that.formatStyle != "yyyy" && that.formatStyle != "yyyyMM"){
               dayScroll.scrollTo(0, inputDay * 40, 300, true);
            }
        },
        dateSure: function () {
            var that = this;
            var sureBtn = d.getElementById("dateSure");
            var cancelBtn = d.getElementById("dateCancel");
            sureBtn.onclick = function () {
                var dateVlue = "";
                if (that.formatStyle == "yyyy") {
                    dateVlue = yearTag;
                } else if(that.formatStyle == "yyyyMM") {
                    dateVlue = yearTag + that.format + that.dateForTen(monthTag);
                } else {
                    dateVlue = yearTag + that.format + that.dateForTen(monthTag) + that.format + that.dateForTen(dayTag);
                }
                if(that.acceptId){
                    that.acceptId.value = dateVlue;
                }
                that.selectorId.setAttribute("data-year", yearTag);
                that.selectorId.setAttribute("data-month", monthTag);
                that.selectorId.setAttribute("data-day", dayTag);
                typeof that.fCallback == "function"?that.fCallback(dateVlue):"";
                that.dateCancel();
            };
            cancelBtn.onclick = function () {
                that.dateCancel();
            }
        },
        dateForTen: function (n) {
            n = +n;
            if (n < 10) {
                return "0" + n;
            } else {
                return n;
            }
        },
        dateCancel: function () {
            MdatePlugin.setAttribute("class", "slideOut");
            setTimeout(function () {
                MdatePlugin.innerHTML = "";
            }, 400)
        },
        updateDate: function (dateobj) {
            var that = this;
            that.beginYear = dateobj.beginYear || that.beginYear;
            that.endYear = dateobj.endYear || that.endYear;
        }
    };
    
    if (typeof exports !== "undefined") {
        exports.Mdate = Mdate;
    } else {
        window.Mdate = Mdate;
    }
})();