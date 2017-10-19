var _OrderList = {
    isOpenInfo: 0,
    userNum: 0,
    Init: function () {
        $(".weui-vcode-btn").click(_OrderList.getList);
        $("#btn_countType").find("a").eq(0).click(_OrderList.getSourceList);
        $("#btn_countType").find("a").eq(1).click(_OrderList.getSrcList);
        $("#btn_CountYG").find("a").eq(0).click(_OrderList.getList);
        $("#btn_CountYG").find("a").eq(1).click(_OrderList.getSrcListForYG);
        //处理返回键
        window.onpopstate = function () {
            if (_OrderList.isOpenInfo == 1) {
                $(".close-popup").click();
                _OrderList.isOpenInfo == 0;
            }
        }

        var NowDate = new Date();
        NowDate = new Date(NowDate).pattern("yyyy-MM-dd");
        $("#eDate").val(NowDate);
    },
    getList: function () {
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val();
        if (sDate.length == 0 || eDate.length == 0) {
            $.alert("请选择日期");
            return;
        }
        _OrderList.userNum = 0;
        $.showLoading();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 210,uid:_U.uid, sDate:sDate,eDate:eDate,t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        if (o.Return == 0) {
				            var obj = $("#infoList").find(".weui-cell__ft");
				            obj.eq(0).html(o.Info.userCount);
				            _OrderList.userNum = parseInt(o.Info.userCount);
				            obj.eq(1).html(o.Info.userCountNo);
				            obj.eq(2).html(parseInt(o.Info.userCount) - parseInt(o.Info.userCountNo));
				            obj.eq(3).html(parseInt(o.Info.searchCount) + parseInt(o.Info.trainSearchCount) + parseInt(o.Info.hotelSearchCount));
				            obj.eq(4).html(o.Info.searchCount);
				            obj.eq(5).html(o.Info.trainSearchCount);
				            obj.eq(6).html(o.Info.hotelSearchCount);
				            obj.eq(7).html(o.Info.shareF);
				            obj.eq(8).html(o.Info.shareP);
				            obj.eq(9).html(o.Info.trainOrderCount);
				            obj.eq(10).html(o.Info.trainFareCount);
				            obj.eq(11).html(o.Info.airOrderCount);
				            obj.eq(12).html(o.Info.airFareCount);
				            obj.eq(13).html(o.Info.hotelOrderCount);
				            obj.eq(14).html(o.Info.hotelRoomsCount);
				        }
				        else {
				            $.alert(o.Msg);
				        }
				    }
				}
		);
    },
    getSourceList: function () {
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val();
        if (sDate.length == 0 || eDate.length == 0) {
            $.alert("请选择日期");
            return;
        }
        var obj = $("#count_source").find(".weui-cells");
        obj.html("");
        $.showLoading();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 211, uid: _U.uid, sDate: sDate, eDate: eDate, t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        if (o.Return == 0) {
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                obj.append("<div class=\"weui-cell\"><div class=\"weui-cell__bd\"><p>" + oi.sName + "</p></div><div class=\"weui-cell__ft\">" + oi.uNum + "</div></div>");
				            }
				            $("#btn_showPop").click();
				            _OrderList.isOpenInfo = 1;
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
    getSrcList: function () {
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val();
        if (sDate.length == 0 || eDate.length == 0) {
            $.alert("请选择日期");
            return;
        }
        var obj = $("#count_source").find(".weui-cells");
        obj.html("");
        $.showLoading();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 212, uid: _U.uid, sDate: sDate, eDate: eDate, t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        if (o.Return == 0) {
				            var qt = 0;
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                obj.append("<div class=\"weui-cell\"><div class=\"weui-cell__bd\"><p>" + oi.nickName + "</p></div><div class=\"weui-cell__ft\">" + oi.uNum + "</div></div>");
				                qt += parseInt(oi.uNum);
				            }
				            qt = _OrderList.userNum - qt;
				            obj.append("<div class=\"weui-cell\"><div class=\"weui-cell__bd\"><p>其他</p></div><div class=\"weui-cell__ft\">" + qt + "</div></div>");
				            $("#btn_showPop").click();
				            _OrderList.isOpenInfo = 1;
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
    getSrcListForYG: function () {
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val();
        if (sDate.length == 0 || eDate.length == 0) {
            $.alert("请选择日期");
            return;
        }
        var obj = $("#count_source").find(".weui-cells");
        obj.html("");
        $.showLoading();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 213, uid: _U.uid, sDate: sDate, eDate: eDate, t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        if (o.Return == 0) {
				            var qt = 0;
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                obj.append("<div class=\"weui-cell\"><div class=\"weui-cell__bd\"><p>" + oi.nickName + "</p></div><div class=\"weui-cell__ft\">" + oi.uNum + "</div></div>");
				                qt += parseInt(oi.uNum);
				            }
				            obj.append("<div class=\"weui-cell\"><div class=\"weui-cell__bd\"><p>总计</p></div><div class=\"weui-cell__ft\">" + qt + "</div></div>");
				            $("#btn_showPop").click();
				            _OrderList.isOpenInfo = 1;
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


_OrderList.Init();
