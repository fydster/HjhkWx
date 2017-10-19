var _SysLog = {
    Default_Page_Size: 100,
    Page_Now: 1,
    employeeS: "",
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
            _SysLog.getLogList(1);
        });
        _SysLog.initEmployee();
        _SysLog.getLogList(1);
    },
    initEmployee: function () {
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 28, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#WorkNo").html("<option value=\"\">--全部--</option>");
				            for (var i = 0; i < o.List.length; i++) {
				                var ci = o.List[i];
				                _SysLog.employeeS += ci.name + "|" + ci.workNo + "|" + ci.tel + "|" + ci.isService + ",";
				                $("#WorkNo").append("<option value=\"" + ci.workNo + "\">" + ci.name + "</option>");
				            }
				        }
				    }
				}
		);
    },
    SumPage: function (page) {
        _SysLog.getLogList(page);
    },
    getLogList: function (page) {
        //_UserInfo.hideUserInfo();
        _SysLog.Page_Now = page;
        var htmlHead = "<tr><th width=\"100\">工号</th><th width=\"140\">用户</th><th width=\"120\">时间</th><th>内容</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td onclick=\"_Init.showUserInfo({uid});\">{2}</td><td>{3}</td><td>{4}</td></tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        var Content = $("#Content").val();
        var WorkNo = $("#WorkNo").val();
        var orderNo = $("#orderNo").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 26, orderNo:orderNo,page: page, Content: escape(Content), WorkNo: WorkNo, DateE: DateE, DateS: DateS, page: page, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#SysLogList").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", oi.adminName);
				                tempHtml = tempHtml.replace("{2}", oi.uName);
				                tempHtml = tempHtml.replace("{uid}", oi.uid);
				                tempHtml = tempHtml.replace("{3}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{4}", oi.content);
				                var operInfo = "";
				                if (oi.orderNo != null) {
				                    if (oi.orderNo.length > 0 && oi.orderNo.indexOf("B") == -1) {
				                        operInfo = "<button class=\"button button-small bg-mix\" type=\"button\" data-toggle=\"click\" data-target=\"#Comm_OrderInfo\" data-mask=\"1\" data-width=\"80%\" onclick=\"_OrderInfo.ShowOrderInfo('" + oi.orderNo + "',$(this));\">详情</button>";
				                    }
				                }
				                tempHtml = tempHtml.replace("{5}", operInfo);
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#SysLogList").append(tempHtml);
				            }
				            _Init.ShowPage(page, o.Msg, "_SysLog", _SysLog.Default_Page_Size);
				            //_SysLog.ShowPage(page, o.Msg);
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