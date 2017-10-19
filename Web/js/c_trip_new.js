var _Trip = {
    s: 1,
    sCity: "",
    sCode: "",
    tCity: "",
    tCode: "",
    sDate: "",
    tDate: "",
    lowPrice: 0,
    lowZhekou: 0,
    allPrice: 0,
    isAfter: 1,
    jixing: ",d38,ERJ,CR2,MA6,AT7,CRJ,EM4,YN2,A330,DH8,EMB,145,",
    Init: function () {
        /*
        var json = { time: new Date().getTime() };
        window.history.pushState(json, "");
        window.onpopstate = function () {
            window.location = "c_index_home.html?selectType=1";
        }*/
        _Trip.s = _C.getParam("s");
        _Trip.initSelect();
        _Trip.initLayot();
    },
    initSelect: function () {
        if ($.cookie("Trip_select") != null) {
            _F = JSON.parse($.cookie("Trip_select"));
            if (_Trip.s == 2) {
                var tCode = _F.sCode;
                _F.sCode = _F.tCode;
                _F.tCode = tCode;
                var tCity = _F.sCity;
                _F.sCity = _F.tCity;
                _F.tCity = tCity;
            }
            $("title").text(_F.sCity + " - " + _F.tCity);
            $("#citySpan").find("span").eq(0).text(_F.sCity);
            $("#citySpan").find("span").eq(2).text(_F.tCity);
            _Trip.Select();
        }
        else {
            //alert($.cookie("Trip_select"));
            window.location = "c_index_home.html";
        }
    },
    initLayot: function () {
        $("#tripSpan").find("span").click(function () {
            var number = parseInt($(this).attr("data-type"));
            if (number == -1 && _F.isAfter == 0) {
                return false;
            }
            if (number == 99) {
                return false;
            }
            var date = new Date(_F.sDate);
            date.setDate(date.getDate() + number);
            _F.sDate = new Date(date).pattern("yyyy-MM-dd");
            _Trip.Select();
        });

        $("#btn_sort").find("div").click(function () {
            var n = $(this).attr("data-n");
            $("#btn_sort").find("div").css("background-color", "#dcdddd");
            $("#btn_sort").find("div").css("color", "#333");
            $(this).css("background-color", "#eeeeef");
            $(this).css("color", "#a72185");
            _Trip.sortTrip(n);
        });
    },
    Select: function () {
        $(".TripList").html("");
        $("#my-modal-loading").modal("open");
        var t = $("#fliht_template").html();
        var tc = $("#class_template").html();
        var date = _F.sDate;
        if (_Trip.s == 2) {
            date = _F.tDate;
        }
        $.ajax(
        {
            url: _C.AirUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 100, uid: _U.uid, openId: _U.openId, scity: _F.sCode, tcity: _F.tCode, date: _F.sDate, t: new Date() },
            success: function (o) {
                $("#my-modal-loading").modal("close");
                if (o.INFO.AIR != null) {
                    var a = o.INFO.AIR;
                    _F.aPrice = o.INFO.AIR.base_price;
                    var lowPrice = 0;
                    var sPort = "";
                    var tPort = "";
                    _Trip.lowPrice = 0;
                    _Trip.lowZhekou = 0;
                    _Trip.allPrice = _F.aPrice;
                    var flihtNum = 0;
                    var searchFlihtNum = 0;
                    if (eval(o.INFO.flight.length) == undefined) {
                        searchFlihtNum = 1;
                    }
                    else {
                        searchFlihtNum = o.INFO.flight.length;
                    }
                    for (var i = 0; i < searchFlihtNum; i++) {
                        var f = o.INFO.flight[i];
                        if (searchFlihtNum == 1) {
                            f = o.INFO.flight;
                        }
                        //航班信息
                        sPort = a.depart_city.toString().replace("机场", "").replace(_F.sCity, "");
                        if (sPort.length == 0) {
                            sPort = a.depart_city.toString().replace("机场", "");
                        }
                        tPort = a.arrive_city.toString().replace("机场", "").replace(_F.tCity, "");
                        if (tPort.length == 0) {
                            tPort = a.arrive_city.toString().replace("机场", "");
                        }
                        var tm = t.replace(/{sTime}/g, f.depart.toString().substr(0, 2) + ":" + f.depart.toString().substr(2, 2));
                        tm = tm.replace(/{sPort}/g, sPort);
                        if (f.depart_airport.length > 0) {
                            tm = tm.replace(/{sTemeinal}/g, "T" + f.depart_airport);
                        }
                        else {
                            tm = tm.replace(/{sTemeinal}/g, "");
                        }

                        tm = tm.replace(/{tTime}/g, f.arrive.toString().substr(0, 2) + ":" + f.arrive.toString().substr(2, 2));
                        tm = tm.replace(/{tPort}/g, tPort);
                        if (f.arrive_airport.length > 0) {
                            tm = tm.replace(/{tTemeinal}/g, "T" + f.arrive_airport);
                        }
                        else {
                            tm = tm.replace(/{tTemeinal}/g, "");
                        }

                        tm = tm.replace("{tax}", f.yq);
                        tm = tm.replace("{jj}", f.tax);
                        tm = tm.replace("{flihtName}", f.airlines_sname);

                        tm = tm.replace("{airCo}", f.airlines_sname);
                        tm = tm.replace("{airCoNo}", f.aircode);
                        tm = tm.replace(/{flihtNo}/g, f.aircode + f.flightnum);
                        tm = tm.replace("{plane}", f.equip);

                        var isBig = "大";
                        if (_Trip.jixing.indexOf("," + f.equip + ",") > -1) {
                            isBig = "小";
                        }
                        tm = tm.replace("{isBig}", isBig);

                        tm = tm.replace("{jixing}", f.equip + "(" + isBig + ")");

                        //仓位信息
                        var classInfo = "";
                        var isLow = true;
                        var cNum = 0;
                        var bgrule = "";
                        var tprule = "";
                        for (var j = 0; j < f.class.seat.length; j++) {
                            var c = f.class.seat[j];
                            var ps = c.status;
                            if (ps == "A" || !isNaN(ps)) {
                                if (c.price.length > 0 && parseInt(c.price) > 0) {
                                    cNum++;
                                    var cm = tc.replace(/{price}/g, c.price);
                                    var zk_show_s = parseFloat(c.discount / 10).toFixed(1) + "折";
                                    if (c.discount == 100) {
                                        zk_show_s = "全价";
                                        _F.aPrice = parseInt(c.price);
                                        _F.allPrice = parseInt(c.price);
                                        _Trip.allPrice = _F.allPrice;
                                    }
                                    if (c.discount > 100) {
                                        zk_show_s = "全价" + parseFloat(c.discount / 100).toFixed(1) + "倍";
                                    }
                                    cm = cm.replace(/{zhekou}/g, zk_show_s);
                                    if (!isNaN(ps)) {
                                        cm = cm.replace("{piaoshu}", "余" + ps + "张");
                                    }
                                    else {
                                        cm = cm.replace("{piaoshu}", "");
                                    }
                                    cm = cm.replace("{class}", c.code);
                                    cm = cm.replace("{cw}", c.class_name);
                                    cm = cm.replace("{flihtNo}", f.aircode + f.flightnum);
                                    bgrule = "";
                                    for (var key in c.cmt) {
                                        bgrule = c.cmt[key];
                                    }
                                    cm = cm.replace(/{bgrule}/g, bgrule);
                                    tprule = "";
                                    for (var key in c.refund) {
                                        tprule = c.refund[key];
                                    }
                                    cm = cm.replace(/{tprule}/g, tprule);
                                    if (parseInt(c.discount) > 100) {
                                        cm = cm.replace("{cangwei}", "");
                                    }
                                    else {
                                        cm = cm.replace("{cangwei}", "");
                                    }

                                    classInfo += cm;
                                    if (isLow) {
                                        //最低价格信息
                                        var zk_show = parseFloat(c.discount / 10).toFixed(1) + "折";
                                        if (c.discount == 100) {
                                            zk_show = "全价";
                                            _F.aPrice = parseInt(c.price);
                                            _F.allPrice = parseInt(c.price);
                                            _Trip.allPrice = _F.allPrice;
                                        }
                                        if (c.discount > 100) {
                                            zk_show = "全价" + parseFloat(c.discount / 100).toFixed(1) + "倍";
                                        }
                                        tm = tm.replace(/{lowPrice}/g, c.price.replace(".00", ""));
                                        tm = tm.replace("{lowZhekou}", zk_show);
                                        if (lowPrice == 0 || lowPrice > parseInt(c.price)) {
                                            lowPrice = parseInt(c.price);
                                        }
                                        if (_Trip.lowPrice == 0 || _Trip.lowPrice > lowPrice) {
                                            _Trip.lowPrice = lowPrice;
                                            _Trip.lowZhekou = c.discount;
                                        }
                                        isLow = false;
                                    }
                                }
                            } 
                        }
                        tm = tm.replace("{classList}", classInfo);
                        if (_Trip.s == 1 && _F.sType == 2) {
                            tm = tm.replace(/预定/g, "选择");
                        }
                        
                        if (cNum > 0) {
                            flihtNum++;
                            $(".TripList").append(tm);
                        }
                        
                    }

                    //最低价格1(周四)<em>￥298元</em>
                    if (_Trip.s == 2) {
                        $("#tripSpan").find("em").eq(0).text(_F.tDate.substr(5, 5) + " " + _C.getWeek(_F.tDate));
                        $("#tripSpan").find("em").eq(1).text("￥" + lowPrice);
                    }
                    else {
                        $("#tripSpan").find("em").eq(0).text(_F.sDate.substr(5, 5) + " " + _C.getWeek(_F.sDate));
                        $("#tripSpan").find("em").eq(1).text("￥" + lowPrice);
                    }
                    if (flihtNum == 0) {
                        $("#tripSpan").find("em").eq(0).text(_F.sDate.substr(5, 5) + " " + _C.getWeek(_F.sDate));
                        $("#tripSpan").find("em").eq(1).text("￥--");
                        $(".TripList").html("<div class='noResult'>抱歉，没有查询到" + _F.sCity + "-" + _F.tCity + "的机票，<br/>为您推荐中转出行，<br/>详询 <a class=\"am-icon-phone-square\" href='tel:4006660000'> 4006660000</a></div>");
                    }
                    
                    //处理前一天是否显示
                    var NowDate = new Date().pattern("yyyy-MM-dd");
                    var s = _C.dateDiff("D", NowDate, _F.sDate);
                    _F.isAfter = 1;
                    $("#tripSpan").find("span").eq(0).css("color", "#fff");
                    if (s == 0) {
                        $("#tripSpan").find("span").eq(0).css("color", "#bbb");
                        _F.isAfter = 0;
                    }

                    //退改签规定
                    $(".tgqrule").click(function () {
                        var bgrule = $(this).attr("data-bg");
                        var tprule = $(this).attr("data-tp");
                        $("#doc-modal-1").find("#bgrule").text(bgrule);
                        $("#doc-modal-1").find("#tprule").text(tprule);
                        $("#doc-modal-1").modal("open");
                    });

                    //低价提醒设置
                    $(".topPic").click(function () {
                        if (_Trip.s == 2) {
                            window.location = "c_set.html?s=" + _Trip.s + "&price=" + _Trip.lowPrice + "&zhekou=" + _Trip.lowZhekou + "&date=" + _F.tDate + "&allPrice=" + _Trip.allPrice;
                        }
                        else {
                            window.location = "c_set.html?s=" + _Trip.s + "&price=" + _Trip.lowPrice + "&zhekou=" + _Trip.lowZhekou + "&date=" + _F.sDate + "&allPrice=" + _Trip.allPrice;
                        }

                    });

                    $(".TripList").find("li .tripBar").click(function () {
                        var obj = $(this).parent().find(".infoList");
                        if ($(this).parent().attr("data-isHid") == "0") {
                            $(this).parent().find(".rightPrice").hide();
                            obj.show();
                            $(this).parent().attr("data-isHid", "1");
                        }
                        else {
                            $(this).parent().find(".rightPrice").show();
                            obj.hide();
                            $(this).parent().attr("data-isHid", "0");
                        }

                    });

                    $(".TripList").find("li .flihtInfo").click(function () {
                        var obj = $(this).parent().find(".infoList");
                        if ($(this).parent().attr("data-isHid") == "0") {
                            $(this).parent().find(".rightPrice").hide();
                            obj.show();
                            $(this).parent().attr("data-isHid", "1");
                        }
                        else {
                            $(this).parent().find(".rightPrice").show();
                            obj.hide();
                            $(this).parent().attr("data-isHid", "0");
                        }

                    });

                    $(".am-btn-warning").click(function () {
                        var price = $(this).attr("data-price");
                        var zhekou = $(this).attr("data-zhekou");
                        var classs = $(this).attr("data-class");
                        var flihtNo = $(this).attr("data-no");
                        var bgRule = $(this).attr("data-bg");
                        var tpRule = $(this).attr("data-tp");
                        
                        var cw = $(this).attr("data-cw");
                        var liObj = $("#F_" + flihtNo);
                        if (liObj != null) {
                            var flihtName = liObj.attr("data-flihtname");
                            var tax = liObj.attr("data-tax");
                            var jj = liObj.attr("data-jj");
                            var jixing = liObj.attr("data-jixing");
                            var sTime = liObj.attr("data-sTime");
                            var tTime = liObj.attr("data-tTime");
                            var sPort = liObj.attr("data-sPort");
                            sPort = sPort.replace(_F.sCity, "");
                            if (sPort.length == 0) {
                                sPort = _F.sCity;
                            }
                            var tPort = liObj.attr("data-tPort");
                            tPort = tPort.replace(_F.tCity, "");
                            if (tPort.length == 0) {
                                tPort = _F.tCity;
                            }
                            var sT = liObj.attr("data-sT");
                            var tT = liObj.attr("data-tT");
                            _F.sTime = sTime;
                            _F.tTime = tTime;
                            _F.sPort = sPort;
                            _F.tPort = tPort;
                            _F.sT = sT;
                            _F.tT = tT;
                            _F.flihtName = flihtName;
                            _F.tax = tax;
                            _F.jj = jj;
                            _F.jixing = jixing;
                        }
                        _F.cw = cw;
                        _F.price = price;
                        _F.zk = zhekou;
                        _F.flihtNo = flihtNo;
                        _F.cs = classs;
                        _F.bgrule = bgrule;
                        _F.tprule = tprule;
                        var s = JSON.stringify(_F);
                        var date = new Date();
                        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000)); //12小时过期
                        if (_Trip.s == 1) {
                            $.cookie("Trip_select", s, { path: '/', expires: date });
                            if (_F.sType == 2) {
                                _Trip.s = 2;
                                window.location = "c_trip.html?s=2";
                            }
                            else {
                                window.location = "c_order_new.html";
                            }
                        }
                        else {
                            $.cookie("Trip_select_back", s, { path: '/', expires: date });
                            window.location = "c_order.html";
                        }
                        
                    });
                }
                else {
                    $("#topBar").find(".am-u-sm-4").eq(0).html(_F.sDate.substr(5, 5) + "(" + _C.getWeek(_F.sDate) + ")<em>￥--元</em>");
                    $(".TripList").html("<div class='noResult'>抱歉，没有查询到" + _F.sCity + "-" + _F.tCity + "的机票，<br/>为您推荐中转出行，<br/>详询 <a class=\"am-icon-phone-square\" href='tel:4006660000'> 4006660000</a></div>");
                }
            }
        }
        );
    },
    sortTrip: function (n) {
        var arr = $(".TripList").find(".tripSort");
        if (n == 0) {
            arr.sort(function (a, b) {
                return parseInt($(a).attr("data-lowprice")) > parseInt($(b).attr("data-lowprice")) ? 1 : -1;
            });
        }
        else {
            arr.sort(function (a, b) {
                return $(a).attr("data-stime") > $(b).attr("data-stime") ? 1 : -1;
            });
        }
        $(".TripList").empty().append(arr);//清空原来内容添加排序后内容。

        $(".TripList").find("li .flihtInfo").click(function () {
            var obj = $(this).parent().find(".infoList");
            if ($(this).parent().attr("data-isHid") == "0") {
                $(this).parent().find(".rightPrice").hide();
                obj.show();
                $(this).parent().attr("data-isHid", "1");
            }
            else {
                $(this).parent().find(".rightPrice").show();
                obj.hide();
                $(this).parent().attr("data-isHid", "0");
            }

        });
    },
    initSearch: function () {

    }
}
