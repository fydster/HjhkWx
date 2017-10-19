var _Service = {
    isOpenInfo: 0,
    pid: 0,
    price: 0,
    Init: function () {
        var pidtemp = _C.getParam("pid");
        _Service.initLayot();
        _Service.getProduct(pidtemp);
        _C.initWx();
    },
    initLayot: function () {
        $(".am-icon-chevron-left").click(function () {
            window.location = "c_index_home.html";
        });
        $(".am-icon-home").click(function () {
            window.location = "c_index_home.html";
        });
        $(".am-topbar-fixed-bottom").find(".am-u-sm-4").click(function () {
            _C.C_ToCSS("pulse", $(this));
            _Service.addOrder();
        });
    },
    getProduct: function (pid) {
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 109,t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var obj = $("#div_Item");
				            var n = 0;
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                n++;
				                obj.append("<div class=\"am-u-sm-4\" data-price=\"" + oi.price + "\" data-name=\"" + oi.pName + "\" data-id=\"" + oi.id + "\"><img src=\"" + oi.imgUrl + "\"/></div>");
				                if (pid.length > 0) {
				                    if (pid == oi.id) {
				                        _Service.pid = pid;
				                        $("#div_product").html(oi.pName + "[<em>" + oi.price + "元</em>]");
				                        $("#div_Item").find(".am-u-sm-4").find("img").removeClass("noSelect").addClass("noSelect");
				                        $("#div_Item").find(".am-u-sm-4").eq(3).find("img").removeClass("noSelect");
				                    }
				                }
				            }
				            if (n % 3 > 0) {
				                for (var j = 0; j < (n % 3) ; j++) {
				                    obj.append("<div class=\"am-u-sm-4\"></div>");
				                }
				            }
				            $("#div_Item").find(".am-u-sm-4").click(function () {
				                var obj = $(this);
				                $("#div_product").text("---");
				                $("#div_Item").find(".am-u-sm-4").find("img").removeClass("noSelect").addClass("noSelect");
				                $(this).find("img").removeClass("noSelect");
				                _Service.pid = $(this).attr("data-id");
				                _C.C_ToCSS("zoomOutDown", obj);
				                setTimeout(function () {
				                    var id = obj.attr("data-id");
				                    var name = obj.attr("data-name");
				                    var price = obj.attr("data-price");
				                    _Service.pid = 0;
				                    _Service.price = 0;
				                    if (typeof (name) != "undefined") {
				                        _Service.pid = id;
				                        _Service.price = price;
				                        $("#div_product").html(name + "[<em>" + price + "元</em>]");
				                    }                                  
				                }, 600);
				            });
				        }
				    }
				}
		);
    },
    addOrder: function () {
        var pid = _Service.pid;
        var getDate = $("#input_date").val();
        var memo = $("#input_memo").val();
        var shopping = "1@" + pid + ",";
        if (pid == 0) {
            _C.C_ToCSS("shake", $("#div_product"));
            return;
        }
        $("#my-modal-loading").modal({ dimmer: true, width: 80, height: 80 }).modal("open");
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 103,uid:_U.uid,getDate:getDate,memo:memo,shopping:shopping,price:_Service.price, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            //
				            if (pid == 4) {
				                _Service.doPay(o.OrderNo);
				            }
				            else {
				                window.location = "c_ok.html";
				            }
				        }
				        else {
				            $("#my-modal-loading").modal('close');
				            alert(o.Msg);
				        }
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
            data: { fn: 99, orderNo: no, t: new Date() },
            success: function (o) {
                if (o.length > 0) {
                    var os = o.split("|");
                    //wc.appid + "|" + wc.nonce + "|" + wc.package + "|" + wc.signature + "|" + wc.timestamp;
                    //alert(o);
                    $("#my-modal-loading").modal('close');
                    wx.chooseWXPay({
                        timestamp: os[4], // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: os[1], // 支付签名随机串，不长于 32 位
                        package: os[2], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                        signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: os[3], // 支付签名
                        success: function (res) {
                            // 支付成功后的回调函数
                            window.location = "c_ok.html";
                        },
                        cancel: function (res) {
                            if (res.errMsg == "chooseWXPay:cancel") {
                                alert("为了给您安排，请尽快支付！");
                                window.location = "ok.html";
                            }
                        }
                    });
                }

            }
        }
        );
    }
}


_Service.Init();

