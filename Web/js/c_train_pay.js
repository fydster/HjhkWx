var _List = {
    no: "",
    isTime: 0,
    Init: function () {

        if (_B.source == "0000") {
            _List.exOpenID = _U.openId;
        }
        if (_U.exOpenID == null) {
            _U.exOpenID = "";
        }
        if (_U.exOpenID.length > 0) {
            _List.exOpenID = _U.exOpenID;
        }

        _List.no = _C.getParam("no");

        _List.initLayot();
        _List.getTrainOrderInfo();
        _C.initWx();

        $("#btn_getOrder").click(function () {
            _List.getTrainOrderInfo();
        });

        window.onpopstate = function () {
            window.location = "c_order_all.html";
        }

    },
    initLayot: function () {

    },
    getTrainOrderInfo: function () {
        var template = $("#template_fare").html();
        var obj = $("#fare_list");
        $("#toast").show();
        $.ajax(
                {
                    url: _C.TrainServerUrl,
                    context: document.body,
                    dataType: "json",
                    cache: false,
                    data: { fn: 102,uid:_U.uid, orderNo: _List.no, t: new Date() },
                    success: function (o) {
                        $("#toast").hide();
                        if (o != null && o.Info != null) {
                            var oi = o.Info;
                            var allPrice = 0;
                            var trip = o.Info.trip[0];

                            var tripObj = $("#div_trip").find(".am-u-sm-4");
                            tripObj.eq(0).text(trip.fromCity);
                            tripObj.eq(2).text(trip.toCity);
                            tripObj.eq(4).text(trip.trainNo);
                            tripObj.eq(3).text(trip.sTime);
                            tripObj.eq(1).text(new Date(trip.tDate).pattern("yyyy-MM-dd"));
                            tripObj.eq(5).text(trip.tTime);
                            var price = 0;
                            var fare = o.Info.fare;
                            var fareInfo = "";
                            $("#fare_list").html("");
                            if (fare != null) {
                                for (var j = 0; j < fare.length; j++) {
                                    price = fare[j].price;
                                    if (price == 0) {
                                        price = trip.ticketPrice;
                                    }
                                    allPrice += price + parseInt(fare[j].insurePrice);
                                    fareInfo = template.replace("{passengerName}", fare[j].passengerName);
                                    fareInfo = fareInfo.replace("{price}", price);
                                    fareInfo = fareInfo.replace("{insurePrice}", fare[j].insurePrice);
                                    fareInfo = fareInfo.replace("{seatNo}", ":" + fare[j].seatNo);
                                    fareInfo = fareInfo.replace("{seatName}", trip.seatName);
                                    $("#fare_list").append(fareInfo);
                                }
                                $("#header_1").find(".am-u-sm-4").eq(0).html("￥" + allPrice + "元");
                            }

                            if (oi.state == 2) {
                                $("#span_state").text("待支付");
                                $("#span_state").css("color", "#ac0303");
                                $("#header_0").hide();
                                $("#header_1").show();
                                var intDef = (1000 * 60 * 25) - (Date.parse(new Date()) - Date.parse(oi.addOn));
                                if (intDef > 0) {
                                    timer(intDef);
                                }
                                else {
                                    weui.alert("支付超时，座位已被取消，请重新预定！", function () {
                                        window.location = "c_train_index.html";
                                    });
                                }
                                $("#header_1").find(".am-u-sm-4").eq(2).click(_List.doPay_Train);
                            }
                            if (oi.state == 8) {
                                weui.alert("已过支付时间期限，请重新预定！", function () {
                                    window.location = "c_train_index.html";
                                });
                            }
                        }
                    }
                }
        );
    },
    doPay_Train: function () {
        if (_List.isTime == 1) {           
            weui.alert("支付超时，座位已被取消，请重新预定！", function () {
                window.location = "c_train_index.html";
            });
        }
        $("#toast").show();
        var no = _List.no;
        $.ajax(
        {
            url: _C.TrainServerUrl,
            context: document.body,
            dataType: "text",
            cache: false,
            data: { fn: 5, uid: _U.uid,openId:_U.openId, orderNo: no, t: new Date() },
            success: function (o) {
                $("#toast").hide();
                if (o.length > 0) {
                    var os = o.split("|");
                    wx.chooseWXPay({
                        timestamp: os[4], // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: os[1], // 支付签名随机串，不长于 32 位
                        package: os[2], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                        signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: os[3], // 支付签名
                        success: function (res) {
                            // 支付成功后的回调函数
                            weui.alert("支付完成，系统正在为您出票！", function () {
                                window.location = "c_order_all.html?oType=1";
                            });
                        },
                        cancel: function (res) {
                            if (res.errMsg == "chooseWXPay:cancel") {
                                weui.alert("为了给您安排，请尽快支付,如因未支付导致座位取消由您本人承担！", function () {
                                    //window.location = "c_list.html";
                                });
                                
                            }
                        }
                    });
                }
                else {
                    weui.alert("支付失败，座位已被取消，请重新预定！", function () {
                        window.location = "c_train_index.html";
                    });
                }

            }
        }
        );
    }
}

function timer(intDiff) {
    var sid = window.setInterval(function () {
        var day = 0,
            hour = 0,
            minute = 0,
            second = 0;//时间默认值
        if (intDiff > 0) {
            day = Math.floor(intDiff / (1000 * 60 * 60 * 24));
            hour = Math.floor(intDiff / (1000 * 60 * 60)) - (day * 24);
            minute = Math.floor(intDiff / (1000 * 60)) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(intDiff / 1000) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        if (hour <= 9) hour = '0' + hour;
        $("#span_time").text("剩余支付时间 [ " + minute + "分:" + second + "秒 ] ");
        if (minute == 0 && second == 0 && hour == 0) {
            _List.isTime = 1;
            window.clearInterval(sid);
            weui.alert("支付超时，座位已被取消，请重新预定！", function () {
                window.location = "c_train_index.html";
            });
        }
        intDiff = intDiff - 1000;
    }, 1000);
}
