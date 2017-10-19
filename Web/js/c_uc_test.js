var _UC = {
    isOpenInfo: 0,
    Init: function () {
        _UC.initEvent();
        _UC.initUInfo();
    },
    initEvent: function () {
        $("#bottomMenu").find(".weui-flex__item").eq(0).click(function () {
            window.location = "c_index_home.html";
        });
        $("#bottomMenu").find(".weui-flex__item").eq(1).click(function () {
            window.location = "c_order_all.html";
        });

        $("#menu_01").find(".weui-cells .weui-cell").eq(0).click(function () {
            window.location = "c_order_all.html";
        });
        $("#menu_01").find(".weui-cells .weui-cell").eq(1).click(function () {
            window.location = "c_set_list.html";
        });
        $("#menu_01").find(".weui-cells .weui-cell").eq(2).click(function () {
            window.location = "c_voucher.html";
        });
        $("#menu_01").find(".weui-cells .weui-cell").eq(3).click(function () {
            window.location = "/app/hotel/orderList.html";
        });
        $("#menu_01").find(".weui-cells .weui-cell").eq(4).click(function () {
            _C.RedirectUrl("c_uc.html", 0, "snsapi_userinfo");
        });
    },
    initUInfo: function () {
        if (_U != null) {
            $("#div_uinfo").find("a").text(_U.uName);
            $("#div_uinfo").find("img").attr("src", _U.photoUrl);
        }
        else {
            $("#div_uinfo").find("a").text($.cookie("_NickName"));
            $("#div_uinfo").find("img").attr("src", $.cookie("_PhotoUrl"));
        }
    }
}