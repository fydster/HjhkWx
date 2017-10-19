var _Count = {
    init: function () {
        //是否显示来源选择
        var C_SourceId = $.cookie("_SourceId");
        if (C_SourceId != null && C_SourceId.length > 0) {
            $("#S_O_SourceId").find("div").eq(1).html(_Init.initPartner("S_SourceId", 0));
            if (parseInt(C_SourceId) > 0) {
                $("#S_O_SourceId").hide();
                $("#btn_count_area").hide();
                $("#btn_count_emp").hide();
                $("#btn_count_user").hide();
            }
        }
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
        _Count.getCountAll();
    },
    getCountList: function () {
        $("#CountList").html("");
        var htmlHead = "<tr><th width=\"120\">日期</th><th width=\"80\">订单数量</th><th width=\"80\">件数</th><th width=\"80\">订单金额</th><th width=\"80\">代金券</th><th width=\"80\">微信卡券</th><th width=\"80\">实付金额</th><th width=\"80\">订单数</th><th width=\"80\">订单数</th><th width=\"80\">数量</th><th width=\"80\">用户注册数量</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{8}</td><td>{3}</td><td>{s}</td><td>{w}</td><td>{p}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td></tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        var State = $("#S_State").val();
        var sourceId = $("#S_SourceId").val();
        $.ajax(
				{ url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 34, DateS: DateS, DateE: DateE, State: State, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#CountList").append(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            var s1 = 0;
				            var s2 = 0;
				            var s3 = 0;
				            var s4 = 0;
				            var s5 = 0;
				            var s6 = 0;
				            var p1 = 0;
				            var pw = 0;
				            var price = 0;
				            var subPrice = 0;
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", oi.dates);
				                if (oi.co != null) {
				                    var ci = oi.co;
				                    s1 += parseInt(ci.service1);
				                    s5 += parseInt(ci.service5);
				                    p1 += parseFloat(ci.price1);
				                    price += parseFloat(ci.price);
				                    pw += parseFloat(ci.pricew);
				                    subPrice += parseFloat(ci.subPrice);
				                    tempHtml = tempHtml.replace("{2}", ci.service1);
				                    tempHtml = tempHtml.replace("{3}", ci.price1);
				                    tempHtml = tempHtml.replace("{s}", ci.subPrice);
				                    tempHtml = tempHtml.replace("{p}", ci.price);
				                    tempHtml = tempHtml.replace("{w}", ci.pricew);
				                    tempHtml = tempHtml.replace("{8}", ci.service5);
				                }
				                else {
				                    tempHtml = tempHtml.replace("{2}", "0");
				                    tempHtml = tempHtml.replace("{3}", "0");
				                    tempHtml = tempHtml.replace("{8}", "0");
				                    tempHtml = tempHtml.replace("{s}", "0");
				                    tempHtml = tempHtml.replace("{p}", "0");
				                    tempHtml = tempHtml.replace("{w}", "0");
				                }
				                if (oi.cr != null) {
				                    s3 += parseInt(oi.cr.service3);
				                    tempHtml = tempHtml.replace("{5}", oi.cr.service3);
				                }
				                else {
				                    tempHtml = tempHtml.replace("{5}", "0");
				                }
				                if (oi.ca != null) {
				                    s2 += parseInt(oi.ca.service2);
				                    tempHtml = tempHtml.replace("{4}", oi.ca.service2);
				                }
				                else {
				                    tempHtml = tempHtml.replace("{4}", "0");
				                }
				                if (oi.cp != null) {
				                    s4 += parseInt(oi.cp.service4);
				                    tempHtml = tempHtml.replace("{6}", oi.cp.service4);
				                }
				                else {
				                    tempHtml = tempHtml.replace("{6}", "0");
				                }
				                if (oi.cro != null) {
				                    s6 += parseInt(oi.cro.rNum);
				                    tempHtml = tempHtml.replace("{7}", oi.cro.rNum);
				                }
				                else {
				                    tempHtml = tempHtml.replace("{7}", "0");
				                }
				                $("#CountList").append(tempHtml);
				            }
				            //汇总
				            tempHtml = template.replace("{1}", "汇总");
				            tempHtml = tempHtml.replace("{2}", s1);
				            tempHtml = tempHtml.replace("{8}", s5);
				            tempHtml = tempHtml.replace("{3}", p1);
				            tempHtml = tempHtml.replace("{s}", subPrice);
				            tempHtml = tempHtml.replace("{p}", price);
				            tempHtml = tempHtml.replace("{w}", pw);
				            tempHtml = tempHtml.replace("{4}", s2);
				            tempHtml = tempHtml.replace("{5}", s3);
				            tempHtml = tempHtml.replace("{6}", s4);
				            tempHtml = tempHtml.replace("{7}", s6);
				            $("#CountList").append(tempHtml);
				        }
				    }
				}
		);
    },
    getCountAll: function () {
        $("#CountList").html("载入中");
        var htmlHead = "<tr><th width=\"110\">日期</th><th width=\"100\">下单数</th><th width=\"100\">下单美容院数</th><th width=\"100\">件数</th><th width=\"100\">总金额</th><th width=\"100\">货品成本</th><th width=\"100\">运费成本</th><th width=\"100\">利润</th><th width=\"100\">新增美容院数</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td><td>{8}</td><td>{9}</td></tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        var sourceId = $("#S_SourceId").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 34, sourceId:sourceId,DateS: DateS, DateE: DateE, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var tempHtml = "";
				            var cName = "current";
				            var tempArr = new Array(9);
				            for (var j = 0; j < 9; j++) {
				                tempArr[j] = 0;
				            }
				            $("#CountList").html(htmlHead);
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", new Date(oi.dates).pattern("yyyy-MM-dd"));
				                tempHtml = tempHtml.replace("{2}", oi.orderNum);
				                tempHtml = tempHtml.replace("{3}", oi.flowerNum);
				                tempHtml = tempHtml.replace("{4}", oi.productNum);
				                tempHtml = tempHtml.replace("{5}", parseFloat(oi.price).toFixed(1));
				                tempHtml = tempHtml.replace("{6}", parseFloat(oi.cb).toFixed(1));
				                tempHtml = tempHtml.replace("{7}", parseFloat(oi.yf).toFixed(1));
				                tempHtml = tempHtml.replace("{8}", parseFloat(oi.lr).toFixed(1));
				                tempHtml = tempHtml.replace("{9}", oi.newF);
				                //汇总
				                tempArr[0] += parseInt(oi.orderNum);
				                tempArr[1] += parseInt(oi.flowerNum);
				                tempArr[2] += parseInt(oi.productNum);

				                tempArr[3] += parseFloat(oi.price);
				                tempArr[4] += parseFloat(oi.cb);
				                tempArr[5] += parseFloat(oi.yf);
				                tempArr[6] += parseFloat(oi.lr);
				                tempArr[7] += parseInt(oi.newF);
				                $("#CountList").append(tempHtml);
				            }

				            tempHtml = template.replace("{1}", "汇总");
				            tempHtml = tempHtml.replace("{2}", tempArr[0]);
				            tempHtml = tempHtml.replace("{3}", tempArr[1]);
				            tempHtml = tempHtml.replace("{4}", tempArr[2]);
				            tempHtml = tempHtml.replace("{5}", parseFloat(tempArr[3]).toFixed(1));
				            tempHtml = tempHtml.replace("{6}", parseFloat(tempArr[4]).toFixed(1));
				            tempHtml = tempHtml.replace("{7}", parseFloat(tempArr[5]).toFixed(1));
				            tempHtml = tempHtml.replace("{8}", parseFloat(tempArr[6]).toFixed(1));
				            tempHtml = tempHtml.replace("{9}", tempArr[7]);
				            $("#CountList").append(tempHtml);
				        }
				    }
				}
		);
    },
    getCountFinance: function () {
        $("#CountList").html("");
        var htmlHead = "<tr><th width=\"110\">支付日期</th><th width=\"100\">实收微信支付</th><th width=\"100\">实收现金</th><th width=\"100\">实收充值款</th><th width=\"100\">实际微信退款</th><th width=\"100\">合计实收</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td></tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        var sourceId = $("#S_SourceId").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 51, sourceId: sourceId, DateS: DateS, DateE: DateE, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var tempHtml = "";
				            var cName = "current";
				            var tempArr = new Array(5);
				            for (var j = 0; j < 5; j++) {
				                tempArr[j] = 0;
				            }
				            $("#CountList").append(htmlHead);
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", new Date(oi.DateS).pattern("yyyy-MM-dd"));
				                tempHtml = tempHtml.replace("{2}", oi.WxFee);
				                tempHtml = tempHtml.replace("{3}", oi.Cash);
				                tempHtml = tempHtml.replace("{4}", oi.Balance);
				                tempHtml = tempHtml.replace("{5}", oi.WxTui);
				                tempHtml = tempHtml.replace("{6}", oi.AllFee);
				                //汇总
				                tempArr[0] += parseInt(oi.WxFee);
				                tempArr[1] += parseInt(oi.Cash);
				                tempArr[2] += parseInt(oi.Balance);
				                tempArr[3] += parseInt(oi.WxTui);
				                tempArr[4] += parseInt(oi.AllFee);
				                $("#CountList").append(tempHtml);
				            }

				            tempHtml = template.replace("{1}", "汇总");
				            tempHtml = tempHtml.replace("{2}", tempArr[0]);
				            tempHtml = tempHtml.replace("{3}", tempArr[1]);
				            tempHtml = tempHtml.replace("{4}", tempArr[2]);
				            tempHtml = tempHtml.replace("{5}", tempArr[3]);
				            tempHtml = tempHtml.replace("{6}", tempArr[4]);

				            $("#CountList").append(tempHtml);
				        }
				    }
				}
		);
    },
    getCountArea: function () {
        $("#CountList").html("");
        var htmlHead = "<tr><th width=\"110\">日期</th><th width=\"100\">小店区订单数</th><th width=\"100\">迎泽区订单数</th><th width=\"100\">杏花岭区订单数</th><th width=\"100\">万柏林区订单数</th><th width=\"100\">晋源区订单数</th><th width=\"100\">尖草坪区订单数</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td></tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 46, DateS: DateS, DateE: DateE, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var tempHtml = "";
				            var cName = "current";
				            var tempArr = new Array(6);
				            for (var j = 0; j < 6; j++) {
				                tempArr[j] = 0;
				            }
				            $("#CountList").append(htmlHead);
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", new Date(oi.dates).pattern("yyyy-MM-dd"));
				                tempHtml = tempHtml.replace("{2}", oi.area1);
				                tempHtml = tempHtml.replace("{3}", oi.area2);
				                tempHtml = tempHtml.replace("{4}", oi.area3);
				                tempHtml = tempHtml.replace("{5}", oi.area4);
				                tempHtml = tempHtml.replace("{6}", oi.area5);
				                tempHtml = tempHtml.replace("{7}", oi.area6);
				                //汇总
				                tempArr[0] += parseInt(oi.area1);
				                tempArr[1] += parseInt(oi.area2);
				                tempArr[2] += parseInt(oi.area3);
				                tempArr[3] += parseInt(oi.area4);
				                tempArr[4] += parseInt(oi.area5);
				                tempArr[5] += parseInt(oi.area6);
				                $("#CountList").append(tempHtml);
				            }

				            tempHtml = template.replace("{1}", "汇总");
				            tempHtml = tempHtml.replace("{2}", tempArr[0]);
				            tempHtml = tempHtml.replace("{3}", tempArr[1]);
				            tempHtml = tempHtml.replace("{4}", tempArr[2]);
				            tempHtml = tempHtml.replace("{5}", tempArr[3]);
				            tempHtml = tempHtml.replace("{6}", tempArr[4]);
				            tempHtml = tempHtml.replace("{7}", tempArr[5]);
				            $("#CountList").append(tempHtml);
				        }
				    }
				}
		);
    },
    getCountListForUser: function () {
        
    },
    getCountListForE: function () {
        $("#CountList").html("");
        var htmlHead = "<tr><th width=\"120\">员工</th><th width=\"110\">取回订单数</th><th width=\"110\">取回件数</th><th width=\"110\">送出订单数</th><th width=\"110\">送出件数</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td></tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        $.ajax(
				    { url: _Init.ServerUrl,
				        context: document.body,
				        dataType: "json",
				        cache: false,
				        data: { fn: 35, DateS: DateS, DateE: DateE, t: new Date() },
				        success: function (o) {
				            if (o.Return == 0) {
				                $("#CountList").append(htmlHead);
				                var tempHtml = "";
				                var cName = "current";
				                var s1 = 0;
				                var s2 = 0;
				                var s3 = 0;
				                var s4 = 0;
				                for (var i = 0; i < o.List.length; i++) {
				                    cName = "current";
				                    if (i % 2 == 1) {
				                        cName = "blue";
				                    }
				                    var oi = o.List[i];
				                    tempHtml = template.replace("{1}", oi.name);
				                    s1 += parseInt(oi.getONum);
				                    s2 += parseInt(oi.getPNum);
				                    s3 += parseInt(oi.sendONum);
				                    s4 += parseFloat(oi.sendPNum);
				                    tempHtml = tempHtml.replace("{2}", oi.getONum);
				                    tempHtml = tempHtml.replace("{3}", oi.getPNum);
				                    tempHtml = tempHtml.replace("{4}", oi.sendONum);
				                    tempHtml = tempHtml.replace("{5}", oi.sendPNum);
				                    $("#CountList").append(tempHtml);
				                }
				                //汇总
				                tempHtml = template.replace("{1}", "汇总");
				                tempHtml = tempHtml.replace("{2}", s1);
				                tempHtml = tempHtml.replace("{3}", s2);
				                tempHtml = tempHtml.replace("{4}", s3);
				                tempHtml = tempHtml.replace("{5}", s4);
				                $("#CountList").append(tempHtml);
				            }
				        }
				    }
		    );
    },
    getCountListForR: function () {
        $("#CountList").html("");
        var htmlHead = "<tr><th width=\"120\">日期</th><th width=\"110\">用户注册数量</th><th width=\"110\">帮修员注册数量</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td></tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        $.ajax(
				{ url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 37, DateS: DateS, DateE: DateE, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#CountList").append(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            var s1 = 0;
				            var s2 = 0;
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", oi.DateS);
				                if (oi.co != null) {
				                    var ci = oi.co;
				                    s1 += parseInt(ci.rNum);
				                    tempHtml = tempHtml.replace("{2}", ci.rNum);
				                }
				                else {
				                    tempHtml = tempHtml.replace("{2}", "0");
				                }
				                if (oi.ca != null) {
				                    s2 += parseInt(oi.ca.rNum);
				                    tempHtml = tempHtml.replace("{3}", oi.ca.rNum);
				                }
				                else {
				                    tempHtml = tempHtml.replace("{3}", "0");
				                }
				                $("#CountList").append(tempHtml);
				            }
				            //汇总
				            tempHtml = template.replace("{1}", "汇总");
				            tempHtml = tempHtml.replace("{2}", s1);
				            tempHtml = tempHtml.replace("{3}", s2);
				            $("#CountList").append(tempHtml);
				        }
				    }
				}
		);
    },
    getCountListForState: function () {
        $("#CountList").html("");
        var htmlHead = "<tr><th width=\"120\">状态</th><th width=\"100\">订单数量</th><th width=\"100\">鞋数</th><th width=\"100\">订单金额</th><th width=\"100\">代金券</th><th width=\"100\">实付金额</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td></tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        $.ajax(
				{ url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 36, DateS: DateS, DateE: DateE, t: new Date() },
				    success: function (o) {
				        if (1==1) {
				            $("#CountList").append(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            var s1 = 0;
				            var s2 = 0;
				            var p1 = 0;
				            var price = 0;
				            var subPrice = 0;
				            for (var j = 0;j < 11;j++)
				            {
				                if (j == 1) {
				                    continue;
				                }
				                cName = "current";
				                if (j % 2 == 1) {
				                    cName = "blue";
				                }
				                tempHtml = template.replace("{1}", _Init.getState(j));
				                if (o.Return == 0) {
				                    for (var i = 0; i < o.List.length; i++) {
				                        var oi = o.List[i];
				                        if (j == oi.state) {
				                            if (oi.service1 != null) {
				                                s1 += parseInt(oi.service1);
				                                tempHtml = tempHtml.replace("{2}", oi.service1);
				                            }
				                            if (oi.service2 != null) {
				                                s2 += parseInt(oi.service2);
				                                tempHtml = tempHtml.replace("{3}", oi.service2);
				                            }
				                            if (oi.price1 != null) {
				                                p1 += parseFloat(oi.price1);
				                                tempHtml = tempHtml.replace("{4}", oi.price1);
				                            }
				                            if (oi.price != null) {
				                                price += parseFloat(oi.price);
				                                tempHtml = tempHtml.replace("{6}", oi.price);
				                            }
				                            if (oi.subPrice != null) {
				                                subPrice += parseFloat(oi.subPrice);
				                                tempHtml = tempHtml.replace("{5}", oi.subPrice);
				                            }
				                            i = o.List.length;
				                        }
				                    }
				                }
				                tempHtml = tempHtml.replace("{2}", 0);
				                tempHtml = tempHtml.replace("{3}", 0);
				                tempHtml = tempHtml.replace("{4}", 0);
				                tempHtml = tempHtml.replace("{5}", 0);
				                tempHtml = tempHtml.replace("{6}", 0);
				                $("#CountList").append(tempHtml);
				            }
				            //汇总
				            tempHtml = template.replace("{1}", "汇总");
				            tempHtml = tempHtml.replace("{2}", s1);
				            tempHtml = tempHtml.replace("{3}", s2);
				            tempHtml = tempHtml.replace("{4}", p1);
				            tempHtml = tempHtml.replace("{5}", subPrice);
				            tempHtml = tempHtml.replace("{6}", price);
				            $("#CountList").append(tempHtml);
				        }
				    }
				}
		);
    },
    getCountListForDate: function () {
        $("#CountList").html("");
        var htmlHead = "<tr><th width=\"120\">日期</th><th width=\"100\">时间</th><th width=\"100\">鞋数</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td></tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        var State = $("#S_State").val();
        $.ajax(
			{
				url: _Init.ServerUrl,
				context: document.body,
				dataType: "json",
				cache: false,
				data: { fn: 39, State:State,DateS: DateS, DateE: DateE, t: new Date() },
				success: function (o) {
				    $("#CountList").append(htmlHead);
				    var tempHtml = "";
				    var cName = "current";
				    var s1 = 0;
				    var dates = "";
				    if (o.Return == 0) {
				        for (var i = 0; i < o.List.length; i++) {
				            var oi = o.List[i];
				            cName = "current";
				            if (i % 2 == 1) {
				                cName = "blue";
				            }
				            if (dates.length == 0 || dates!=oi.cDate) {
				                tempHtml = template.replace("{1}", oi.cDate);
				            }
				            else {
				                tempHtml = template.replace("{1}", "");
				            }
				            tempHtml = tempHtml.replace("{2}", oi.cTime);
				            tempHtml = tempHtml.replace("{3}", oi.num);
				            s1 += parseInt(oi.num);
				            $("#CountList").append(tempHtml);
				            dates = oi.cDate;
				        }
				        //汇总
				        tempHtml = template.replace("{1}", "汇总");
				        tempHtml = tempHtml.replace("{2}", "");
				        tempHtml = tempHtml.replace("{3}", s1);
				        $("#CountList").append(tempHtml);
				    }
				}
			}
		);
    }
}