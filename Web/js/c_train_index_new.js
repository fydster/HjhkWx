﻿var _Index = {
    sCity: "太原",
    sCode: "taiyuan",
    tCity: "北京",
    tCode: "beijing",
    type: 0,
    isOpenInfo: 0,
    airHotCity: "",
    trainHotCity: "",
    selectType: 0,
    Init: function () {
        //_Index.InitWxInfo();
        _Index.initLayot();
        _C.initWx();
        var selectType = _C.getParam("selectType");
        if (selectType.length > 0) {
            _Index.selectType = selectType;
        }
        window.onpopstate = function () {
            if (_Index.isOpenInfo == 1) {
                $("#Div_DatePanel").show();
                $(".bt-Logo").show();
                $("#Div_City").hide();
                $("#Div_CityPanel").hide();
                $(".HisTrip").show();
                $("#Div_ZMJS").hide();
                $("#Div_ZM").hide();
                $("#bottomMenu").show();
                $("#topMenu").show();
                _Index.isOpenInfo = 2;
            }
        }
    },
    InitWxInfo: function () {
        if (_B.source.length == 0) {
            var bCookie = $.cookie("_BasicForUrl");
            _B = JSON.parse(bCookie);
        }
        if (_B.source.length == 0) {
            return;
        }
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 6, sourceStr: _B.source, t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                    if (o.Info != null) {
                        $("title").text(o.Info.sName);
                        _Index.sCity = o.Info.sCity;
                        _Index.sCode = o.Info.cityCode;
                        $(".City").eq(0).text(o.Info.sCity);
                    }
                }

            }
        }
        );
    },
    initLayot: function () {
        var date = new Date().pattern("yyyy-MM-dd");
        var NowDate = _C.dateAdd(date, "D", 1);
        var dateInfo = new Date(NowDate).pattern("M月dd日")
        var week = _C.getWeek(NowDate);
        $("#sDate").text(dateInfo);
        $("#sDate").attr("data-date", NowDate);
        $(".week").text(week);


        $("#topMenu").find("a").css("font-size", "0.9rem");
        $("#topMenu").find("a").css("font-weight", "600");
        $("#topMenu").find("a").css("color", "#888");
        $("#topMenu").find(".weui-bar__item--on").css("background-color", "#ffffff");
        $("#topMenu").find(".weui-bar__item").css("background-color", "#ffffff");
        $("#topMenu").find(".weui-bar__item--on").css("color", "#ba3987");

        $("#topMenu").find("a").click(function () {
            var btnName = $(this).attr("data-name");
            $("#btn_selectDc").text(btnName + "查询");

            var type = $(this).attr("data-type");
            _Index.selectType = type;
            _Index.initStartCity();
            var midMenu = $(".midMenu").find(".weui-flex__item");
            $(".midMenu").find(".weui-flex__item").hide();
            if (type == 0 || type == 2) {
                midMenu.eq(0).show();
                midMenu.eq(1).show();
                midMenu.eq(4).show();
                midMenu.eq(5).show();
                $(".cityDesp").eq(0).text("出发车站");
                $(".cityDesp").eq(1).text("到达车站");
            }
            else {
                midMenu.eq(0).show();
                midMenu.eq(1).show();
                midMenu.eq(2).show();
                midMenu.eq(3).show();
                $(".cityDesp").eq(0).text("出发地");
                $(".cityDesp").eq(1).text("目的地");
            }

            $("#HotCityList").find("li").each(function (i) {
                var obj = $("#HotCityList").find("li")[i];
                if ($(obj).attr("data-type") == "1") {
                    if (type == 1) {
                        $(obj).show();
                    }
                    else {
                        $(obj).hide();
                    }
                }
                else {
                    if (type == 1) {
                        $(obj).hide();
                    }
                    else {
                        $(obj).show();
                    }
                }
            });

            $("#topMenu").find("a").removeClass("weui-navbar-onborder");
            $("#topMenu").find("a").css("color", "#666666");
            $(this).addClass("weui-navbar-onborder");
            $(this).css("color", "#ba3987");
            $("#topMenu").find("a").each(function () {
                $(this).find("img").attr("src", $(this).attr("data-default"));
            });
            $(this).find("img").attr("src", $(this).attr("data-on"));
        });

        $('.banner').unslider({
            autoplay: true,
            nav: false,
            arrows: false
        });

        $("#sDate").click(function () {
            $("#sDate_panel").calendar({
                minDate: "2017-04-26",
                onChange: function (p, values, displayValues) {
                    var showDate = new Date(values).pattern("MM月dd日");
                    var week = _C.getWeek(values);
                    $("#sDate").text(showDate);
                    $("#sDate").attr("data-date", values);
                    $(".week").text(week);
                    $("#bottomMenu").show();
                    $.closePopup();
                }
            });
            $("#bottomMenu").hide();
            $("#caledar").popup();
        });

        $("#btn_selectDc").click(function () {
            if (_Index.selectType == 1) {
                _Index.ToSelectAir();
            }
            else {
                _Index.ToSelect();
            }
            
        });

        $("#btn_exchange").click(function () {
            var tempC = $(".City").eq(0).text();
            var tempT = $(".City").eq(1).text();
            $(".City").eq(0).text(tempT);
            $(".City").eq(1).text(tempC);
            tempC = _Index.sCity;
            tempT = _Index.tCity;
            _Index.sCity = tempT;
            _Index.tCity = tempC;
            tempC = _Index.sCode;
            _Index.sCode = _Index.tCode;
            _Index.tCode = tempC;
        });

        $(".City").click(function () {
            var type = $(this).attr("data-type");
            _Index.initHotCityList();
            _Index.initHis();
            wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    var latLng = new qq.maps.LatLng(latitude, longitude);
                    //对指定经纬度进行解析
                    var geocoder = new qq.maps.Geocoder();
                    geocoder.getAddress(latLng);
                    //设置服务请求成功的回调函数
                    geocoder.setComplete(function (result) {
                        //alert(result.detail.address);
                        //alert(result.detail.addressComponents.city);
                        //alert(result.detail.addressComponents.province);
                        var city = result.detail.addressComponents.city;
                        city = city.toString().substr(0, city.length - 1);
                        $("#NowCity").find("li span").text(city);
                        if (_Index.selectType == 1) {
                            var o = $("#cityDataForAir").data("cityDataForAir");
                            o = JSON.parse(o);
                            for (var i = 0; i < o.List.length; i++) {
                                var oi = o.List[i];
                                for (var j = 0; j < oi.city.length; j++) {
                                    oj = oi.city[j];
                                    if (oj.cityName == city) {
                                        $("#NowCity").find("li").attr("data-name", city);
                                        $("#NowCity").find("li").attr("data-code", oj.code);
                                        $("#NowCity").find("li").click(function () {
                                            $("#Div_CityPanel").hide();
                                            $("#bottomMenu").show();
                                            $("#topMenu").show();
                                            $("#Div_ZMJS").hide();
                                            $("#Div_ZM").hide();
                                            var cityName = $(this).attr("data-name");
                                            var code = $(this).attr("data-code");
                                            if (_Index.type == 0) {
                                                _Index.sCity = cityName;
                                                _Index.sCode = code;
                                            }
                                            else {
                                                _Index.tCity = cityName;
                                                _Index.tCode = code;
                                            }
                                            $(".City").eq(_Index.type).text(cityName);
                                            $("#Div_ZMJS_N").show();
                                            $("#input_search").val("");
                                            $(".CityList").html("");
                                        });
                                        break;
                                    }
                                }
                            }
                        }
                        else {
                            var o = $("#cityData").data("cityData");
                            for (var or in o.stations) {
                                var oi = o.stations[or];
                                if (oi == city) {
                                    $("#NowCity").find("li").attr("data-name", city);
                                    $("#NowCity").find("li").attr("data-code", oi.stationCode);
                                    $("#NowCity").find("li").click(function () {
                                        $("#Div_CityPanel").hide();
                                        $("#bottomMenu").show();
                                        $("#topMenu").show();
                                        $("#Div_ZMJS").hide();
                                        $("#Div_ZM").hide();
                                        var cityName = $(this).attr("data-name");
                                        var code = $(this).attr("data-code");
                                        if (_Index.type == 0) {
                                            _Index.sCity = cityName;
                                            _Index.sCode = code;
                                        }
                                        else {
                                            _Index.tCity = cityName;
                                            _Index.tCode = code;
                                        }
                                        $(".City").eq(_Index.type).text(cityName);
                                        $("#Div_ZMJS_N").show();
                                        $("#input_search").val("");
                                        $(".CityList").html("");
                                    });
                                    break;
                                }
                            }
                        }
                    });
                }
            });
            _Index.type = type;
            $("#bottomMenu").hide();
            $("#topMenu").hide();
            $("#Div_CityPanel").slideToggle("fast");
            $("#Div_City").show();
            $("#Div_ZMJS").hide();
            $("#Div_ZM").show();
            _Index.isOpenInfo = 1;
            var json = { time: new Date().getTime() };
            window.history.pushState(json, "");
        });

        var midMenu = $(".midMenu").find("div");
        midMenu.eq(0).click(function () {
            window.location = "c_order_all.html";
        });
        midMenu.eq(1).click(function () {
            window.location = "c_uc.html";
        });
        midMenu.eq(2).click(function () {
            window.location = "http://m.veryzhun.com/flight/?token=5cf2036c3db9fe08a7ee0c9b2077d37d";
        });
        midMenu.eq(3).click(function () {
            window.location = "c_set_list.html";
        });
        midMenu.eq(4).click(function () {
            window.location = "http://hjhk.edmp.cc/travel/c_travel_city.html?name=%u5C71%u897F&id=36";
        });
        midMenu.eq(5).click(function () {
            window.location = "http://common.diditaxi.com.cn/general/webEntry?wx=true&bizid=257&channel=70365&code=011lr4fi1INYEy0Lvoei1oM2fi1lr4fV&state=123";
        });

        $(".Alllater").find("li").click(function () {
            $("#Div_ZM").hide();
            $("#Div_ZMJS").show();
            var latter = $(this).find("span").text();
            $(".CityGroup").find("span").eq(0).text(latter);
            _Index.findCityForlatter(latter);
        });

        $("#input_search").keyup(function () {
            var key = $("#input_search").val();
            if (key.length > 0) {
                $("#Div_ZMJS").show();
                $("#Div_ZM").hide();
                $("#Div_ZMJS_N").hide();
                $("#noSearch").hide();
                _Index.findCityForkey(key);
            }
            else {
                $("#Div_ZMJS").hide();
                $("#Div_ZM").show();
                $("#Div_ZMJS_N").show();
                $("#noSearch").show();
            }
        });

        $("#searchCancel").click(function () {
            $("#Div_ZMJS").hide();
            $("#Div_ZM").show();
            $("#Div_ZMJS_N").show();
            $("#noSearch").show();
        });

        $("#input_cancel").click(function () {
            $("#input_cancel").hide();
            $("#Div_ZMJS").hide();
            //$("#Div_City").show();
            $("#Div_ZM").show();
            $("#Div_ZMJS_N").show();
            $("#input_search").val("");
        });

        $(".CityGroup").find("span").eq(1).click(function () {
            $(".CityGroup").find("span").eq(0).text("");
            $("#Div_ZM").show();
            //$("#Div_City").show();
            $("#Div_ZMJS").hide();
        });
        _Index.TrainCityCode();
        _Index.InitHotCode();
        _Index.InitHotCodeForAir();
        _Index.AriCityCode();
        _Index.initStartCity();
        setTimeout(function () {
            if (_B.state == 1) {
                _Index.selectType = 1;
                _B.state = 0;
                var date = new Date();
                date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000)); //12小时过期
                $.cookie("_BasicForUrl", JSON.stringify(_B), { path: '/', expires: date });
            }

            if (_Index.selectType > 0) {
                $("#topMenu").find("a").eq(_Index.selectType).click();
            }
        }, 300);
    },
    initHotCityList: function () {
        $("#HotCityList").html("");
        var cityStr = _Index.trainHotCity;
        if (_Index.selectType == 1) {
            cityStr = _Index.airHotCity;
        }
        var cityArr = cityStr.split("|");
        for (var i = 0; i < cityArr.length; i++) {
            if (cityArr[i].length > 0) {
                $("#HotCityList").append("<li data-name='" + cityArr[i].split("@")[0] + "' data-code='" + cityArr[i].split("@")[1] + "'><span>" + cityArr[i].split("@")[0] + "</span></li>");
            }
        }
        $("#HotCityList").find("li").click(function () {
            $("#Div_CityPanel").hide();
            $("#bottomMenu").show();
            $("#topMenu").show();
            $("#Div_ZMJS").hide();
            $("#Div_ZM").hide();
            var cityName = $(this).attr("data-name");
            var code = $(this).attr("data-code");
            if (_Index.type == 0) {
                _Index.sCity = cityName;
                _Index.sCode = code;
            }
            else {
                _Index.tCity = cityName;
                _Index.tCode = code;
            }
            $(".City").eq(_Index.type).text(cityName);
        });
    },
    findCityForlatter: function (latter) {
        $(".CityList").html("");
        if (_Index.selectType == 1) {
            var o = $("#cityDataForAir").data("cityDataForAir");
            o = JSON.parse(o);
            for (var i = 0; i < o.List.length; i++) {
                var oi = o.List[i];
                if (oi.letter.toUpperCase() == latter.toUpperCase()) {
                    for (var j = 0; j < oi.city.length; j++) {
                        oj = oi.city[j];
                        $(".CityList").append("<li data-name='" + oj.cityName + "' data-code='" + oj.code + "'><span>" + oj.cityName + "</span><em> - " + oj.airPort + "</em></li>");
                    }
                }
            }
        }
        else {
            var o = $("#cityData").data("cityData");
            //var h = window.screen.height;
            //var mhb = parseInt(h / 2) + 80;
            //$("#cityL").append(or + "@" + oi.hot + "@" + oi.match + "@" + oi.priority + "@" + oi.stationCode + "<br/>");
            var arrA = new Array();
            var arrB = new Array();
            var arrC = new Array();
            var arrD = new Array();
            var i = 0;
            for (var or in o.stations) {
                var oi = o.stations[or];
                if (oi.stationCode.toUpperCase().startsWith(latter)) {
                    //$(".CityList").append("<li data-name='" + or + "' data-hot='" + oi.hot + "' data-code='" + oi.stationCode + "'><span>" + or + "</span></li>");
                    arrA[i] = or + "|" + oi.hot + "|" + oi.stationCode;
                    arrB[i] = oi.hot;
                    i++;
                }
            }

            var len = 0;
            while (len < arrA.length) {
                var temp = "0";
                var n = 0;
                var isE = false;
                for (var j = 0; j < arrB.length; j++) {
                    var isE = false;
                    for (var x = 0; x < arrC.length; x++) {
                        if (arrC[x] == j) {
                            isE = true;
                            break;
                        }
                    }
                    if (!isE) {
                        if (temp < arrB[j]) {
                            temp = arrB[j];
                            n = j;
                        }
                    }
                }

                arrC[len] = n;
                len++;
                $(".CityList").append("<li data-name='" + arrA[n].split("|")[0] + "' data-hot='" + arrA[n].split("|")[1] + "' data-code='" + arrA[n].split("|")[2] + "'><span>" + arrA[n].split("|")[0] + "</span></li>");
            }
        }
        
        //$(".CityList").css("height", mhb + "px");
        /*
        for (var or in o.stations) {
            var oi = o.stations[or];
            if (oi.stationCode.toUpperCase().startsWith(latter)) {
                $(".CityList").append("<li data-name='" + or + "' data-hot='" + oi.hot + "' data-code='" + oi.stationCode + "'><span>" + or + "</span></li>");
            }
        }
        */
        _Index.bindCity();
    },
    findCityForkey: function (key) {
        $(".CityList").html("");
        if (_Index.selectType == 1) {
            var o = $("#cityDataForAir").data("cityDataForAir");
            o = JSON.parse(o);
            for (var i = 0; i < o.List.length; i++) {
                var oi = o.List[i];
                for (var j = 0; j < oi.city.length; j++) {
                    oj = oi.city[j];
                    if (key.toUpperCase().startsWith(oi.letter.toUpperCase()) || oj.cityName.startsWith(key) || oj.code.toUpperCase() == key.toUpperCase()) {
                        $(".CityList").append("<li data-name='" + oj.cityName + "' data-code='" + oj.code + "'><span>" + oj.cityName + "</span><em> - " + oj.airPort + "</em></li>");
                    }
                }
            }
        }
        else {
            var o = $("#cityData").data("cityData");
            //$("#cityL").append(or + "@" + oi.hot + "@" + oi.match + "@" + oi.priority + "@" + oi.stationCode + "<br/>");
            for (var or in o.stations) {
                var oi = o.stations[or];
                if (or.startsWith(key) || oi.stationCode.toUpperCase().startsWith(key.toUpperCase()) || oi.match.toUpperCase().startsWith(key.toUpperCase())) {
                    $(".CityList").append("<li data-name='" + or + "' data-code='" + oi.stationCode + "'><span>" + or + "</span></li>");
                }
            }
        }
        $("#noSearch").hide();
        _Index.bindCity();
    },
    bindCity: function () {
        $(".CityList").find("li").click(function () {

            $("#Div_ZMJS").hide();
            $("#Div_ZM").show();
            $("#Div_ZMJS_N").show();
            $("#noSearch").show();

            $("#Div_CityPanel").hide();
            $("#bottomMenu").show();
            $("#topMenu").show();
            $("#Div_ZMJS").hide();
            var cityName = $(this).attr("data-name");
            var code = $(this).attr("data-code");
            if (_Index.type == 0) {
                _Index.sCity = cityName;
                _Index.sCode = code;
            }
            else {
                _Index.tCity = cityName;
                _Index.tCode = code;
            }
            $(".City").eq(_Index.type).text(cityName);
            $("#Div_ZMJS_N").show();
            $("#input_search").val("");
            $(".CityList").html("");
        });
    },
    TrainCityCode: function () {
        $.ajax(
        {
            url: _C.TrainServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 1, t: new Date() },
            success: function (o) {
                if (o.msgCode == 100) {
                    $("#cityData").data("cityData", o);
                }
            }
        }
        );
    },
    AriCityCode: function (latter) {
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 100, isHot: 0, t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                    $("#cityDataForAir").data("cityDataForAir", JSON.stringify(o));
                        /*
                        for (var i = 0; i < o.List.length; i++) {
                            var oi = o.List[i];
                            if (oi.letter == latter) {
                                for (var j = 0; j < oi.city.length; j++) {
                                    oj = oi.city[j];
                                    $(".CityList").append("<li data-name='" + oj.cityName + "' data-code='" + oj.code + "'><span>" + oj.cityName + "</span><em> - " + oj.airPort + "</em></li>");
                                }
                            }
                        }*/
                }

            }
        }
        );
    },
    InitHotCode: function () {
        $.ajax(
        {
            url: _C.TrainServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 8,t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                    if (o.List != null) {
                        var trainHotCity = "";
                        for (var j = 0; j < o.List.length; j++) {
                            var oj = o.List[j];
                            //$("#HotCityList").append("<li data-type='0' data-name='" + oj.sName + "' data-code='" + oj.stationCode + "'><span>" + oj.sName + "</span></li>");
                            trainHotCity += oj.sName + "@" + oj.stationCode + "|";
                        }
                        _Index.trainHotCity = trainHotCity;
                    }
                }
            }
        }
        );
    },
    InitHotCodeForAir: function () {
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 100, isHot: 1, t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                    if (o.List != null) {
                        var oi = o.List[0];
                        var airHotCity = "";
                        for (var j = 0; j < oi.city.length; j++) {
                            oj = oi.city[j];
                            $("#HotCityList").append("<li data-type='1' data-name='" + oj.cityName + "' data-code='" + oj.code + "'><span>" + oj.cityName + "</span></li>");
                            airHotCity += oj.cityName + "@" + oj.code + "|";
                        }
                        _Index.airHotCity = airHotCity;
                    }
                }

            }
        }
        );
    },
    ToSelect: function () {
        if (_Index.sCity.length == 0 || _Index.tCity.length == 0) {
            return;
        }
        else {
            var date = new Date();
            date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000)); //12小时过期
            _T.sCity = _Index.sCity;
            _T.tCity = _Index.tCity;
            _T.sCode = _Index.sCode;
            _T.tCode = _Index.tCode;
            _T.sDate = new Date($("#sDate").attr("data-date")).pattern("yyyy-MM-dd");
            /* 暂时不支持往返
            if ($("#e-datepicker").attr("data-date").length > 0) {
                _F.tDate = new Date($("#e-datepicker").attr("data-date")).pattern("yyyy-MM-dd");
                _F.sType = 2;
            }
            */
            var s = JSON.stringify(_T);
            $.cookie("Trip_select_Train", s, { path: '/', expires: date });
            _Index.addHis();
            window.location = "c_train_trip.html?s=1&type=" + _Index.selectType;
        }
    },
    ToSelectAir: function () {
        if (_Index.sCode.length == 0 || _Index.tCode.length == 0) {
            return;
        }
        else {
            var date = new Date();
            date.setTime(date.getTime() + (24 * 60 * 60 * 1000)); //12小时过期
            _F.sCity = _Index.sCity;
            _F.tCity = _Index.tCity;
            _F.Date = new Date($("#sDate").attr("data-date")).pattern("yyyy-MM-dd");
            
            _F.sDate = new Date($("#sDate").attr("data-date")).pattern("yyyy-MM-dd");
            /*
            if ($("#e-datepicker").attr("data-date").length > 0) {
                _F.tDate = new Date($("#e-datepicker").attr("data-date")).pattern("yyyy-MM-dd");
                _F.sType = 2;
            }
            */
            _F.sCode = _Index.sCode.replace("beijing","pek");
            _F.tCode = _Index.tCode.replace("taiyuan","tyn");
            _Index.addHis();
            var s = JSON.stringify(_F);
            $.cookie("Trip_select", s, { path: '/', expires: date });
            window.location = "c_trip.html?s=1";
        }
    },
    addHis: function () {
        if (_Index.selectType == 1) {
            var his = $.cookie("History_Trip_City_Air");
            var nowStr = _F.sCity + "|" + _F.sCode + "|" + _F.tCity + "|" + _F.tCode + "|" + _F.Date;
            if (his == null) {
                his = nowStr + "@";
            }
            else {
                his = his + nowStr + "@";
            }
            var date = new Date();
            date.setTime(date.getTime() + (12 * 30 * 24 * 60 * 60 * 1000)); //12小时过期
            $.cookie("History_Trip_City_Air", his, { path: '/', expires: date });
        }
        else {
            var his = $.cookie("History_Trip_City");
            var nowStr = _T.sCity + "|" + _T.sCode + "|" + _T.tCity + "|" + _T.tCode + "|" + _T.sDate;
            if (his == null) {
                his = nowStr + "@";
            }
            else {
                his = his + nowStr + "@";
            }
            var date = new Date();
            date.setTime(date.getTime() + (12 * 30 * 24 * 60 * 60 * 1000)); //12小时过期
            $.cookie("History_Trip_City", his, { path: '/', expires: date });
        }
    },
    initStartCity: function () {
        var his = $.cookie("History_Trip_City");
        var isInit = false;
        if (_Index.selectType == 1) {
            his = $.cookie("History_Trip_City_Air");
        }
        if (his != null) {
            var hArr = his.split("@");
            if (hArr.length > 0) {
                if (hArr[hArr.length - 2].length > 0) {
                    var oA = hArr[hArr.length - 2].split("|");
                    $(".City").eq(0).text(oA[0]);
                    $(".City").eq(1).text(oA[2]);
                    _Index.sCity = oA[0];
                    _Index.sCode = oA[1];
                    _Index.tCity = oA[2];
                    _Index.tCode = oA[3];
                    isInit = true;
                }
            }
        }
        if (!isInit) {
            if (_Index.selectType == 1) {
                $(".City").eq(0).text("太原");
                $(".City").eq(1).text("北京");
                _Index.sCity = "太原";
                _Index.sCode = "tyn";
                _Index.tCity = "北京";
                _Index.tCode = "pek";
            }
            else {
                _Index.sCity = "太原";
                _Index.sCode = "taiyuan";
                _Index.tCity = "北京";
                _Index.tCode = "beijing";
            }
        }
    },
    initHis:function(){
        var his = $.cookie("History_Trip_City");
        if (_Index.selectType == 1) {
            his = $.cookie("History_Trip_City_Air");
        }
        var template = "<li data-name=\"{city}\" data-code=\"{code}\"><span>{city}</span></li>";
        $("#HistoryList").html("<li data-name=\"\" data-code=\"\"><span>无</span></li>");
        if (his != null) {
            var hArr = his.split("@");
            var HArrn = new Array();
            var temp = "";
            var tempHtml = "";
            var last = "";
            var n = 0;
            for (var i = 0; i < hArr.length; i++) {
                HArrn[i] = hArr[hArr.length - 1 - i];
            }
            $("#HistoryList").html("");
            for (var i = 0; i < HArrn.length; i++) {
                if (n == 3) {
                    break;
                }
                var o = HArrn[i];
                if (o.length > 0) {
                    var oA = o.split("|");
                    if (temp.length == 0 || temp.indexOf("@" + oA[1] + "|" + oA[3] + "@") == -1) {
                        tempHtml = template.replace(/{city}/g, oA[2]);
                        tempHtml = tempHtml.replace(/{code}/g, oA[3]);
                        //tempHtml = tempHtml.replace(/{sDate}/g, oA[4]);
                        $("#HistoryList").append(tempHtml);
                        temp += "@" + oA[1] + "|" + oA[3] + "@";
                        n++;
                    }
                }
            }


            $("#HistoryList").find("li").click(function () {
                $("#Div_CityPanel").hide();
                $("#bottomMenu").show();
                $("#topMenu").show();
                $("#Div_ZMJS").hide();
                $("#Div_ZM").hide();
                var cityName = $(this).attr("data-name");
                var code = $(this).attr("data-code");
                if (_Index.type == 0) {
                    _Index.sCity = cityName;
                    _Index.sCode = code;
                }
                else {
                    _Index.tCity = cityName;
                    _Index.tCode = code;
                }
                $(".City").eq(_Index.type).text(cityName);
            });
        }
    }
}


_Index.Init();