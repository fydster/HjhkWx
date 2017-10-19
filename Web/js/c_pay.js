var _Order = {
    exOpenID: "",
    no: "",
    Init: function () {
        if (_U.uid == 0 && $.cookie("seascape_def_USER_ID") != null) {
            _U.uid = $.cookie("seascape_def_USER_ID");
        }

        var code = _C.getParam("code");
        var no = _C.getParam("no");

        if (_B.source == "0000") {
            _Order.exOpenID = _U.openId;
        }
        if (_U.exOpenID == null) {
            _U.exOpenID = "";
        }
        if (_U.exOpenID.length > 1) {
            _Order.exOpenID = _U.exOpenID;
        }

        var price = 0;
        if ($.cookie("_Pirce") != null) {
            price = $.cookie("_Pirce");
            $.cookie("_Pirce", null);
        }

        if ($.cookie("_OrderNo") != null && no.length == 0) {
            _Order.no = $.cookie("_OrderNo");
            $.cookie("_OrderNo", null);
        }
        else {
            _Order.no = no;
            $.cookie("_OrderNo", null);
        }

        //alert(_Order.no);

        $("#priceInfo").text("￥" + price + ".00");

        _C.initWx();
        $("#toast").show();
        /*
        alert(code);
        alert(_Order.exOpenID);
        alert(_Order.exOpenID.length);
        alert(_Order.no);
        */

        wx.ready(function () {
            if (code.length > 0 && _Order.exOpenID.length < 10) {
                _Order.getExOpenId(code);
            }
            else {
                if (_Order.no.length > 0) {
                    _Order.doPay(_Order.no);
                }
            }
        });

    },
    getExOpenId: function (code) {
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 1, code: code, uid: _U.uid, source: "0000", t: new Date() },
				    success: function (o) {
				        //alert(o.Return);
				        if (o.Return == 0) {
				            if (o.Msg.length > 0) {
				                _U.exOpenID = o.Msg;
				                var date = new Date();
				                date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
				                $.cookie("_UserInfo", JSON.stringify(_U), { path: '/', expires: date });
				                _Order.exOpenID = o.Msg;
				                _Order.doPay(_Order.no);
				            }
				        }
				    }
				}
		);
    },
    SendTipMessage: function (isPay) {
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 90, isPay: isPay, uid: _U.uid, t: new Date() },
				    success: function (o) {
				        window.location = "c_order_all.html";
				    }
				}
		);
    },
    doPay: function (no) {
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "text",
            cache: false,
            data: { fn: 99,uid:_U.uid,openId:_Order.exOpenID,orderNo: no, t: new Date() },
            success: function (o) {
                $("#toast").hide();
                if (o.length > 0) {
                    //alert(o);
                    var os = o.split("|");
                    wx.chooseWXPay({
                        timestamp: os[4], // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: os[1], // 支付签名随机串，不长于 32 位
                        package: os[2], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                        signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: os[3], // 支付签名
                        success: function (res) {
                            // 支付成功后的回调函数
                            //window.location = "c_list.html";
                            _Order.SendTipMessage(2);
                        },
                        cancel: function (res) {
                            if (res.errMsg == "chooseWXPay:cancel") {
                                alert("为了不影响您的出行，请尽快完成支付，如因未支付导致票价变动或座位取消由您本人承担！");
                                _Order.SendTipMessage(1);
                            }
                        }
                    });
                }

            }
        }
        );
    }
}

