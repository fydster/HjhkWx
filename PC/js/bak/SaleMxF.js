var _SaleMxF = {
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
            _SaleMxF.getList(1);
        });
        _SaleMxF.getList(1);
        //_SaleMxF.InitClass();
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
                                    _SaleMxF.classArr = cinfo.join(",");
                                    _SaleMxF.getList(1);
                                }
                            }
                        }
                );
    },
    getCName: function (cid) {
        var cArr = _SaleMxF.classArr.split(",");
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
        var htmlHead = "<tr><th width=\"120\">分类</th><th width=\"250\">花名</th><th width=\"80\">数量</th><th width=\"100\">成本价</th><th width=\"100\">销售价</th><th width=\"100\">总价</th><th width=\"100\">总成本</th><th width=\"100\">毛利</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td><td>{8}</td></tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        $("#SysLogList").html("载入中.....");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 66,DateE: DateE, DateS: DateS, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#SysLogList").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            var pNum = 0;
				            var ml = 0;
				            var zj = 0;
				            var cb = 0;
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", oi.unit.pinfo.cName);
				                tempHtml = tempHtml.replace("{2}", oi.unit.pinfo.pName);
				                tempHtml = tempHtml.replace("{3}", oi.pNum);
				                tempHtml = tempHtml.replace("{4}", parseFloat(oi.unit.jPrice).toFixed(1));
				                tempHtml = tempHtml.replace("{5}", parseFloat(oi.price).toFixed(1));
				                tempHtml = tempHtml.replace("{6}", (parseInt(oi.pNum) * parseFloat(oi.price)).toFixed(1));
				                tempHtml = tempHtml.replace("{7}", (parseInt(oi.pNum) * parseFloat(oi.unit.jPrice)).toFixed(1));
				                tempHtml = tempHtml.replace("{8}", (parseInt(oi.pNum) * (parseFloat(oi.price) - parseFloat(oi.unit.jPrice))).toFixed(1));
				                pNum += parseInt(oi.pNum);
				                zj += parseFloat(parseInt(oi.pNum) * parseFloat(oi.price));
				                cb += parseFloat(parseInt(oi.pNum) * parseFloat(oi.unit.jPrice));
				                ml += parseFloat(parseInt(oi.pNum) * (parseFloat(oi.price) - parseFloat(oi.unit.jPrice)));
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#SysLogList").append(tempHtml);
				            }
				            tempHtml = template.replace("{1}", "汇总");
				            tempHtml = tempHtml.replace("{4}", "");
				            tempHtml = tempHtml.replace("{5}", "");
				            tempHtml = tempHtml.replace("{2}", DateS + "至" + DateE);
				            tempHtml = tempHtml.replace("{3}", pNum);
				            tempHtml = tempHtml.replace("{6}", zj.toFixed(1));
				            tempHtml = tempHtml.replace("{7}", cb.toFixed(1));
				            tempHtml = tempHtml.replace("{8}", ml.toFixed(1));
				            $("#SysLogList").append(tempHtml);
				            //_Init.ShowPage(page, o.Msg, "_SaleMxF", _SaleMxF.Default_Page_Size);
				            //_SaleMxF.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#SysLogList").html("无记录");
				        }
				    }
				}
		);
    }
}