var _FlowerCount = {
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
            _FlowerCount.getList(1);
        });
        _FlowerCount.getList(1);
    },
    SumPage: function (page) {
        _FlowerCount.getList(page);
    },
    getList: function (page) {
        _FlowerCount.Page_Now = page;
        var htmlHead = "<tr><th width=\"60\">序号</th><th width=\"120\">美容院名称</th><th width=\"50\">订单数</th><th width=\"80\">件数</th><th width=\"70\">金额(元)</th></tr>";
        var template = "<tr class=\"{c}\"><td>{5}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td></tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 65, DateE: DateE, DateS: DateS, page: page, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#SysLogList").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            var orderNum = 0;
				            var pNum = 0;
				            var price = 0;
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                pNum += parseInt(oi.pNum);
				                price += parseFloat(oi.price);
				                orderNum += parseInt(oi.orderNum);
				                if (oi.fName.length > 0) {
				                    tempHtml = template.replace("{1}", oi.fName);
				                }
				                else {
				                    tempHtml = template.replace("{1}", "个人用户");
				                }
				                
				                tempHtml = tempHtml.replace("{2}", oi.orderNum);
				                tempHtml = tempHtml.replace("{5}", (i+1));
				                tempHtml = tempHtml.replace("{3}", oi.pNum);
				                tempHtml = tempHtml.replace("{4}", parseFloat(oi.price).toFixed(1));
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#SysLogList").append(tempHtml);
				            }
				            tempHtml = template.replace("{1}", "");
				            tempHtml = tempHtml.replace("{5}", "汇总");
				            tempHtml = tempHtml.replace("{2}", orderNum);
				            tempHtml = tempHtml.replace("{3}", pNum);
				            tempHtml = tempHtml.replace("{4}", parseFloat(price).toFixed(1));
				            $("#SysLogList").append(tempHtml);
				            //_Init.ShowPage(page, o.Msg, "_FlowerCount", _FlowerCount.Default_Page_Size);
				            //_FlowerCount.ShowPage(page, o.Msg);
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