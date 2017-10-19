var _SaleMx = {
    Default_Page_Size: 100,
    Page_Now: 1,
    bType: -1,
    classArr: "",
    workNo: "",
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
            _SaleMx.getList(1);
        });
        _SaleMx.getList(1);
        _SaleMx.initEmployee();
        //_SaleMx.InitClass();
    },
    InitClass: function () {
        $.ajax(
                        {
                            url: _Init.ServerUrl,
                            context: document.body,
                            dataType: "json",
                            cache: false,
                            data: { fn: 54, t: new Date() },
                            success: function (o) {
                                if (o.Return == 0) {
                                    var cinfo = new Array();
                                    for (var i = 0; i < o.List.length; i++) {
                                        var oi = o.List[i];
                                        cinfo[i] = oi.id + "|" + oi.cName;
                                    }
                                    _SaleMx.classArr = cinfo.join(",");
                                    _SaleMx.getList(1);
                                }
                            }
                        }
                );
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
				            var btn_template = "<button class=\"button border-green\" value=\"{1}\">{2}</button>&nbsp;";
				            var btn_template_check = "<button class=\"button border-green icon-check\" value=\"{1}\">{2}</button>&nbsp;";
				            $("#btn_Employee_Group").append(btn_template_check.replace("{1}", "").replace("{2}", "全部"));
				            for (var i = 0; i < o.List.length; i++) {
				                var ci = o.List[i];
				                if (ci.isService == 1) {
				                    $("#btn_Employee_Group").append(btn_template.replace("{1}", ci.workNo).replace("{2}", ci.name));
				                }
				            }

				            $("#btn_Employee_Group").find("button").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_Employee_Group").find("button").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _SaleMx.workNo = $(this).val();
				                    _SaleMx.getList(1);
				                    //_OrderList.ShowOrderList(_OrderList.Page_Now);
				                    return;
				                }
				            });
				        }
				    }
				}
		);
    },
    getCName: function (cid) {
        var cArr = _SaleMx.classArr.split(",");
        for (var i = 0; i < cArr.length; i++) {
            if (cArr[i].length > 0) {
                sArr = cArr[i].split("|");
                if (sArr.length > 0) {
                    if (sArr[0] == cid) {
                        return sArr[1];
                    }
                }
            }
        }
    },
    getList: function (page) {
        var htmlHead = "<tr><th width=\"120\">分类</th><th width=\"250\">花名</th><th width=\"80\">数量</th><th width=\"100\">配送日期</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td></tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        $("#SysLogList").html("载入中.....");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 62,workNo:_SaleMx.workNo, DateE: DateE, DateS: DateS, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#SysLogList").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            var pNum = 0;
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", oi.product.cName);
				                tempHtml = tempHtml.replace("{2}", oi.product.pName);
				                tempHtml = tempHtml.replace("{3}", oi.pNum);
				                tempHtml = tempHtml.replace("{4}", DateS);
				                pNum += parseInt(oi.pNum);
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#SysLogList").append(tempHtml);
				            }
				            tempHtml = template.replace("{1}", "汇总");
				            tempHtml = tempHtml.replace("{4}", "");
				            tempHtml = tempHtml.replace("{2}", "");
				            tempHtml = tempHtml.replace("{3}", pNum);
				            $("#SysLogList").append(tempHtml);
				            //_Init.ShowPage(page, o.Msg, "_SaleMx", _SaleMx.Default_Page_Size);
				            //_SaleMx.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#SysLogList").html("无记录");
				        }
				    }
				}
		);
    }
}