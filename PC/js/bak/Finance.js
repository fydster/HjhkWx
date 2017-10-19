var _Finance = {
    Default_Page_Size: 100,
    Page_Now: 1,
    bType: -1,
    init: function () {
        var NowDate = new Date().pattern("yyyy-MM-dd");
        $('#DateS').val(NowDate);
        $('#DateE').val(NowDate);
        $('#DateS').datetimepicker({
            lang: 'ch',
            timepicker: false,
            format: 'Y-m-d',
            formatDate: 'Y-m-d'
        });
        $('#DateE').datetimepicker({
            lang: 'ch',
            timepicker: false,
            format: 'Y-m-d',
            formatDate: 'Y-m-d'
        });
        $("#btn_select").unbind().bind("click", function () {
            _Finance.getList(1);
        });
        $("#btn_bType").find("span").unbind().bind("click", function () {
            _Finance.bType = $(this).attr("title");
            _Finance.getList(_Finance.Page_Now);
        });
        _Finance.getList(1);
    },
    SumPage: function (page) {
        _Finance.getList(page);
    },
    getList: function (page) {
        //_UserInfo.hideUserInfo();
        _Finance.Page_Now = page;
        var htmlHead = "<tr><th width=\"120\">下单时间</th><th width=\"120\">支付时间</th><th width=\"50\">类型</th><th width=\"80\">用户</th><th width=\"70\">应收(元)</th><th width=\"70\">成本价(元)</th><th width=\"70\">毛利(元)</th><th width=\"70\">状态</th></tr>";
        var template = "<tr class=\"{c}\"><td>{8}</td><td>{3}</td><td>{4}</td><td>{1}</td><td>{2}</td><td>{5}</td><td>{6}</td><td>{7}</td></tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        var orderNo = $("#orderNo").val();
        $("#SysLogList").html("载入中.....");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 31, bType: _Finance.bType,perPage:_Finance.Default_Page_Size, orderNo: orderNo, page: page, DateE: DateE, DateS: DateS, page: page, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#SysLogList").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            var enable = "";
				            var allPrice = 0;
				            var price = 0;
				            var subPrice = 0;
				            var wxCardFee = 0;
				            var cbPrice = 0;
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                allPrice += parseFloat(oi.allPrice);
				                cbPrice += parseFloat(oi.cbPrice);
				                tempHtml = template.replace("{1}", oi.userName);
				                tempHtml = tempHtml.replace("{uid}", oi.userId);
				                tempHtml = tempHtml.replace("{2}", oi.allPrice);
				                if (oi.state == 8) {
				                    tempHtml = tempHtml.replace("{3}", new Date(oi.payOn).pattern("yyyy-MM-dd HH:mm"));
				                }
				                else {
				                    tempHtml = tempHtml.replace("{3}", "未收款");
				                }
				                tempHtml = tempHtml.replace("{8}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
			                    tempHtml = tempHtml.replace("{4}", oi.payType.toString().replace("0", "<span class=\"badge bg-red-light\">微信支付</span>").replace("1", "<span class=\"badge bg-blue-light\">现金支付</span>").replace("2", "<span class=\"badge bg-blue-light\">余额支付</span>"));
			                    tempHtml = tempHtml.replace("{5}", parseFloat(oi.cbPrice).toFixed(1));
			                    tempHtml = tempHtml.replace("{6}", (parseFloat(oi.allPrice)-parseFloat(oi.cbPrice)).toFixed(1));
				                tempHtml = tempHtml.replace("{7}", _Init.getState(oi.state));
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#SysLogList").append(tempHtml);
				            }
				            tempHtml = template.replace("{1}", "");
				            tempHtml = tempHtml.replace("{2}", allPrice);
				            tempHtml = tempHtml.replace("{3}", "汇总");
				            tempHtml = tempHtml.replace("{4}", "");
				            tempHtml = tempHtml.replace("{8}", "");
				            tempHtml = tempHtml.replace("{5}", parseFloat(cbPrice).toFixed(1));
				            tempHtml = tempHtml.replace("{6}", (parseFloat(allPrice) - parseFloat(cbPrice)).toFixed(1));
				            tempHtml = tempHtml.replace("{7}", "");
				            $("#SysLogList").append(tempHtml);
				            _Init.ShowPage(page, o.Msg, "_Finance", _Finance.Default_Page_Size);
				            //_Finance.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#SysLogList").html("无记录");
				            $("#PagePanel").hide();
				        }
				    }
				}
		);
    }
}