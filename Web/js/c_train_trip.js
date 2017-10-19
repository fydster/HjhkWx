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
    selectType: 2,
    Init: function () {
        _Trip.s = _C.getParam("s");
        if (_C.getParam("type").length > 0) {
            _Trip.selectType = _C.getParam("type");
        }

        /*
        var json = { time: new Date().getTime() };
        window.history.pushState(json, "");
        window.onpopstate = function () {
            window.location = "c_index_home.html?selectType=" + _Trip.selectType;
        }
        */
        _Trip.initSelect();
        _Trip.initLayot();

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
              _T.sDate = new Date(event.date).pattern("yyyy-MM-dd");
              _Trip.Select();
          });

        $("#BottomCityBar").find(".am-u-sm-6").click(function () {
            $('#s-datepicker').click();
        });

        $("#topCityBar").find(".am-u-sm-3").eq(0).click(function () {
            window.location = "c_index_home.html";
        });

        $("#topCityBar").find(".am-u-sm-3").eq(1).click(function () {
            _Trip.Select();
        });
    },
    initSelect: function () {
        if ($.cookie("Trip_select_Train") != null) {
            _T = JSON.parse($.cookie("Trip_select_Train"));
            /*
            if (_Trip.s == 2) {
                var tCode = _F.sCode;
                _F.sCode = _F.tCode;
                _F.tCode = tCode;
                var tCity = _F.sCity;
                _F.sCity = _F.tCity;
                _F.tCity = tCity;
            }
            */
            setTimeout(function () {
                $(document).attr("title", _T.sCity + " - " + _T.tCity);
            }, 3000);
            $("#topCityBar").find(".am-u-sm-6").find("span").eq(0).text(_T.sCity);
            $("#topCityBar").find(".am-u-sm-6").find("span").eq(2).text(_T.tCity);
            _Trip.Select();
        }
        else {
            window.location = "c_index_home.html";
        }
    },
    initLayot: function () {
        $("#BottomCityBar").find(".am-u-sm-3").click(function () {
            var number = parseInt($(this).attr("data-type"));
            /*
            if (number == -1 && _F.isAfter == 0) {
                return false;
            }*/
            var date = new Date(_T.sDate);
            date.setDate(date.getDate() + number);
            _T.sDate = new Date(date).pattern("yyyy-MM-dd");
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
        var t = $("#train_template").html();
        var tc = $("#class_template").html();
        var date = _T.sDate;
        /*
        if (_Trip.s == 2) {
            date = _F.tDate;
        }*/
        $.ajax(
        {
            url: _C.TrainServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 2, uid: _U.uid, openId: _U.openId, scity: _T.sCode, tcity: _T.tCode, sDate: _T.sDate, t: new Date() },
            success: function (o) {
                $("#my-modal-loading").modal("close");
                if (o.msgCode == 100) {
                    var count = o.totalCount;
                    var info = "";
                    var tempHtml = "";
                    var classHtml = "";
                    var infoHtml = "";
                    var price = 0;
                    var seats = 0;
                    var clCount = 0;
                    $("#BottomCityBar").find(".am-u-sm-6").find("span").eq(0).text(date);
                    if (count > 0) {
                        for (var i = 0; i < count; i++) {
                            var or = o.trains[i];
                            price = 0;
                            seats = 0;
                            tempHtml = t.replace(/{trainNo}/g, or.trainNo);
                            tempHtml = tempHtml.replace(/{sTime}/g, or.fromTime);
                            tempHtml = tempHtml.replace(/{tTime}/g, or.toTime);
                            tempHtml = tempHtml.replace(/{sCity}/g, or.fromStation);
                            tempHtml = tempHtml.replace(/{tCity}/g, or.toStation);

                            infoHtml = "";
                            var showPrice = 0;

                            for (var item in or.tickets) {
                                var oj = or.tickets[item];
                                showPrice = oj.price;
                                if (oj.upPrice > 0) {
                                    showPrice = oj.upPrice;
                                }
                                classHtml = tc.replace(/{price}/g, showPrice);
                                classHtml = classHtml.replace("{piaoshu}", "余 " + oj.seats);
                                classHtml = classHtml.replace(/{seat}/g, item);
                                classHtml = classHtml.replace(/{seatName}/g, oj.seatName);
                                classHtml = classHtml.replace(/{trainNo}/g, or.trainNo);
                                classHtml = classHtml.replace(/{sTime}/g, or.fromTime);
                                classHtml = classHtml.replace(/{tTime}/g, or.toTime);
                                classHtml = classHtml.replace(/{queryKey}/g, o.queryKey);

                                classHtml = classHtml.replace(/{sCity}/g, or.fromStation);
                                classHtml = classHtml.replace(/{tCity}/g, or.toStation);
                                classHtml = classHtml.replace(/{sCode}/g, or.fromStationCode);
                                classHtml = classHtml.replace(/{tCode}/g, or.toStationCode);

                                if (item == "hardsleepermid" || item == "softsleeperdown") {
                                    classHtml = classHtml.replace(/{priceMemo}/g, "上铺价格");
                                }
                                else {
                                    classHtml = classHtml.replace(/{priceMemo}/g, "");
                                }
                                if (oj.seats == 0) {
                                    classHtml = classHtml.replace("am-btn-warning", "");
                                    classHtml = classHtml.replace("{isPs}", "0");
                                }
                                else {
                                    classHtml = classHtml.replace("{isPs}", "1");
                                }
                                seats += oj.seats;
                                infoHtml += classHtml;
                                if (price == 0 || price > oj.price) {
                                    price = oj.price;
                                }
                            }

                            tempHtml = tempHtml.replace("{seatList}", infoHtml);
                            if (price > 0 && or.runTimeSpan > 0) {
                                if (seats == 0) {
                                    tempHtml = tempHtml.replace("{lowPrice}", "9999");
                                    tempHtml = tempHtml.replace("{Price}", "<em>无票</em>");
                                    tempHtml = tempHtml.replace("{isks}", "0");
                                }
                                else {
                                    tempHtml = tempHtml.replace("{lowPrice}", price);
                                    tempHtml = tempHtml.replace("{Price}", "￥" + price);
                                }
                            }
                            else {
                                tempHtml = tempHtml.replace("{isks}", "0");
                                tempHtml = tempHtml.replace("{lowPrice}", "9999");
                                tempHtml = tempHtml.replace("{Price}", "<em>停运</em>");
                            }
                            tempHtml = tempHtml.replace("{isks}", "1");

                            if (_Trip.selectType == 0) {
                                if (or.trainNo.toString().substr(0, 1) == "G" || or.trainNo.toString().substr(0, 1) == "D") {
                                    $(".TripList").append(tempHtml);
                                    clCount++;
                                }
                            }
                            else {
                                $(".TripList").append(tempHtml);
                                clCount++;
                            }
                            
                        }

                        $(".TripList").find("li .tripBar").click(function () {
                            var obj = $(this).parent().find(".infoList");
                            if ($(this).parent().attr("data-isks") == "0") {
                                return;
                            }
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

                        $(".TripList").find("li").find("button").click(function () {
                            var trainNo = $(this).attr("data-trainNo");
                            var price = $(this).attr("data-price");
                            var seat = $(this).attr("data-seat");
                            var seatName = $(this).attr("data-seatName");
                            var sTime = $(this).attr("data-stime");
                            var tTime = $(this).attr("data-ttime");
                            var isPs = $(this).attr("data-isPs");
                            var sCity = $(this).attr("data-sCity");
                            var tCity = $(this).attr("data-tCity");
                            var sCode = $(this).attr("data-sCode");
                            var tCode = $(this).attr("data-tCode");
                            var queryKey = $(this).attr("data-queryKey");
                            if (isPs == 1) {
                                _T.trainNo = trainNo;
                                _T.price = price;
                                _T.seat = seat;
                                _T.seatName = seatName;
                                _T.sTime = sTime;
                                _T.tTime = tTime;
                                _T.queryKey = queryKey;
                                _T.sCity = sCity;
                                _T.sCode = sCode;
                                _T.tCity = tCity;
                                _T.tCode = tCode;
                                var s = JSON.stringify(_T);
                                var date = new Date();
                                date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
                                $.cookie("Trip_select", s, { path: '/', expires: date });
                                window.location = "c_train_order.html";
                            }
                            else {
                                return;
                            }
                        });
                    }
                    if (clCount == 0) {
                        if (_Trip.selectType == 0) {
                            $(".TripList").html("<li><div class='noResult'>抱歉，没有查询到" + _T.sCity + "-" + _T.tCity + "的动车票，可以尝试查询普通火车票。</li>");
                        }
                        else {
                            $(".TripList").html("<li><div class='noResult'>抱歉，没有查询到" + _T.sCity + "-" + _T.tCity + "的火车票</li>");
                        }
                    }
                }
                else {
                    $("#topBar").find(".am-u-sm-4").eq(0).html(_T.sDate.substr(5, 5) + "(" + _C.getWeek(_T.sDate) + ")<em>￥--元</em>");
                    if (_Trip.selectType == 0) {
                        $(".TripList").html("<li><div class='noResult'>抱歉，没有查询到" + _T.sCity + "-" + _T.tCity + "的动车票，可以尝试查询普通火车票。</li>");
                    }
                    else {
                        $(".TripList").html("<li><div class='noResult'>抱歉，没有查询到" + _T.sCity + "-" + _T.tCity + "的火车票</li>");
                    }
                    
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

        $(".TripList").find("li .tripBar").click(function () {
            var obj = $(this).parent().find(".infoList");
            if ($(this).parent().attr("data-isks") == "0") {
                return;
            }
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