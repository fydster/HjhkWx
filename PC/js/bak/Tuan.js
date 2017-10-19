var _Tuan = {
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
            _Tuan.getList(1);
            _Tuan.getCount();
        });
        _Tuan.getList(1);
        _Tuan.getCount();
    },
    SumPage: function (page) {
        _Tuan.getList(page);
    },
    getList: function (page) {
        _Tuan.Page_Now = page;
        var htmlHead = "<tr><th width=\"140\">时间</th><th width=\"160\">美容院</th><th>详情</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td></tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 93,subjectId:1, DateE: DateE, DateS: DateS, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#SysLogList").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            var pInfo = "";
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{2}", oi.flower.fName);
				                pInfo = "";
				                if (oi.tuan != null) {
				                    for (var j = 0; j < oi.tuan.length; j++) {
				                        pInfo += oi.tuan[j].pName + "&nbsp;<span class=\"badge bg-red-light\">" + oi.tuan[j].pNum + " </span><br/>";
				                    }
				                }
				                tempHtml = tempHtml.replace("{3}", pInfo);
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#SysLogList").append(tempHtml);
				            }
				            //_Init.ShowPage(page, o.Msg, "_Tuan", _Tuan.Default_Page_Size);
				            //_Tuan.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#SysLogList").html("无记录");
				            $("#PagePanel").hide();
				        }
				    }
				}
		);
    },
    getCount: function () {
        var htmlHead = "<tr><th width=\"50\">类型</th><th width=\"120\">名称</th><th width=\"70\">数量</th></tr>";
        var template = "<tr class=\"{c}\"><td>{3}</td><td>{4}</td><td>{5}</td></tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 64, subjectId: 1, DateE: DateE, DateS: DateS, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#hzList").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{3}", oi.cName);
				                tempHtml = tempHtml.replace("{4}", oi.pName);
				                tempHtml = tempHtml.replace("{5}", oi.pNum);
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#hzList").append(tempHtml);
				            }
				            //_Tuan.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#hzList").html("无记录");
				        }
				    }
				}
		);
    }
}
