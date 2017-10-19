var _Fee = {
    Default_Page_Size: 1000,
    Page_Now: 1,
    bType: -1,
    init: function () {
        var NowDate = new Date().pattern("yyyy-MM-dd");
        $('#DateQ').val(NowDate);
        $('#DateE').val(NowDate);
        $('#DateQ').datetimepicker({
            lang: 'ch',
            timepicker: false,
            format: 'Y-m-d',
            formatDate: 'Y-m-d'
        });
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
            _Fee.getList(1);
        });
        $("#btn_add").unbind().bind("click", function () {
            _Fee.addFee();
        });
        _Fee.getList(1);
    },
    delFee: function (id, fDate) {
        if (!confirm("确定要删除该运费吗！")) {
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 69, id: id, fDate: fDate, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _Fee.getList(1);
				        }
				    }
				}
		);
    },
    addFee: function () {
        var DateQ = $("#DateQ").val();
        var dbFee = $("#dbFee").val();
        var thFee = $("#thFee").val();
        var yFee = $("#yFee").val();
        if (DateQ.length == 0 || dbFee.length == 0 || thFee.length == 0 || yFee.length == 0) {
            alert("请填写完整");
            return false;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 67, DateQ: DateQ, id: _Fee.id, dbFee: dbFee, thFee: thFee, yFee: yFee, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _Fee.id = 0;
				            $("#dbFee").val("0");
				            $("#thFee").val("0");
				            $("#yFee").val("0");
				            _Fee.getList(1);
				        }
				    }
				}
		);
    },
    SumPage: function (page) {
        _Fee.getList(page);
    },
    getList: function (page) {
        //_UserInfo.hideUserInfo();
        _Fee.Page_Now = page;
        var htmlHead = "<tr><th width=\"120\">发货日期</th><th width=\"60\">打包费(元)</th><th width=\"60\">提货费(元)</th><th width=\"60\">运费(元)</th><th width=\"60\">合计(元)</th><th width=\"120\">录入时间</th><th width=\"70\">操作</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td></tr>";
        var btn = "<button class=\"button button-small border-dot\" onclick=\"_Fee.delFee({id},'{fDate}');\">删除</button>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        $("#SysLogList").html("载入中.....");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 68,perPage:_Fee.Default_Page_Size,DateE: DateE, DateS: DateS, page: page, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#SysLogList").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            var dbfee = 0;
				            var thfee = 0;
				            var yfee = 0;
				            var afee = 0;
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                dbfee += parseFloat(oi.dbFee);
				                thfee += parseFloat(oi.thFee);
				                yfee += parseFloat(oi.yFee);
				                tempHtml = template.replace("{1}", new Date(oi.fDate).pattern("yyyy-MM-dd"));
				                tempHtml = tempHtml.replace("{2}", parseFloat(oi.dbFee).toFixed(1));
				                tempHtml = tempHtml.replace("{3}", parseFloat(oi.thFee).toFixed(1));
				                tempHtml = tempHtml.replace("{4}", parseFloat(oi.yFee).toFixed(1));
				                tempHtml = tempHtml.replace("{5}", parseFloat(oi.dbFee+oi.thFee+oi.yFee).toFixed(1));
				                tempHtml = tempHtml.replace("{6}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{7}", btn.replace("{id}",oi.id).replace("{fDate}",new Date(oi.fDate).pattern("yyyy-MM-dd")));
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#SysLogList").append(tempHtml);
				            }
				            tempHtml = template.replace("{1}", "汇总");
				            tempHtml = tempHtml.replace("{2}", parseFloat(dbfee).toFixed(1));
				            tempHtml = tempHtml.replace("{3}", parseFloat(thfee).toFixed(1));
				            tempHtml = tempHtml.replace("{4}", parseFloat(yfee).toFixed(1));
				            tempHtml = tempHtml.replace("{5}", parseFloat(dbfee + thfee + yfee).toFixed(1));
				            tempHtml = tempHtml.replace("{6}", "");
				            tempHtml = tempHtml.replace("{7}", "");
				            $("#SysLogList").append(tempHtml);
				            //_Init.ShowPage(page, o.Msg, "_Fee", _Fee.Default_Page_Size);
				            //_Fee.ShowPage(page, o.Msg);
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