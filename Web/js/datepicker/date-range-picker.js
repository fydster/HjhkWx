var _DRP = {
    begin: "",
    end: "",
    dayCount: 1,
    _currType:0,
    _callback: null,
    _calssname: null,
    MaxEnableDay :28,
    init: function (objClass, __callback, _begin, _end,_priceDate) {       
        var dp = $("." + objClass);
        _DRP.begin = _begin;
        _DRP.end = _end;
        _DRP._calssname = objClass;
        _DRP._callback = __callback;
        _DRP._currType = 0; 
        _DRP.initDate(dp, _priceDate);
        dp.show();       
        //statu bar back event handler
        var json = { time: new Date().getTime() };
        window.history.pushState(json, "");
        controlId = 1001;      
    },
    hide: function () {
        var dp = $("." + _DRP._calssname);
        dp.empty();
        dp.hide();
    },
    initDate: function (obj,pObj) {
        var weekTitleArray = ['日', '一', '二', '三', '四', '五', '六'];
        var html = "<div class='week-row'><div class='weui-flex'>";
        $(weekTitleArray).each(function (i, item) {
            html +='<div class="week-item weui-flex__item">' + item + '</div>';
        });
        html += '</div></div>'
        obj.append(html);
        var beginOn = new Date();
        beginOn = new Date(beginOn.getFullYear(), beginOn.getMonth(), 1);
        var monthCount = 3;
        if (_DRP._currType == 1) { monthCount = 2; }

        var blankMonth = 0;
        for (var i = 0; i < monthCount; i++) {
            var _beginOn = beginOn;
            var countDays = 30;
            var _month = new Date(_beginOn).getMonth() + 1;            
            for (var j = 1; j <= 31; j++) {
                beginOn = new Date(addDate(1, beginOn.fmt("yyyy-MM-dd")));
                var currMonth = beginOn.getMonth() + 1;
                if (currMonth > _month) {
                    countDays = j;
                    break;
                }
            }
            _DRP.initMonth(obj, _beginOn, countDays, i - blankMonth, pObj);
        }
        obj.append(html);
        $(".date-item").not(".date-disable").on("click", _DRP.chooseItem);
        obj.find(".arrow").on("click", function () { obj.hide(); $(".page").show(); });
        //_DRP.setDefault();
    },
    setDefault: function () {
        //默认值
        if (_DRP._currType == 0) {
            var _bobj = $(".date-item[data-val=" + _DRP.begin + "]");
            if (!_bobj.hasClass("date-choose")) {
                _bobj.addClass("date-choose");
                _bobj.append("<span>入住</span>")
            }
        } else if (_DRP._currType == 1) {
            var _eobj = $(".date-item[data-val=" + _DRP.end + "]");
            if (!_eobj.hasClass("date-choose")) {
                _eobj.addClass("date-choose");
                _eobj.append("<span>离店</span>")
            }
        }
    },
    chooseItem: function () {
        var cdate = $(this).attr("data-val");
        var price = $(this).attr("data-price");
        $(".date-choose").removeClass('date-choose');
        $(this).addClass("date-choose");
        if (_DRP._currType == 0) {
            _DRP.begin = cdate;
            //$(this).append("<span>入住</span>")    
        }
        else if (_DRP._currType == 1) {
            _DRP.end = cdate;
            //$(this).append("<span>离店</span>")    
        }
        if (dateSub(_DRP.begin, _DRP.end) <= 0) {
            _DRP.end = addDate(1, _DRP.begin);
        }

        var dayCount = dateSub(_DRP.begin, _DRP.end)
        _DRP.callback(_DRP.begin, _DRP.end, price, _DRP._currType);
    },
    callback: function (begin, end, daycount) {
        _DRP._callback(begin, end, daycount);
        _DRP.begin = "", _DRP.end = "";
        $("." + _DRP._calssname).empty();
    },
    initMonth: function (obj, begin, countDays, index, pObj) {
        var begin_week = begin.getDay();
        var weekN = parseInt((begin_week + countDays) / 7) + ((begin_week + countDays) % 7 == 0 ? 0 : 1);
        var m = 0;
        var html = '<div class="month-card"><div class="month-title" style="' + (index==0?"padding-top:3rem;":"") + '">' + format_YM(begin) + '</div>';
        for (var i = 0; i < weekN; i++) {            
            html += '<div class="date-row weui-flex">'            
            for (var j = 0; j < 7; j++) {
                if ((i == 0 && j < begin_week) || (i + 1 == weekN && m >= countDays)) {
                    html += '<div class="date-item weui-flex__item"></div>'
                }
                else {  
                    try {
                        var currDate = new Date(addDate(m, formatDate(begin)));                       
                        m++;
                        var subDays = 0;
                        var endDays = 0;
                        endDays = dateSub(new Date(_DRP.end).fmt("yyyy-MM-dd"), currDate.fmt("yyyy-MM-dd"));

                        if (_DRP._currType == 0) {
                            subDays = dateSub(new Date().fmt("yyyy-MM-dd"), currDate.fmt("yyyy-MM-dd"));
                        } else if (_DRP._currType == 1) {
                            subDays = dateSub(_DRP.begin, currDate.fmt("yyyy-MM-dd"));
                        }

                        var istoday = dateSub(new Date().fmt("yyyy-MM-dd"), currDate.fmt("yyyy-MM-dd")) == 0;
                        var currWeek = currDate.getDay();
                        var isweek = currWeek == 0 || currWeek == 6;
                        var dayStr = formatDate(currDate); 

                        var isDisable = false;
                        if (_DRP._currType == 1 && dateSub(_DRP.begin, currDate.fmt("yyyy-MM-dd")) > _DRP.MaxEnableDay) { isDisable = true; }

                        if (subDays < 0) {
                            html += ' <div data-val="' + dayStr + '" class="date-item weui-flex__item date-disable">' + currDate.getDate() + '</div>'
                        }
                        else if (subDays == 0) {
                            if (istoday) {
                                html += ' <div data-val="' + dayStr + '" class="date-item weui-flex__item  date-disable ' + (isweek ? 'date-week' : '') + '">今天</div>'
                            }
                            else {
                                html += ' <div data-val="' + dayStr + '" class="date-item weui-flex__item  date-disable ' + (isweek ? 'date-week' : '') + '">' + currDate.getDate() + '</div>'
                            }
                        }
                        else if (subDays > 0) {
                            if (endDays > 0) {
                                html += ' <div data-val="' + dayStr + '" class="date-item weui-flex__item date-disable">' + currDate.getDate() + '</div>'
                            }
                            else {
                                var priceshow = 0;
                                for (var pi = 0; pi < pObj.length; pi++) {
                                    if (dayStr == pObj[pi].departDate) {
                                        priceshow = pObj[pi].salePrice;
                                    }
                                }
                                html += '<div data-price="' + priceshow + '" data-val="' + dayStr + '" class="date-item weui-flex__item ' + (isweek && !isDisable ? 'date-week' : '') + (isDisable ? ' date-disable' : '') + '">' + currDate.getDate() + '<span><em>￥</em>' + priceshow + '</span></div>';
                            }
                            
                        }
                    }
                    catch (e) {
                        alert(e);
                        break;
                    }
                }
            }
            html += '</div>'
        }
        html += '</div>';
        obj.append(html);
    }
};