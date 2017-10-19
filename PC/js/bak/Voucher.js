var _Voucher = {
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
            _Voucher.getBalanceList(1);
        });
        $("#btn_bType").find("span").unbind().bind("click", function () {
            _Voucher.bType = $(this).attr("title");
            _Voucher.getBalanceList(_Voucher.Page_Now);
        });
        $("#btn_VoucherMsg").unbind().bind("click", _Voucher.VoucherMsg);
        _Voucher.getBalanceList(1);
    },
    SumPage: function (page) {
        _Voucher.getBalanceList(page);
    },
    getBalanceList: function (page) {
        _UserInfo.hideUserInfo();
        _Voucher.Page_Now = page;
        var htmlHead = "<tr><th width=\"160\">时间</th><th width=\"50\">类型</th><th width=\"80\">用户(点击查看详情)</th><th width=\"200\">面值</th><th width=\"70\">实际使用金额</th><th width=\"70\">来源</th><th width=\"70\">状态</th></tr>";
        var template = "<tr class=\"{c}\"><td>{3}</td><td>{4}</td><td onclick=\"_Init.showUserInfo({uid});\">{1}</td><td>{2}</td><td>{5}</td><td onclick=\"_Init.showUserInfo({srcUid});\">{6}</td><td>{7}</td></tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        var orderNo = $("#orderNo").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 30, bType:_Voucher.bType,orderNo:orderNo,page: page, DateE: DateE, DateS: DateS, page: page, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#SysLogList").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            var enable = "";
				            var voucherFee = 0;
				            var useFee = 0;
				            var voucherName = "";
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                voucherFee += parseInt(oi.voucherFee);
				                useFee += parseFloat(oi.useFee);
				                tempHtml = template.replace("{1}", oi.userName);
				                tempHtml = tempHtml.replace("{2}", oi.voucherFee);
			                    tempHtml = tempHtml.replace("{3}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
			                    tempHtml = tempHtml.replace("{4}", _Voucher.getVoucherName(oi.voucherType));
				                tempHtml = tempHtml.replace("{5}", oi.useFee);
				                tempHtml = tempHtml.replace("{6}", oi.srcUserName == null ? "" : oi.srcUserName);
				                enable = "未用";
				                if (oi.enable == 1) {
				                    enable = "<span class=\"badge bg-green-light\">已用</span>";
				                }
				                tempHtml = tempHtml.replace("{7}", enable);
				                tempHtml = tempHtml.replace("{c}", cName);
				                tempHtml = tempHtml.replace("{uid}", oi.uid);
				                tempHtml = tempHtml.replace("{srcUid}", oi.srcUid);
				                $("#SysLogList").append(tempHtml);
				            }
				            tempHtml = template.replace("{1}", "");
				            tempHtml = tempHtml.replace("{2}", voucherFee);
				            tempHtml = tempHtml.replace("{3}", "汇总");
				            tempHtml = tempHtml.replace("{4}", "");
				            tempHtml = tempHtml.replace("{5}", useFee);
				            tempHtml = tempHtml.replace("{6}", "");
				            tempHtml = tempHtml.replace("{7}", "");
				            $("#SysLogList").append(tempHtml);
				            _Init.ShowPage(page, o.Msg, "_Voucher", _Voucher.Default_Page_Size);
				            //_Voucher.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#SysLogList").html("无记录");
				            $("#PagePanel").hide();
				        }
				    }
				}
		);
    },
    VoucherMsg: function () {
        if (!confirm("确定要发送代金券到期提醒消息吗,发送前请查看日志今日是否已发送，建议每隔3到5天发送一次！")) {
            return false;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 92, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				    }
				}
		);
    },
    getVoucherName: function (voucherType) {
        var vName = "<span class=\"badge bg-red-light\">代金券</span>";
        return vName;
    }
}