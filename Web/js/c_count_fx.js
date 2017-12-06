var _Count = {
    isOpenInfo: 0,
    userNum: 0,
    Init: function () {
        _Count.FxCheck();
    },
    initEvent: function () {
        $("#btn_CountYG").click(_Count.getList);
        $(".weui-vcode-btn").eq(0).click(_Count.getUserList);
        $(".weui-vcode-btn").eq(2).click(_Count.getOrderList);
        //处理返回键
        window.onpopstate = function () {
            if (_Count.isOpenInfo == 1) {
                $(".close-popup").click();
                _Count.isOpenInfo == 0;
            }
        }

        $("#nickName").text("[" + $.cookie("_Contact") + "]");
        $("#ShowQrcode").find("img").attr("src", "/pic/fxcode/" + $.cookie("seascape_def_USER_ID") + ".jpg");

        $("#btn_Qrcode").click(function () {
            $("#ShowQrcode").popup();
        });

        var NowDate = new Date();
        NowDate = new Date(NowDate).pattern("yyyy-MM-dd");
        $("#eDate").val(NowDate);
        $("#sDate").val(NowDate);
    },
    FxCheck: function () {
        $.showLoading();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 304, uid: $.cookie("seascape_def_USER_ID"), openId: $.cookie("_OpenId"), t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        if (o.Return == 0) {
				            _Count.initEvent();
				        }
				        else {
				            $.alert(o.Msg, function () {
				                window.location = "/c_uc.html";
				            });
				        }
				    }
				}
		);
    },
    getList: function () {
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val();
        if (sDate.length == 0 || eDate.length == 0) {
            $.alert("请选择日期");
            return;
        }
        $.showLoading();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 300, uid: $.cookie("seascape_def_USER_ID"), openId: $.cookie("_OpenId"), sDate: sDate, eDate: eDate, t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        if (o.Return == 0) {
				            var obj = $("#infoList").find(".weui-cell__ft");
				            var obj_ = $("#infoList").find(".weui-cell__bd");
				            obj_.eq(0).html(o.Info.userCount);
				            obj_.eq(1).html(o.Info.userCancel);
				            obj_.eq(2).html(o.Info.airOrderCount);
				            obj_.eq(3).html(o.Info.airFareCount);
				            obj_.eq(4).html(o.Info.insuranceCount);
				            obj_.eq(5).html(o.Info.refundCount);
				        }
				        else {
				            $.alert(o.Msg);
				        }
				    }
				}
		);
    },
    getUserList: function () {
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val();
        if (sDate.length == 0 || eDate.length == 0) {
            $.alert("请选择日期");
            return;
        }
        var obj = $("#count_source").find(".weui-cells");
        var template = $("#template").html();
        obj.html("");
        $.showLoading();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 302, uid: $.cookie("seascape_def_USER_ID"), openId: $.cookie("_OpenId"), sDate: sDate, eDate: eDate, t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        if (o.Return == 0) {
				            var qt = 0;
				            var tempHtml = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                tempHtml = template.replace("{photoUrl}", oi.photoUrl);
				                tempHtml = tempHtml.replace("{nickName}", oi.nickName);
				                tempHtml = tempHtml.replace("{isSubscribe}", oi.isSubscribe.toString().replace("0", "<span style=\"border:1px solid #eee;font-size:0.6rem;color:#999;\">已取消</span>").replace("1",""));
				                tempHtml = tempHtml.replace("{addOn}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				                obj.append(tempHtml);
				            }
				            $("#btn_showPop").click();
				            _Count.isOpenInfo = 1;
				            var json = { time: new Date().getTime() };
				            window.history.pushState(json, "http://hjhk.edmp.cc/loading.html?action=0");
				        }
				        else {
				            $.alert(o.Msg);
				        }
				    }
				}
		);
    },
    getOrderList: function () {
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val();
        if (sDate.length == 0 || eDate.length == 0) {
            $.alert("请选择日期");
            return;
        }
        var obj = $("#count_source").find(".weui-cells");
        var template = $("#template_order").html();
        obj.html("");
        $.showLoading();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 301, uid: $.cookie("seascape_def_USER_ID"), openId: $.cookie("_OpenId"), sDate: sDate, eDate: eDate, t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        if (o != null) {
				            var qt = 0;
				            var tempHtml = "";
				            for (var i = 0; i < o.length; i++) {
				                var oi = o[i];
				                tempHtml = template.replace("{ticket_count}", oi.ticket_count);
				                tempHtml = tempHtml.replace("{Fliht_interval}", oi.Fliht_interval);
				                tempHtml = tempHtml.replace("{Record_time}", new Date(oi.Record_time).pattern("yyyy-MM-dd HH:mm"));
				                obj.append(tempHtml);
				            }
				            $("#btn_showPop").click();
				            _Count.isOpenInfo = 1;
				            var json = { time: new Date().getTime() };
				            window.history.pushState(json, "http://hjhk.edmp.cc/loading.html?action=0");
				        }
				        else {
				            $.alert(o.Msg);
				        }
				    }
				}
		);
    }
}
