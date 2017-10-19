var _Evaluate = {
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
            _Evaluate.getEList(1);
        });
        _Evaluate.getEList(1);
    },
    SumPage: function (page) {
        _Evaluate.getEList(page);
    },
    getEList: function (page) {
        _UserInfo.hideUserInfo();
        _Evaluate.Page_Now = page;
        var htmlHead = "<tr><th width=\"100\">评价时间</th><th width=\"140\">用户(点击查看详情)</th><th width=\"80\">取送速度</th><th width=\"80\">效果</th><th width=\"80\">总体</th><th>内容</th><th width=\"120\">产品</th><th width=\"70\">详情</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td onclick=\"_Init.showUserInfo({uid});\">{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td><td>{8}</td</tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 10,DateE: DateE, DateS: DateS, page: page, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#SysLogList").html(htmlHead);
				            var tempHtml = "";
				            var pInfo = "";
				            var cName = "current";
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", new Date(oi.le[0].addOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{2}", oi.nickName);
				                tempHtml = tempHtml.replace("{uid}", oi.userId);
				                tempHtml = tempHtml.replace("{3}", oi.le[0].target1);
				                tempHtml = tempHtml.replace("{4}", oi.le[0].target2);
				                tempHtml = tempHtml.replace("{5}", oi.le[0].target3);
				                tempHtml = tempHtml.replace("{6}", oi.le[0].memo);
				                pInfo = "";
				                if (oi.pList != null) {
				                    for (var j = 0; j < oi.pList.length; j++) {
				                        pInfo += oi.pList[j].pName + "&nbsp;<span class=\"badge bg-red-light\">" + oi.pList[j].pNum + "x" + oi.pList[j].price + " </span>";
				                    }
				                }
				                tempHtml = tempHtml.replace("{7}", pInfo);
				                var operInfo = "";
				                if (oi.orderNo != null) {
				                    if (oi.orderNo.length > 0 && oi.orderNo.indexOf("B") == -1) {
				                        operInfo = "<button class=\"button button-small bg-mix\" type=\"button\" data-toggle=\"click\" data-target=\"#Comm_OrderInfo\" data-mask=\"1\" data-width=\"80%\" onclick=\"_OrderInfo.ShowOrderInfo('" + oi.orderNo + "',$(this));\">详情</button>";
				                    }
				                }
				                tempHtml = tempHtml.replace("{8}", operInfo);
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#SysLogList").append(tempHtml);
				            }
				            _Init.ShowPage(page, o.Msg, "_Evaluate", _Evaluate.Default_Page_Size);
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