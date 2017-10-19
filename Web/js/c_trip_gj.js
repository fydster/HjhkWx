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
        $(".blockBtn").click(function () {
            _Trip.addOrder();
        });
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
            window.location = "c_index_gj.html";
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

    },
    Select: function () {
        $(".TripList").html("");
        $("#my-modal-loading").modal("open");
        var t = $("#fliht_template").html();
        var tc = $("#class_template").html();
        var date = _F.sDate;
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 207, t: new Date() },
            success: function (o) {
                $("#my-modal-loading").modal("close");
                if (o.Return == 0) {
                    if (o.List != null) {
                        for (var i = 0; i < o.List.length; i++) {
                            var oi = o.List[i];
                            if (oi.sCode == _F.sCode && oi.tCode == _F.tCode) {
                                $("#change_01").show();
                                $("#change_02").show();
                                /*
                                 var template = $("#fliht_template").html();
                                 tempHtml = template.replace(/{sTime}/g, oi.sTime);
                                 tempHtml = tempHtml.replace(/{sPort}/g, oi.sPort);
                                 tempHtml = tempHtml.replace(/{sTemeinal}/g, oi.sT);
                                 tempHtml = tempHtml.replace(/{tTime}/g, oi.tTime);
                                 tempHtml = tempHtml.replace(/{tPort}/g, oi.tPort);
                                 tempHtml = tempHtml.replace(/{tTemeinal}/g, oi.tT);
                                 tempHtml = tempHtml.replace(/{lowPrice}/g, oi.price);
                                 tempHtml = tempHtml.replace(/{lowZhekou}/g, "(往返价格)");
                                 tempHtml = tempHtml.replace(/{airCoNo}/g, oi.airCoNo);
                                 tempHtml = tempHtml.replace(/{airCo}/g, oi.airCo);
                                 tempHtml = tempHtml.replace(/{plane}/g, oi.plane);

                                ct = $("#class_template").html();
                                var cHtml = ct.replace(/{price}/g, oi.price);


                                var tempHtml = tempHtml.replace("{classList}", cHtml);
                                $(".TripList").append(tempHtml);
                                */
                                $(".inline").find("span").eq(0).text(new Date(_F.sDate).pattern("MM-dd"));
                                $(".inline").find("span").eq(1).text(_C.getWeek(new Date(_F.sDate).pattern("yyyy-MM-dd")));
                                $(".inline").find("span").eq(2).text(oi.sCode + "-" + oi.tCode);

                                $(".flihtPanel").find(".am-u-sm-3").eq(0).find("span").eq(0).text(oi.sTime);
                                $(".flihtPanel").find(".am-u-sm-3").eq(0).find("span").eq(2).text(oi.zzsTime);

                                $(".flihtPanel").find(".am-u-sm-3").eq(1).find("span").eq(0).text(oi.airCo);
                                $(".flihtPanel").find(".am-u-sm-3").eq(1).find("span").eq(1).text(oi.plane);

                                $(".flihtPanel").find(".am-u-sm-3").eq(2).find("span").eq(0).text(oi.zztTime);
                                $(".flihtPanel").find(".am-u-sm-3").eq(2).find("span").eq(2).text(oi.tTime);

                                $(".flihtPanel").find(".am-u-sm-3").eq(3).find("span").eq(0).text(oi.airCo);
                                $(".flihtPanel").find(".am-u-sm-3").eq(3).find("span").eq(1).text(oi.plane);

                                $(".flihtPanel").find(".am-u-sm-5").eq(0).find("span").eq(0).text(oi.sPort);
                                $(".flihtPanel").find(".am-u-sm-5").eq(0).find("span").eq(2).text(oi.zzPort);

                                $(".flihtPanel").find(".am-u-sm-5").eq(1).find("span").eq(0).text(oi.zzPort);
                                $(".flihtPanel").find(".am-u-sm-5").eq(1).find("span").eq(2).text(oi.tPort);

                                $("#changeCity").text(oi.zzCity);

                                if (oi.zzCity.length == 0) {
                                    $("#change_01").hide();
                                    $("#change_02").hide();
                                    $(".flihtPanel").find(".am-u-sm-3").eq(0).find("span").eq(2).text(oi.tTime);
                                    $(".flihtPanel").find(".am-u-sm-5").eq(0).find("span").eq(2).text(oi.tPort);
                                }

                                if (oi.airCoNo == "CZ") {
                                    $(".pricePanel").find(".am-u-sm-6").eq(1).text("￥" + oi.price + "起 [机票+签证]");
                                    $(".pricePanel").find(".am-u-sm-6").eq(3).text("￥" + oi.tax + "(参考)");
                                }
                                else {
                                    $(".pricePanel").find(".am-u-sm-6").eq(1).text("￥" + oi.price + "起");
                                    $(".pricePanel").find(".am-u-sm-6").eq(3).text("￥" + oi.tax + "(参考)");
                                }

                                _F.gj = JSON.stringify(oi);
                                var date = new Date();
                                date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
                                $.cookie("Trip_select", JSON.stringify(_F), { path: '/', expires: date });
                            }
                        }

                        /*
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
                        */
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
    addOrder: function () {
        var mobile = $("#mobile").val();
        var contact = $("#contact").val();
        var memo = "航段：" + _F.sCity + " 至 " + _F.tCity + "，日期：" + _F.sDate;
        if (mobile.length < 7 || contact.length == 0) {
            alert("请正确填写姓名和电话，以便客服及时联系您！");
            return;
        }
        //alert(_U.uid);
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 208, uid: _U.uid,memo:memo, contact: contact, mobile: mobile, t: new Date() },
            success: function (o) {
                $("#my-modal-loading").modal("close");
                if (o.Return == 0) {
                    window.location = "c_order_gj.html";
                }
                else {
                    alert("提交异常，请稍后再试！");
                }
            }
        }
        );
    },
    initSearch: function () {

    }
}


_Trip.Init();
