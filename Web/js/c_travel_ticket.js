var ticketInfo = null;
var _Travel = {
    productID: 0,
    scenicId: "",
    beginDate: "",
    endDate: "",
    startTime: "",
    price: 0,
    Init: function () {
        _Travel.productID = _C.getParam("productID");
        _Travel.scenicId = _C.getParam("scenicId");
        if (_Travel.productID.length > 0) {
            _Travel.InitInfo();
        }
        $("#TimeSelect").click(function () {
            $("#MainInfo").hide();
            _DRP.init("date-range-picker", dateChooseCallback, _Travel.beginDate, _Travel.endDate, ticketInfo);
        });
        function dateChooseCallback(begin, end, price) {
            $("#MainInfo").show();
            $("#TimeSelect").find("span").text(begin);
            _Travel.startTime = begin;
            $("#TimeSelect").find("em").text("￥" + price + "元");
            _Travel.price = price;
            _Travel.countPrice();
        }
        $(".dataPanel").find("span").eq(0).click(function () {
            var num = $(".dataPanel").find("span").eq(1).text();
            num++;
            if (num > 99) {
                num = 99;
                $.toast("最多99张");
            }
            $(".dataPanel").find("span").eq(1).text(num);
            _Travel.countPrice();
        });
        $(".dataPanel").find("span").eq(2).click(function () {
            var num = $(".dataPanel").find("span").eq(1).text();
            num--;
            if (num < 1) {
                num = 1;
                $.toast("不能再少了哦");
            }
            $(".dataPanel").find("span").eq(1).text(num);
            _Travel.countPrice();
        });

        $(".content").find(".rightPanel").click(function () {
            $("#bookNotice").show();
            $(".weui-icon-cancel").click(function () {
                $("#bookNotice").hide();
            });
        });

        $("#bottomMenu").find(".weui-flex__item").eq(1).click(function () {
            _Travel.addOrder();
        });

    },
    countPrice: function () {
        var num = $(".dataPanel").find("span").eq(1).text();
        var allPrice = parseInt(num) * parseFloat(_Travel.price);
        $("#bottomMenu").find("em").text("￥" + allPrice.toFixed(2) + "元");
    },
    InitInfo: function () {
        $.ajax(
        {
            url: "/service/travelHandler.ashx",
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 2, productID: _Travel.productID, t: new Date() },
            success: function (o) {
                if (o.errorCode == 231000) {
                    var info = o.data;
                    if (info != null) {
                        $(".content").find(".leftPanel").append(info.productName);
                        $("#TimeSelect").find("em").text("[" + info.salePrice + "元起]");
                        if (info.priceCalendar != null && info.priceCalendar.length > 0) {
                            _Travel.beginDate = info.priceCalendar[0].departDate;
                            _Travel.endDate = info.priceCalendar[info.priceCalendar.length - 1].departDate;
                        }
                        $("#bookNotice").find("div").eq(1).html(info.bookNotice.replace(/\n/g,"<br>"));
                        ticketInfo = info.priceCalendar;
                    }
                }
            }
        }
        );
    },
    addOrder: function () {
        var contactName = $("#contactName").val();
        var contactTel = $("#contactTel").val();
        var bookNumber = $(".dataPanel").find("span").eq(1).text();
        if (_Travel.price == 0) {
            $.toast("请选择日期");
            return;
        }
        if (contactName.length == 0) {
            $.alert("请输入正确的姓名，以免取票失败");
            return;
        }
        if (!_C.IsValidMobile(contactTel)) {
            $.alert("请输入正确的手机号码，以免接收短信失败");
            return;
        }
        $.showLoading();
        $.ajax(
        {
            url: "/service/travelHandler.ashx",
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 4, uid: _U.uid,contactName:contactName,contactTel:contactTel,bookNumber:bookNumber,price:_Travel.price,startTime: _Travel.startTime, scenicId: _Travel.scenicId, productID: _Travel.productID, t: new Date() },
            success: function (o) {
                $.hideLoading();
                if (o.Return == 0) {
                    window.location = "c_travel_pay.html?no=" + o.Msg + "&orderId=" + o.orderId;
                }
                else {
                    $.alert(o.Msg);
                }
            }
        }
        );
    }
}