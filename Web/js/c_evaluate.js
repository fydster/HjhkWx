var _Evaluate = {
    bgNum: 1,
    no: "",
    isCp: 0,
    Init: function () {
        _Evaluate.initLayot();
        _Evaluate.no = _C.getParam("no");
    },
    initLayot: function () {
        var w = window.screen.width;
        var h = window.screen.height;
        $(".am-u-sm-8").find("span").click(function () {
            var num = $(this).attr("data-num");
            $(this).parent().find("span i").removeClass("am-icon-star").addClass("am-icon-star-o");
            for (var i = 0; i < parseInt(num) ; i++) {
                $(this).parent().find("span i").eq(i).removeClass("am-icon-star-o").addClass("am-icon-star");
            }
            _C.C_ToCSS("zoomIn", $(this).parent().find("span i"));
        });

        $(".am-tabs-nav").find("li").click(function () {
            if ($(this).attr("data-num").toString().length > 0) {
                _Evaluate.isCp = $(this).attr("data-num");
            }
        });

        $(".am-icon-chevron-left").click(function () {
            window.location = "c_order.html";
        });
        $(".am-icon-home").click(function () {
            window.location = "c_index_home.html";
        });
        $(".am-topbar-fixed-bottom").click(_Evaluate.addE);
        $(".am-tab-panel").find("button").click(function () {
            if ($(this).hasClass("am-icon-check")) {
                $(this).removeClass("am-icon-check");
            }
            else {
                $(this).removeClass("am-icon-check").addClass("am-icon-check");
            }
        });
    },
    addE: function () {
        //var target1 = $(".am-u-sm-8").eq(1).find(".am-icon-star").length;
        //var target2 = $(".am-u-sm-8").eq(2).find(".am-icon-star").length;
        var item = "";
        var obj = $(".am-tab-panel").eq(0);
        if (_Evaluate.isCp == 1) {
            obj = $(".am-tab-panel").eq(1);
        }
        obj.find(".am-icon-check").each(function () {
            item += $(this).text()+",";
        });
        var memo = $("#memo").val();
        $("#my-modal-loading").modal({ dimmer: true, width: 80, height: 80 }).modal("open");
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 14, uid: _U.uid, isCp:_Evaluate.isCp,item:item, memo: memo, orderNo: _Evaluate.no, t: new Date() },
				    success: function (o) {
				        $("#my-modal-loading").modal('close');
				        if (o.Return == 0) {
				            window.location = "c_ok.html?s=1";
				        }
				        else {
				            alert(o.Msg);
				        }
				    }
				}
		);
    }
}


_Evaluate.Init();
