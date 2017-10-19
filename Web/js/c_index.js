var _Index = {
    sCity: "太原",
    sCode: "TYN",
    tCity: "北京",
    tCode: "PEK",
    type: 0,
    isOpenInfo:0,
    Init: function () {
        //_Index.InitWxInfo();
        _Index.initLayot();
        window.onpopstate = function () {
            if (_Index.isOpenInfo == 1) {
                $(".sPanel").css("height", "28rem");
                $("#Div_DatePanel").show();
                $(".bt-Logo").show();
                $("#Div_City").hide();
                $("#Div_CityPanel").hide();
                $(".HisTrip").show();
                $("#Div_ZMJS").hide();
                $("#Div_ZM").hide();
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
                        $(".sCity").find("span").eq(1).text(o.Info.sCity);
                    }
                }

            }
        }
        );
    },
    initLayot: function () {
        var NowDate_ = new Date();
	    var NowDate = _C.dateAdd(NowDate_, "D", 1);
	    NowDate = new Date(NowDate).pattern("yyyy-MM-dd");
        $("#s-datepicker").attr("data-date", NowDate);
        $("#s-datepicker").find("em").eq(0).text(new Date(NowDate).pattern("MM月dd日"));

        
        $('#s-datepicker').datepicker({
            onRender: function (date, viewMode) {
                var nowTemp = new Date();
                var nowDay = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0).valueOf();
                var nowMoth = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), 1, 0, 0, 0, 0).valueOf();
                var nowYear = new Date(nowTemp.getFullYear(), 0, 1, 0, 0, 0, 0).valueOf();
                var viewDate = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0).valueOf();
                return date.valueOf() < viewDate ? 'am-disabled' : '';
            }
        }).
          on('changeDate.datepicker.amui', function (event) {
              var d = new Date(event.date).pattern("MM月dd日")
              $("#s-datepicker").find("em").eq(0).text(d);
              //$("#Div_Hd").show();
              var week = _C.getWeek(new Date(event.date).pattern("yyyy-MM-dd"));
              $("#s-datepicker").find("em").eq(1).text(week);
              $(".bt-Logo").show();
              $("#s-datepicker").attr("data-date", event.date);
              _Index.gzDate(0);
          });

        $('#e-datepicker').datepicker({
            onRender: function (date, viewMode) {
                var nowTemp = new Date();
                var nowDay = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0).valueOf();
                var nowMoth = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), 1, 0, 0, 0, 0).valueOf();
                var nowYear = new Date(nowTemp.getFullYear(), 0, 1, 0, 0, 0, 0).valueOf();
                var viewDate = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0).valueOf();
                return date.valueOf() < viewDate ? 'am-disabled' : '';
            }
        }).
          on('changeDate.datepicker.amui', function (event) {
              var d = new Date(event.date).pattern("MM月dd日")
              //$("#Div_Hd").show();
              $(".bt-Logo").show();
              $("#e-datepicker").find("em").eq(0).text(d);
              $('#e-datepicker').css("width", "35%");
              $("#delete_Date").show();
              $("#e-datepicker").attr("data-date", event.date);
              //$("#topImg").attr("src", "img/indexTopW.png");
              _Index.gzDate(1);
          });

        $(".am-icon-times-circle-o").click(function () {
            //$("#topImg").attr("src", "img/indexTop.png");
            $("#e-datepicker").find("em").eq(0).text("--");
            $("#e-datepicker").attr("data-date", "");
            $("#delete_Date").hide();
            $('#e-datepicker').css("width", "45%");
        });

        $(".am-btn-block").click(function () {
            _Index.ToSelect();
        });

        $('#s-datepicker').click(function () {
            //$("#Div_Hd").hide();
            $(".bt-Logo").hide();
        });
        $('#e-datepicker').click(function () {
            //$("#Div_Hd").hide();
            $(".bt-Logo").hide();
        });
        $(".sCity").find("span").click(function () {
            var type = $(this).attr("data-type");
            if (type == -1) {
                var tempC = $(".sCity").find("span").eq(1).text();
                var tempT = $(".sCity").find("span").eq(4).text();
                $(".sCity").find("span").eq(1).text(tempT);
                $(".sCity").find("span").eq(4).text(tempC);
                tempC = _Index.sCity;
                tempT = _Index.tCity;
                _Index.sCity = tempT;
                _Index.tCity = tempC;
                tempC = _Index.sCode;
                _Index.sCode = _Index.tCode;
                _Index.tCode = tempC;
                //$("#Div_Hd").show();
                $(".bt-Logo").show();
            }
            else {
                _Index.type = type;
                $(".sCity").find(".toActive").removeClass("toActive").addClass("noSelect");
                $(this).removeClass("noSelect").addClass("toActive");
                //$(".sPanel").css("height", "100rem");
                $("#Div_DatePanel").hide();
                var h = window.screen.height;
                $("#Div_CityPanel").css("height", (h-20) + "px");
                $("#Div_CityPanel").show();
                $(".HisTrip").hide();
                //$("#Div_Hd").hide();
                $(".bt-Logo").hide();
                $("#Div_ZMJS").hide();
                $("#Div_City").show();
                $("#Div_ZM").show();
                _Index.isOpenInfo = 1;
                var json = { time: new Date().getTime() };
                window.history.pushState(json, "");
            }
        });

        $(".Alllater").find("li").click(function () {
            $("#Div_ZM").hide();
            $("#Div_ZMJS").show();
            var latter = $(this).find("span").text();
            _Index.InitCityCode(latter);
        });

        $(".CityGroup").find("span").eq(1).click(function () {
            $("#Div_ZM").show();
            $("#Div_ZMJS").hide();
        });
        _Index.initHis();
        _Index.InitHotCode();
    },
    gzDate: function (n) {
        var sDate = $("#s-datepicker").attr("data-date");
        var eDate = $("#e-datepicker").attr("data-date");
        sDate = new Date(sDate).pattern("yyyy-MM-dd");
        eDate = new Date(eDate).pattern("yyyy-MM-dd");
        var s = _C.dateDiff("D", sDate, eDate);
        if (s < 0) {
            if (n == 0) {
                $("#s-datepicker").find("em").eq(0).text("--");
                $("#s-datepicker").attr("data-date", "");
                $("#s-datepicker").find("em").eq(1).text("");
            }
            else {
                $("#e-datepicker").find("em").eq(0).text("--");
                $("#e-datepicker").attr("data-date", "");
                $("#delete_Date").hide();
                $('#e-datepicker').css("width", "45%");
            }
            /*
            var mDate = sDate;
            sDate = eDate;
            eDate = mDate;
            $("#s-datepicker").attr("data-date", sDate);
            $("#e-datepicker").attr("data-date", eDate);
            $("#s-datepicker").text(new Date(sDate).pattern("MM月dd日"));
            $("#e-datepicker").text(new Date(eDate).pattern("MM月dd日"));
            */
        }
    },
    InitCityCode: function (latter) {
        $(".CityList").html("");
        $(".CityGroup").find("span").eq(0).html(" " + latter + " ");
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 100, isHot:0, t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                    if (o.List != null) {
                        for (var i = 0; i < o.List.length; i++) {
                            var oi = o.List[i];
                            if (oi.letter == latter) {
                                for (var j = 0; j < oi.city.length; j++) {
                                    oj = oi.city[j];
                                    $(".CityList").append("<li data-name='" + oj.cityName + "' data-code='" + oj.code + "'><span>" + oj.cityName + "</span><em> - " + oj.airPort + "</em></li>");
                                }
                            }
                        }
                        $(".CityList").find("li").click(function () {
                            $(".sPanel").css("height", "28rem");
                            $("#Div_DatePanel").show();
                            $("#Div_CityPanel").hide();
                            $(".HisTrip").show();
                            //$("#Div_Hd").show();
                            $(".bt-Logo").show();
                            $("#Div_City").hide();
                            $("#Div_ZMJS").hide();
                            $("#Div_ZM").hide();
                            var cityName = $(this).attr("data-name");
                            var code = $(this).attr("data-code");
                            if (_Index.type == 1) {
                                _Index.sCity = cityName;
                                _Index.sCode = code;
                            }
                            else {
                                _Index.tCity = cityName;
                                _Index.tCode = code;
                            }
                            $(".sCity").find(".toActive").removeClass("toActive").addClass("noSelect");
                            $(".sCity").find("span").eq(_Index.type).text(cityName);
                        });
                    }
                }

            }
        }
        );
    },
    InitHotCode: function () {
        $(".HotCity").html("");
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
                        for (var j = 0; j < oi.city.length; j++) {
                            oj = oi.city[j];
                            $(".HotCity").append("<li data-name='" + oj.cityName + "' data-code='" + oj.code + "'><span>" + oj.cityName + "</span></li>");
                        }
                        $(".HotCity").find("li").click(function () {
                            $(".sPanel").css("height", "28rem");
                            $("#Div_DatePanel").show();
                            //$("#Div_Hd").show();
                            $(".bt-Logo").show();
                            $("#Div_City").hide();
                            $("#Div_CityPanel").hide();
                            $(".HisTrip").show();
                            $("#Div_ZMJS").hide();
                            $("#Div_ZM").hide();
                            var cityName = $(this).attr("data-name");
                            var code = $(this).attr("data-code");
                            if (_Index.type == 1) {
                                _Index.sCity = cityName;
                                _Index.sCode = code;
                            }
                            else {
                                _Index.tCity = cityName;
                                _Index.tCode = code;
                            }
                            $(".sCity").find(".toActive").removeClass("toActive").addClass("noSelect");
                            $(".sCity").find("span").eq(_Index.type).text(cityName);
                        });
                    }
                }

            }
        }
        );
    },
    ToSelect: function () {
        if (_Index.sCode.length == 0 || _Index.tCode.length == 0) {
            return;
        }
        else {
            var date = new Date();
            date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000)); //12小时过期
            _F.sCity = _Index.sCity;
            _F.tCity=_Index.tCity;
            _F.sDate = new Date($("#s-datepicker").attr("data-date")).pattern("yyyy-MM-dd");
            if ($("#e-datepicker").attr("data-date").length > 0) {
                _F.tDate = new Date($("#e-datepicker").attr("data-date")).pattern("yyyy-MM-dd");
                _F.sType = 2;
            }
            _F.sCode = _Index.sCode;
            _F.tCode = _Index.tCode;
            _Index.addHis();
            var s = JSON.stringify(_F);
            $.cookie("Trip_select", s, { path: '/', expires: date });
            window.location = "c_trip.html?s=1";
        }
    },
    addHis: function () {
        var his = $.cookie("History_F_Trip_City");
        var nowStr = _F.sCity + "|" + _F.sCode + "|" + _F.tCity + "|" + _F.tCode + "|" + _F.sDate;
        if (his == null) {
            his = nowStr + "@";
        }
        else {
            his = his + nowStr + "@";
        }
        var date = new Date();
        date.setTime(date.getTime() + (12 * 30 * 24 * 60 * 60 * 1000)); //12小时过期
        $.cookie("History_F_Trip_City", his, { path: '/', expires: date });
    },
    initHis: function () {
        var his = $.cookie("History_F_Trip_City");
        var template = $("#temp_his").html();
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
            for (var i = 0; i < HArrn.length; i++) {
                if (n == 10) {
                    break;
                }
                var o = HArrn[i];
                if (o.length > 0) {
                    var oA = o.split("|");
                    if (temp.length == 0 || temp.indexOf("@" + oA[1] + "|" + oA[3] + "@") == -1) {
                        tempHtml = template.replace(/{sCity}/g, oA[0]);
                        tempHtml = tempHtml.replace(/{sCode}/g, oA[1]);
                        tempHtml = tempHtml.replace(/{tCity}/g, oA[2]);
                        tempHtml = tempHtml.replace(/{tCode}/g, oA[3]);
                        //tempHtml = tempHtml.replace(/{sDate}/g, oA[4]);
                        $(".HisTrip").find("ul").append(tempHtml);
                        temp += "@" + oA[1] + "|" + oA[3] + "@";
                        if (last.length == 0) {
                            last = o;
                        }
                        n++;
                    }
                }
            }

            if (last.length > 0) {
                var lastArr = last.split("|");
                $(".sCity").find("span").eq(1).text(lastArr[0]);
                $(".sCity").find("span").eq(4).text(lastArr[2]);
                _Index.sCity = lastArr[0];
                _Index.tCity = lastArr[2];
                _Index.sCode = lastArr[1];
                _Index.tCode = lastArr[3];

                var d = new Date(lastArr[4]).pattern("MM月dd日")
                $("#s-datepicker").find("em").eq(0).text(d);
                //$("#Div_Hd").show();
                var week = _C.getWeek(new Date(lastArr[4]).pattern("yyyy-MM-dd"));
                $("#s-datepicker").find("em").eq(1).text(week);
                $("#s-datepicker").attr("data-date", lastArr[4]);
            }

            $(".HisTrip").find("ul").find("li").click(function () {
                var sCity = $(this).attr("data-sCity");
                var tCity = $(this).attr("data-tCity");
                var sCode = $(this).attr("data-sCode");
                var tCode = $(this).attr("data-tCode");
                $(".sCity").find("span").eq(1).text(sCity);
                $(".sCity").find("span").eq(4).text(tCity);
                _Index.sCity = sCity;
                _Index.tCity = tCity;
                _Index.sCode = sCode;
                _Index.tCode = tCode;
            });
        }
    }
}