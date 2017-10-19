var _Order = {
    Init: function () {
        _Order.initLayot();
        _C.initWx();
    },
    initLayot: function () {
        $("#btn_toSave").click(function () {
            _Order.doPay();
        });
    },
    doPay: function () {
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "text",
            cache: false,
            data: { fn: 92, t: new Date() },
            success: function (o) {
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
                            window.location = "c_order_all.html";
                        },
                        cancel: function (res) {
                            if (res.errMsg == "chooseWXPay:cancel") {
                                alert("为了给您安排，请尽快支付,如因未支付导致票价变动或者座位取消由您本人承担！");
                                window.location = "c_list.html";
                            }
                        }
                    });
                }

            }
        }
        );
    }
}


_Order.Init();


