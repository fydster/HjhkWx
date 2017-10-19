var _Print = {
    Date: "",
    WorkNo: "",
    ID: 0,
    FID: 0,
    IDS: "",
    jiaji: 0,
    init: function () {
        _Print.jiaji = _Init.getParam("jiaji");
        _Print.Date = _Init.getParam("Date");
        _Print.WorkNo = _Init.getParam("WorkNo");
        _Print.FID = _Init.getParam("FID");
        _Print.ID = _Init.getParam("ID");
        _Print.getPrintList();
    },
    initPrint: function () {
        var NowDate = new Date().pattern("yyyy-MM-dd");
        $('#DateS').val(NowDate);
        $('#DateS').datetimepicker({
            lang: 'ch',
            timepicker: false,
            format: 'Y-m-d',
            formatDate: 'Y-m-d'
        });
        $("#btn_jiaji").click(function () {
            if ($(this).hasClass("icon-check")) {
                _Print.jiaji = 0;
                $("#btn_jiaji").removeClass("icon-check");
            }
            else {
                $("#btn_jiaji").removeClass("icon-check");
                $(this).addClass("icon-check");
                _Print.jiaji = 1;
            }
        });
        _Print.initEmployee();
    },
    initSelect: function (NowDate) {
        var Date = $("#DateS").val();
        var WorkNo = _Print.WorkNo;
        var FID = $("#FID").val();
        var ID = $("#ID").val();
        if (ID.length == 0) {
            ID = 0;
        }
        if (FID.length == 0) {
            FID = 0;
        }
        $("#PrintDoc").attr("src", "print_t.html?FID=" + FID + "&jiaji=" + _Print.jiaji + "&Date=" + Date + "&WorkNo=" + WorkNo + "&ID=" + ID + "&t=" + NowDate);
    },
    overPrint: function () {
        $('#NoPrintInfo').hide();
        window.print();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 47,IDS:_Print.IDS,t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
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
				            //查询条件的派送员按钮
				            var btn_template = "<button class=\"button border-green\" value=\"{1}\">{2}</button>&nbsp;";
				            var btn_template_check = "<button class=\"button border-green icon-check\" value=\"{1}\">{2}</button>&nbsp;";
				            $("#btn_Employee_Group").append(btn_template_check.replace("{1}", "").replace("{2}", "全部"));
				            //End
				            var template = "<li><a href=\"javascript:_OrderList.SelectWork('{3}', '{2}', '{name}');\">{name}</a></li>";
				            var tempHtml = "";
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
				                    _Print.WorkNo = $(this).val();
				                    _Print.initSelect(new Date().getTime());
				                }
				            });
				        }
				    }
				}
		);
    },
    getPrintLog: function () {
        $('#PrintList').show();
        $('#div_Print').hide();
        var htmlHead = "<tr><th>员工</th><th>打印时间</th><th>打印编号</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td></tr>";
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 9, Dates: $("#DateS").val(), t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#PrintList").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", "["+oi.workNo+"]" + oi.adminName);
				                tempHtml = tempHtml.replace("{2}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{3}", oi.content.toString().replace("打印派送单[编号：", "").replace(",]",""));
				                $("#PrintList").append(tempHtml);
				            }
				            //_Init.ShowPage(page, o.Msg, "_UserList", _UserList.Default_Page_Size);
				            //_UserList.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#PrintList").html("无记录");
				            //$("#PagePanel").hide();
				        }
				    }
				}
		);
    },
    getPrintList: function () {
        $("#PrintList").hide();
        //var PageRoom = "<div style=\"page-break-after: always;\" id=\"PageRoom_{pageId}\"></div>";
        var PageRoom = "<div id=\"PageRoom_{pageId}\"></div>";
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 8,FID:_Print.FID,jiaji:_Print.jiaji,Date: _Print.Date, WorkNo: _Print.WorkNo, ID: _Print.ID, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var tempHtml = "";
				            var pInfo = "";
				            _Print.IDS = "";
				            var balance = "";
				            var isPay = "";
				            var obj = null;
				            var allPrice = 0;
				            var isPrint = "";
				            $("#PrintNum").text(o.List.length);
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                isPrint = "";
				                _Print.IDS += oi.id + ",";
				                if (i % 3 == 0) {
				                    $("#PrintInfo").append(PageRoom.replace("{pageId}", i.toString()));
				                    obj = $("#PageRoom_"+i.toString());
				                }
				                if (oi.isPrint == "1") {
				                    isPrint = "【已打印】";
				                }
				                //标题
				                tempHtml = "<table style=\"width:90%;\">";
				                tempHtml += "<tr>";
				                tempHtml += "<td style=\"font-weight:bold;text-align:left;font-size:18px;padding-left:3px;padding-top:10px;font-style:italic;\" width=\"180\">编号:{id}</td>";
				                tempHtml += "<td style=\"text-align:center;font-size:24px;padding:8px;font-weight:bold;\">山西海景航空商旅派送单<span class=\"noprint\">" + isPrint + "</span></td>";
				                tempHtml += "<td style=\"text-align:right;padding-right:3px;padding-top:10px;\" width=\"160\">打印日期:" + new Date().pattern("yyyy-MM-dd") + "</td>";
				                tempHtml += "</tr>";
				                tempHtml += "</table>";
				                var tempHtml_top = tempHtml;
				                //内容
				                tempHtml = "<table cellpadding=\"1\" cellspacing=\"1\" style=\"width:90%;background:#000000;\">";
				                tempHtml += "<tr style=\"height:30px;\">";
				                tempHtml += "<td style=\"background:#ffffff;text-align:center;\" width=\"100\">客户姓名</td>";
				                try{
				                    tempHtml += "<td style=\"background:#ffffff;\" width=\"300\">[" + oi.user.flower.fName + "-" + oi.user.flower.id + "]" + oi.contact + "</td>";
				                }
				                catch (e) {
				                    tempHtml += "<td style=\"background:#ffffff;\" width=\"300\">" + oi.contact + "</td>";
				                }
				                tempHtml += "<td style=\"background:#ffffff;text-align:center;\" width=\"100\">联系电话</td>";
				                tempHtml += "<td style=\"background:#ffffff;\" width=\"300\">" + oi.tel + "</td>";
				                tempHtml += "</tr>";
				                tempHtml += "<tr style=\"height:30px;\">";
				                tempHtml += "<td style=\"background:#ffffff;text-align:center;\" width=\"100\">送件地址</td>";
				                tempHtml += "<td style=\"background:#ffffff;\" colspan=\"3\" style=\"text-align:left;padding-left:5px;\">" + oi.addr + "</td>";
				                tempHtml += "</tr>";
				                //产品列表
				                pInfo = "";
				                allPrice = parseFloat(oi.allPrice);
				                if (oi.lp != null) {
				                    for (var j = 0; j < oi.lp.length; j++) {
				                        if (j == 0) {
				                            pInfo += oi.lp[j].pName + "&nbsp;[ " + oi.lp[j].pNum + "*" + oi.lp[j].price + " ]";
				                        }
				                        else {
				                            pInfo += "<br/>" + oi.lp[j].pName + "&nbsp;[ " + oi.lp[j].pNum + "*" + oi.lp[j].price + " ]";
				                        }
				                    }
				                }
				                /*多个订单合并*/
				                var tempn = 0;
				                var orders = oi.id;
				                if (oi.userId > 0) {
				                    for (var n = 1; n < 20; n++) {
				                        if ((i + n) < o.List.length) {
				                            if (oi.userId == o.List[i + n].userId) {
				                                if (o.List[i + n].lp != null) {
				                                    for (var j = 0; j < o.List[i + n].lp.length; j++) {
				                                        pInfo += "<br/>" + o.List[i + n].lp[j].pName + "&nbsp;[ " + o.List[i + n].lp[j].pNum + "*" + o.List[i + n].lp[j].price + " ]";
				                                    }
				                                }
				                                orders += "," + o.List[i + n].id;
				                                allPrice += parseFloat(o.List[i + n].allPrice);
				                                tempn = tempn + 1;
				                            }
				                        }
				                    }
				                    i = i + tempn;
				                }
				                tempHtml_top = tempHtml_top.replace("{id}", orders);
				                obj.append(tempHtml_top);
				                /*多个订单合并*/
				                tempHtml += "<tr style=\"height:60px;\">";
				                tempHtml += "<td style=\"background:#ffffff;text-align:center;\" width=\"100\">配送清单</td>";
				                tempHtml += "<td style=\"background:#ffffff;\" width=\"300\">" + pInfo + ",总计" + allPrice + "元</td>";
				                tempHtml += "<td style=\"background:#ffffff;text-align:center;\" width=\"100\">备注信息</td>";
				                tempHtml += "<td style=\"background:#ffffff;\" width=\"300\">" + oi.memo + "</td>";
				                tempHtml += "</tr>";
				                tempHtml += "<tr style=\"height:30px;\">";
				                tempHtml += "<td style=\"background:#ffffff;text-align:center;\" width=\"100\">下单日期</td>";
				                tempHtml += "<td style=\"background:#ffffff;\" width=\"300\">" +new Date(oi.addOn).pattern("yyyy-MM-dd") + "</td>";
				                tempHtml += "<td style=\"background:#ffffff;text-align:center;\" width=\"100\">配送小哥</td>";
				                if (oi.sendWorkerName != null) {
				                    tempHtml += "<td style=\"background:#ffffff;\" width=\"300\">" + oi.sendWorkerName + " [ " + oi.sendWorkerTel + " ]</td>";
				                }
				                else {
				                    tempHtml += "<td style=\"background:#ffffff;\" width=\"300\"></td>";
				                }
				                tempHtml += "</tr>";
				                tempHtml += "<tr style=\"height:30px;\">";
                                /*
				                tempHtml += "<td style=\"background:#ffffff;text-align:center;\" width=\"100\">支付方式</td>";
				                balance = "";
				                if (oi.payType.toString() == "2") {
				                    balance = "[目前余额：" + oi.userBalance + "元]";
				                }
				                isPay = "";
				                if (oi.isPay == 0) {
				                    isPay = "[未支付]";
				                }
				                tempHtml += "<td style=\"background:#ffffff;\" width=\"300\">" + oi.payType.toString().replace("0", "微信").replace("1", "现金").replace("2", "余额") + "支付" + balance + isPay +"</td>";
                                */
				                tempHtml += "<td colspan=\"2\" style=\"background:#ffffff;padding:5px;font-weight:bold;padding-left:30px;font-size:16px;text-align:left;\">请您当场验货，签字确认后不退不换</td>";
				                tempHtml += "<td colspan=\"2\" style=\"background:#ffffff;padding:10px;text-align:left;padding-left:30px;\">客户签字：</td>";
				                tempHtml += "</tr>";
				                tempHtml += "</table>";
				                obj.append(tempHtml);
				                //分隔符
				                obj.append("<div style=\"height:80px;\">&nbsp;</div>");
				                if ((i + 1) % 3 == 0) {

				                }
				                else {
				                    //obj.append("<div style=\"height:80px;\">&nbsp;</div>");
				                }
				            }
				        }
				        else {
				            $("#NoPrintInfo").hide();
				            $("#PrintInfo").html("无记录");
				        }
				    }
				}
		);
    }
}