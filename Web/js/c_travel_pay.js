var _Travel = {
    price: 0,
    no: "",
    num: 0,
    orderId: 0,
    Init: function () {
        _C.initWx();
        _Travel.no = _C.getParam("no");
        _Travel.orderId = _C.getParam("orderId");
        if (_Travel.no.length > 0 && _Travel.orderId > 0) {
            _Travel.InitInfo();
        }
    },
    InitInfo: function () {
        $.showLoading();
        $.ajax(
        {
            url: "/service/travelHandler.ashx",
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 13, uid: _U.uid, orderNo: _Travel.no, t: new Date() },
            success: function (o) {
                $.hideLoading();
                if (o.Return == 0) {
                    var obj = $(".weui-form-preview__value");
                    var oi = o.Info;
                    obj.eq(0).text(oi.totalPrice);
                    obj.eq(1).text(oi.productName);
                    obj.eq(2).text(new Date(oi.ticketOn).pattern("yyyy-MM-dd"));
                    $("#btn_pay").click(function () {
                        _Travel.GetStatus();
                    });
                }
            }
        }
        );
    },
    GetStatus: function () {
        $.showLoading();
        $.ajax(
        {
            url: "/service/travelHandler.ashx",
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 5, uid: _U.uid, orderId: _Travel.orderId, t: new Date() },
            success: function (o) {
                if (o.errorCode == 231000) {
                    _Travel.num++;
                    if (o.data.orderStatus == "待付款") {
                        _Travel.doPay(_Travel.no);
                    }
                    else {
                        if (_Travel.num > 8) {
                            $.alert("预定失败，门票异常,请重新提交", function () {
                                history.back(-1);
                            });
                        }
                        else {
                            setTimeout(_Travel.GetStatus, 2000);
                        }
                    }
                }
            }
        }
        );
    },
    doPay: function (no) {
        $.ajax(
        {
            url: "/service/travelHandler.ashx",
            context: document.body,
            dataType: "text",
            cache: false,
            data: { fn: 14, uid: _U.uid, openId: _U.openId, orderNo: no, t: new Date() },
            success: function (o) {
                $.hideLoading();
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
                            $.alert("支付完成，系统正在为您出票！", function () {
                                window.location = "c_travel_list.html?oType=1";
                            });
                        },
                        cancel: function (res) {
                            if (res.errMsg == "chooseWXPay:cancel") {
                                $.alert("为了给您安排，请尽快支付！", function () {
                                    window.location = "c_travel_list.html?oType=1";
                                });

                            }
                        }
                    });
                }
                else {
                    $.alert("支付失败，门票预定失败，请重新预定！", function () {
                        window.location = "c_travel_home.html";
                    });
                }

            }
        }
        );
    }
}


_Travel.Init();
