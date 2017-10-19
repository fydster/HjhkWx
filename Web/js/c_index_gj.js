var _Index = {
    sCity: "太原",
    sCode: "TYN",
    tCity: "",
    tCode: "",
    type: 1,
    isOpenInfo: 0,
    airHotCity: "",
    trainHotCity: "",
    selectType: 1,
    hotCity: "新加坡@SIN|奥克兰@AKL|基督城@CHC|墨尔本@MEL|布里斯班@BNE|阿德莱德@ADL|悉尼@SYD|佩斯@PER|澳门@MFM|香港@HKG|曼谷@BKK|洛杉矶@LAX|旧金山@SFO|法兰克福@FRA|巴黎@CDG|阿姆斯特丹@AMS|伦敦@LHR|多伦多@YYZ|温哥华@YVR|吉隆坡@KUL|毛里求斯@MRU|马尔代夫@MLE|清迈@CNX|迪拜@DXB|河内@HAN",
    Init: function () {
        _Index.testAlert("0");
        //_Index.InitWxInfo();
        _Index.testAlert("1");
        _Index.initLayot();
        _Index.testAlert("2");
        _C.initWx();
        _Index.testAlert("3");
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

        wx.ready(function () {
            //alert("1");
            wx.onMenuShareTimeline({
                title: '山西出行，你选择我，我服务您！', // 分享标题
                link: 'http://hjhk.edmp.cc/c_loading.html?i=1', // 分享链接
                imgUrl: 'http://hjhk.edmp.cc/img/sharelogo.jpg', // 分享图标
                success: function () {
                    //alert("2");
                    //$("#div_img").hide();
                    //window.location = "order_one.html";
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    //alert("3");
                    //$("#div_img").hide();
                    //$("#my-alert").modal('open');
                    // 用户取消分享后执行的回调函数
                }
            });

            wx.onMenuShareAppMessage({
                title: '山西出行，你选择我，我服务您！', // 分享标题
                desc: '',
                link: 'http://hjhk.edmp.cc/c_loading.html?i=1', // 分享链接
                imgUrl: 'http://hjhk.edmp.cc/img/sharelogo.jpg', // 分享图标
                success: function () {
                    //$("#div_img").hide();
                    //window.location = "order_one.html";
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    //$("#div_img").hide();
                    //$("#my-alert").modal('open');
                    // 用户取消分享后执行的回调函数
                }
            });
        });
        _Index.testAlert("4");
    },
    testAlert: function (n) {
        //alert(n);
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
        var h = window.screen.height;
        h = h - 100;
        $("#div_coninfo").css("height", h + "px");

        var date = new Date().pattern("yyyy-MM-dd");
        var NowDate = _C.dateAdd(date, "D", 1);
        var dateInfo = new Date(NowDate).pattern("M月dd日")
        var week = _C.getWeek(NowDate);
        $("#sDate").text(dateInfo);
        $("#sDate").attr("data-date", NowDate);
        $(".week").text(week);

        $("#btn_lowPrice").click(function () {
            window.location = "c_lowPrice.html";
        });

        $("#bottomMenu").find(".weui-flex__item").eq(1).click(function () {
            window.location = "c_order_all.html";
        });
        $("#bottomMenu").find(".weui-flex__item").eq(2).click(function () {
            window.location = "c_uc.html";
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

        $("#btn_Select").click(function () {
            _Index.ToSelectAir();
            
        });

        $(".City").click(function () {
            var type = $(this).attr("data-type");
            if (type == 0) {
                return;
            }
            //_Index.initHotCityList();
            //_Index.initHis();
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
            window.location = "c_word.html";
        });
        midMenu.eq(1).click(function () {
            window.location = "c_order_all.html";
        });
        midMenu.eq(2).click(function () {
            window.location = "http://m.veryzhun.com/flight/?token=5cf2036c3db9fe08a7ee0c9b2077d37d";
        });
        midMenu.eq(3).click(function () {
            window.location = "c_set_list.html";
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
        _Index.initHotCityList();
        _Index.AriCityCode();
        //_Index.initStartCity();
        setTimeout(function () {
            if (_B.state == 1) {
                _Index.selectType = 1;
                _B.state = 0;
                var date = new Date();
                date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000)); //12小时过期
                $.cookie("_BasicForUrl", JSON.stringify(_B), { path: '/', expires: date });
            }

            $("#topMenuDiv").find(".weui-flex__item").eq(_Index.selectType).click();
        }, 300);
    },
    initHotCityList: function () {
        $("#HotCityList").html("");
        var cityStr = _Index.hotCity;
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
            //_Index.addHis();
            var s = JSON.stringify(_F);
            $.cookie("Trip_select", s, { path: '/', expires: date });
            window.location = "c_trip_gj.html?s=1";
        }
    }
}
