var _Balance = {
    Default_Page_Size: 100,
    Page_Now: 1,
    bType: -1,
    uid: 0,
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
            _Balance.getBalanceList(1);
        });
        $("#btn_bType").find("span").unbind().bind("click", function () {
            _Balance.bType = $(this).attr("title");
            _Balance.getBalanceList(_Balance.Page_Now);
        });
        _Balance.getBalanceList(1);
    },
    SumPage: function (page) {
        _Balance.getBalanceList(page);
    },
    addBalance: function () {
        var mobile = $("#mobile").val();
        var contact = $("#contact").val();
        var memo = $("#memo").val();
        var balance = $("#balance").val();
        var aBalance = $("#aBalance").val();
        if (!(mobile.length > 0 && contact.length > 0 && balance.length > 0)) {
            alert("请填写完整");
            return;
        }
        if (isNaN(balance) || isNaN(aBalance)) {
            alert("金额必须为整数");
            return;
        }
        if (balance==0) {
            alert("充值金额必须大于0");
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 48, aBalance:aBalance,uid: _Balance.uid, mobile: mobile, contact: contact, memo: memo, balance: balance, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            $("#mobile").val("");
				            $("#contact").val("");
				            $("#memo").val("");
				            $("#balance").val("");
				            $("#balanceInfo").val("0");
				            _Balance.getBalanceList(1);
				        }
				    }
				}
		);
    },
    initUser: function () {
        var mobile = $("#mobile").val();
        if (mobile.length == 0) {
            alert("请填写手机号码");
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 49,mobile: mobile, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#contact").val(o.Info.contact);
				            $("#balanceInfo").val(o.Info.balance);
				            _Balance.uid = o.Info.id;
				            _Balance.getBalanceList(1);
				        }
				    }
				}
		);
    },
    getBalanceList: function (page) {
        _UserInfo.hideUserInfo();
        _Balance.Page_Now = page;
        var htmlHead = "<tr><th width=\"160\">时间</th><th width=\"50\">类型</th><th width=\"200\">描述</th><th width=\"80\">用户(点击查看详情)</th><th width=\"70\">金额</th><th width=\"70\">赠送</th><th width=\"70\">状态</th></tr>";
        var template = "<tr class=\"{c}\"><td>{3}</td><td>{4}</td><td>{1}</td><td onclick=\"_Init.showUserInfo({uid});\">{2}</td><td>{5}</td><td>{6}</td><td>{7}</td></tr>";
        var DateS = $("#DateS").val();
        var mobile = $("#mobile").val();
        var DateE = $("#DateE").val();
        var orderNo = $("#orderNo").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 29, uid:_Balance.uid,bType: _Balance.bType, orderNo: orderNo, page: page, DateE: DateE, DateS: DateS, page: page, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#SysLogList").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            var enable = "";
				            var balance = 0;
				            var aBalance = 0;
				            var sBalance = 0;
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", oi.desp);
				                tempHtml = tempHtml.replace("{2}", oi.userName);
			                    tempHtml = tempHtml.replace("{3}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{4}", oi.bType.toString().replace("0", "<span class=\"badge bg-red-light\">充值</span>").replace("1", "<span class=\"badge bg-blue-light\">消费</span>"));
				                tempHtml = tempHtml.replace("{5}", oi.balance);
				                tempHtml = tempHtml.replace("{6}", oi.aBalance);
				                enable = "完成";
				                if (oi.bType == 0 && oi.enable == 0) {
				                    enable = "<span class=\"badge bg-green-light\">未完成</span>";
				                }
				                if (oi.bType == 1 && oi.enable == -1) {
				                    enable = "<span class=\"badge bg-green-light\">订单取消</span>";
				                }
				                if (_Balance.bType == -1) {
				                    if (oi.bType == 0) {
				                        balance += oi.balance;
				                        aBalance += oi.aBalance;
				                    }
				                }
				                else {
				                    balance += oi.balance;
				                    aBalance += oi.aBalance;
				                }

				                if (oi.bType == 1 && oi.enable == 0) {
				                    sBalance += oi.balance;
				                }
				                tempHtml = tempHtml.replace("{7}", enable);
				                tempHtml = tempHtml.replace("{c}", cName);
				                tempHtml = tempHtml.replace("{uid}", oi.uid);
				                $("#SysLogList").append(tempHtml);
				            }
				            if (_Balance.bType == 1) {
				                balance = 0;
				            }
				            tempHtml = template.replace("{1}", "");
				            tempHtml = tempHtml.replace("{2}", "");
				            tempHtml = tempHtml.replace("{3}", "汇总");
				            tempHtml = tempHtml.replace("{4}", "");
				            tempHtml = tempHtml.replace("{5}", "充值：" + balance);
				            tempHtml = tempHtml.replace("{6}", "赠送：" + aBalance);
				            tempHtml = tempHtml.replace("{7}", "消费：" + sBalance);
				            $("#SysLogList").append(tempHtml);
				            _Init.ShowPage(page, o.Msg, "_Balance", _Balance.Default_Page_Size);
				            //_Balance.ShowPage(page, o.Msg);
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