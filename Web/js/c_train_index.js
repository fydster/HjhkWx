var _Index = {
    sCity: "太原",
    sCode: "taiyuan",
    tCity: "北京",
    tCode: "beijing",
    type: 0,
    isOpenInfo: 0,
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
                $("#Div_CityPanel").show();
                //$("#Div_Hd").hide();
                $(".bt-Logo").hide();
                $("#Div_ZMJS").hide();
                //$("#Div_City").show();
                $("#Div_ZM").show();
                _Index.isOpenInfo = 1;
                var json = { time: new Date().getTime() };
                window.history.pushState(json, "");
            }
        });

        $(".Alllater").find("li").click(function () {
            $("#Div_ZM").hide();
            //$("#Div_City").hide();
            $("#Div_ZMJS").show();
            var latter = $(this).find("span").text();
            $(".CityGroup").find("span").eq(0).text(latter);
            _Index.findCityForlatter(latter);
        });

        $("#input_search").keyup(function () {
            var key = $("#input_search").val();
            if (key.length > 0) {
                $("#input_cancel").show();
                $("#Div_ZMJS").show();
                //$("#Div_City").hide();
                $("#Div_ZM").hide();
                $("#Div_ZMJS_N").hide();
                _Index.findCityForkey(key);
            }
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
        _Index.initHis();
        _Index.TestCityCode();
        _Index.InitHotCode();
    },
    findCityForlatter: function (latter) {
        var o = $("#cityData").data("cityData");
        $(".CityList").html("");
        var h = window.screen.height;
        var mhb = parseInt(h / 2) + 80;
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
        $(".CityList").css("height", mhb + "px");
        document.getElementById('d1').scrollTop = 1;
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
        var o = $("#cityData").data("cityData");
        $(".CityList").html("");
        //$("#cityL").append(or + "@" + oi.hot + "@" + oi.match + "@" + oi.priority + "@" + oi.stationCode + "<br/>");
        for (var or in o.stations) {
            var oi = o.stations[or];
            if (or.startsWith(key) || oi.stationCode.toUpperCase().startsWith(key.toUpperCase()) || oi.match.toUpperCase().startsWith(key.toUpperCase())) {
                $(".CityList").append("<li data-name='" + or + "' data-code='" + oi.stationCode + "'><span>" + or + "</span></li>");
            }
        }
        _Index.bindCity();
    },
    bindCity: function () {
        $(".CityList").find("li").click(function () {
            $(".sPanel").css("height", "21rem");
            $("#Div_DatePanel").show();
            $("#Div_CityPanel").hide();
            //$("#Div_Hd").show();
            $(".bt-Logo").show();
            //$("#Div_City").hide();
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
            $("#input_cancel").hide();
            $("#Div_ZMJS_N").show();
            $("#input_search").val("");
            $(".CityList").html("");
        });
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
    TestCityCode: function () {
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
    InitHotCode: function () {
        $(".HotCity").html("");
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
                        for (var j = 0; j < o.List.length; j++) {
                            var oj = o.List[j];
                            $(".HotCity").append("<li data-name='" + oj.sName + "' data-code='" + oj.stationCode + "'><span>" + oj.sName + "</span></li>");
                        }
                        $(".HotCity").find("li").click(function () {
                            $(".sPanel").css("height", "28rem");
                            $("#Div_DatePanel").show();
                            //$("#Div_Hd").show();
                            $(".bt-Logo").show();
                            //$("#Div_City").hide();
                            $("#Div_CityPanel").hide();
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
            _T.sDate = new Date($("#s-datepicker").attr("data-date")).pattern("yyyy-MM-dd");
            /* 暂时不支持往返
            if ($("#e-datepicker").attr("data-date").length > 0) {
                _F.tDate = new Date($("#e-datepicker").attr("data-date")).pattern("yyyy-MM-dd");
                _F.sType = 2;
            }
            */
            var s = JSON.stringify(_T);
            $.cookie("Trip_select_Train", s, { path: '/', expires: date });
            _Index.addHis();
            window.location = "c_train_trip.html?s=1";
        }
    },
    addHis: function () {
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
    },
    initHis:function(){
        var his = $.cookie("History_Trip_City");
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
                if (n == 5) {
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


_Index.Init();
