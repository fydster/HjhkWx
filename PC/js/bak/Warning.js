var _Warning = {
    orderNo: "",
    Default_Page_Size: 100,
    action: 0,
    shoesNum: 0,
    Page_Now: 1,
    perPrice: 10,
    allPrice: 0,
    price: 0,
    subPrice: 0,
    wxCardFee: 0,
    getTime: "",
    serviceId: 1,
    state: 0,
    employeeS: "",
    workNo: "",
    btnID: "",
    getWorkNo: "",
    sendWorkNo: "",
    deleteImg: "",
    userId: 0,
    area: "",
    products: "",
    selectNo: "",
    oType: 0,
    isUpdateProduct: 0,
    WarnAction: 0,
    classInfo: "1|鲜花配送",
    init: function () {
        $("#U_O_Service").find("dd button").unbind().bind("click", function () {
            $("#U_O_Service").find("dd button").removeClass();
            $("#U_O_Service").find("dd button").addClass("button button-big border-main");
            $(this).removeClass("border-main").addClass("bg-main icon-check");
            _Warning.serviceId = $(this).val();
            if (_Warning.serviceId == 1) {
                _Warning.perPrice = 10;
            }
            else {
                _Warning.perPrice = 15;
            }
            _Warning.CountSalePrice();
        });
        $("#btn_Warning").find("button").unbind().bind("click", function () {
            if ($(this).hasClass("icon-check")) {
                _Warning.HideOrderInfo(1);
            }
            else {
                $("#btn_Warning").find("button").removeClass("icon-check");
                $(this).addClass("icon-check");
                if ($(this).val() == 0) {
                    $("#show_info").find("blockquote strong").text("当日取送监测");
                    $("#show_info").find("blockquote p").text("当日已派单取件的和已派单送件的订单，正常情况下晚上下班后应全部处理完成。");
                    $("#show_info").find("blockquote").removeClass().addClass("border-main");
                    _Warning.WarnAction = 0;
                    _Warning.HideOrderInfo(1);
                }
                else if ($(this).val() == 1) {
                    $("#show_info").find("blockquote strong").text("超时订单监测");
                    $("#show_info").find("blockquote p").text("取件完成后超过3天没有送件完成的订单。");
                    $("#show_info").find("blockquote").removeClass().addClass("border-sub");
                    _Warning.WarnAction = 1;
                    _Warning.HideOrderInfo(1);
                }
                else if ($(this).val() == 2) {
                    $("#show_info").find("blockquote strong").text("下单未支付");
                    $("#show_info").find("blockquote p").text("下单完成，未支付的订单。");
                    $("#show_info").find("blockquote").removeClass().addClass("border-mix");
                    _Warning.WarnAction = 2;
                    _Warning.HideOrderInfo(1);
                }
                else if ($(this).val() == 3) {
                    $("#show_info").find("blockquote strong").text("充值未成功");
                    $("#show_info").find("blockquote p").text("充值已下单完成，未支付。");
                    $("#show_info").find("blockquote").removeClass().addClass("border-green");
                    _Warning.WarnAction = 3;
                    _Warning.HideOrderInfo(1);
                }
            }
        });
        var NowDate = new Date().pattern("yyyy-MM-dd");
        $('#DateS').val(NowDate);
        $('#DateS').datetimepicker({
            lang: 'ch',
            timepicker: false,
            format: 'Y-m-d',
            formatDate: 'Y-m-d'
        });
        $("#btn_CloseUpdate").unbind().bind("click", function () {
            _Warning.ShowOrderInfo(_Warning.orderNo);
            _Warning.cancelUpdate();
        });
        $("#btn_CancelUpdate").unbind().bind("click", function () {
            _Warning.ShowOrderInfo(_Warning.orderNo);
            _Warning.cancelUpdate();
        });
        //是否修改订单产品
        $("#isUpdateProduct").unbind().bind("click", function () {
            if ($(this).hasClass("icon-square-o")) {
                $(this).removeClass().addClass("icon-check-square-o");
                $("#U_O_Product").show();
                _Warning.isUpdateProduct = 1;
            }
            else {
                $(this).removeClass().addClass("icon-square-o");
                $("#U_O_Product").hide();
                _Warning.isUpdateProduct = 0;
            }
        });
        //订单详情中的修改订单信息
        $("#O_Submit_Update").unbind().bind("click", function () {
            $("#tab-Li-Update").removeClass("hidden").addClass("active");
            $("#tab-UpdateProduct").removeClass("hidden").addClass("active");
            $("#tab-Li-Info").removeClass("active").addClass("hidden");
            $("#tab-OrderInfo").removeClass("active").addClass("hidden");
            $("#tab-Li-List").removeClass("active").addClass("hidden");
            $("#tab-OrderList").removeClass("active").addClass("hidden");
        });
        $("#O_Submit").unbind().bind("click", function () {
            _Warning.UpdateOrder();
        });
        //模板消息内容组合
        $("#C_first").keyup(function () {
            _Warning.SetTMsg();
        });
        $("#C_last").keyup(function () {
            _Warning.SetTMsg();
        });
        $("#btn_SendTMsg").unbind().bind("click", function () {
            _Warning.SendTMsg();
        });
        //数量
        $("#shoesNum").keyup(function () {
            var shoesNum = $(this).val();
            if (isNaN(shoesNum)) {
                $(this).val("0");
            }
            else {
                $("#O_ShoesNum").find("dd button").removeClass("icon-check");
                _Warning.shoesNum = $(this).val();
                _Warning.CountSalePrice();
            }
        });
        $("#U_O_ShoesNum").find("dd button").unbind().bind("click", function () {
            if ($(this).hasClass("icon-check")) {
            }
            else {
                $("#U_O_ShoesNum").find("dd button").removeClass("icon-check");
                $(this).addClass("icon-check");
                _Warning.shoesNum = $(this).val();
                $("#shoesNum").val(_Warning.shoesNum);
                _Warning.CountSalePrice();
            }
        });
        $('#Hour').datetimepicker({
            lang: 'ch',
            timepicker: false,
            format: 'Y-m-d',
            formatDate: 'Y-m-d'
        });
        $("#U_O_ArriveOn").find("dd button").unbind().bind("click", function () {
            if ($(this).hasClass("icon-check")) {
            }
            else {
                $("#U_O_ArriveOn").find("dd button").removeClass("icon-check");
                $(this).addClass("icon-check");
                _Warning.getTime = $(this).val();
            }
        });
        $("#S_State").change(function () {
            var State = $(this).val();
            if (State == 2) {
                $("#GetSelect").show();
            }
            else {
                $("#GetSelect").hide();
            }
        });
        $("#I_RefundFee").unbind().bind("click", function () {
            _Warning.RefundFee();
        });
        $("#I_CashOver").unbind().bind("click", function () {
            _Warning.OverCash();
        });
        $("#I_OrderSure").unbind().bind("click", function () {
            _Warning.state = 2;
            _Warning.btnID = "I_OrderSure";
            _Warning.OrderSure()
        });
        $("#I_ReadyGet").unbind().bind("click", function () {
            _Warning.state = 3;
            _Warning.btnID = "I_ReadyGet";
            _Warning.OrderSure()
        });
        $("#I_WashOver").unbind().bind("click", function () {
            _Warning.state = 5;
            _Warning.btnID = "I_WashOver";
            _Warning.OrderSure()
        });
        $("#I_ReadySend").unbind().bind("click", function () {
            _Warning.state = 6;
            _Warning.btnID = "I_ReadySend";
            _Warning.OrderSure()
        });
        $("#GetOver").unbind().bind("click", function () {
            _Warning.state = 3;
            _Warning.btnID = "GetOver";
            _Warning.MoreOrderSure();
        });
        $("#SureOver").unbind().bind("click", function () {
            _Warning.state = 2;
            _Warning.btnID = "SureOver";
            _Warning.MoreOrderSure();
        });
        $("#SendOver").unbind().bind("click", function () {
            _Warning.state = 6;
            _Warning.btnID = "SendOver";
            _Warning.MoreOrderSure();
        });
        $("#WashOver").unbind().bind("click", function () {
            _Warning.state = 5;
            _Warning.btnID = "WashOver";
            _Warning.MoreOrderSure();
        });
        $("#btn_imgDelete").unbind().bind("click", function () {
            _Warning.DeleteImg();
        })
        _Warning.initEmployee();
        _Warning.InitDayCount();
        _Warning.ShowOrderList(_Warning.Page_Now);
    },
    //获取预约数量
    InitDayCount: function () {
        $.ajax(
              {
                  url: _Init.ServerUrl,
                  context: document.body,
                  dataType: "json",
                  cache: false,
                  data: { fn: 42, t: new Date() },
                  success: function (o) {
                      if (o.Return == 0) {
                          $("#DayCount").html("");
                          for (var i = 0; i < o.List.length; i++) {
                              var oi = o.List[i];
                              if (parseInt(oi.num) >= 70) {
                                  $("#DayCount").append("<button class=\"button bg-red\">" + oi.cDate + " <span class=\"badge bg-red-light\">" + oi.num + "</span></button>&nbsp;&nbsp;");
                              }
                              else {
                                  $("#DayCount").append("<button class=\"button bg-main\">" + oi.cDate + " <span class=\"badge bg-main-light\">" + oi.num + "</span></button>&nbsp;&nbsp;");
                              }
                          }
                      }
                  }
              }
        );
    },
    //初始化产品修改列表
    InitProduct: function (pInfo) {
        var products = _Warning.products;
        if (products.length == 0) {
            $.ajax(
                        {
                            url: _Init.ServerUrl,
                            context: document.body,
                            dataType: "json",
                            cache: false,
                            data: { fn: 6, t: new Date() },
                            success: function (o) {
                                if (o.Return == 0) {
                                    var products = "";
                                    for (var i = 0; i < o.List.length; i++) {
                                        var oi = o.List[i];
                                        products += oi.cId + "|" + oi.pName + "|" + oi.price + "|" + oi.id + ",";
                                    }
                                    _Warning.products = products;
                                    _Warning.OperProduct(pInfo);
                                }
                            }
                        }
                    );
        }
        else {
            _Warning.OperProduct(pInfo);
        }
    },
    OperProduct: function (pInfo) {
        var template = "<div class=\"input-group\" style=\"width:290px;height:35px;float:left; margin-right:15px;\"><span class=\"addon\" style=\"font-size:16px;width:200px;\">{pName}[{price}元]</span><span class=\"addon icon-minus\" title=\"product_{id}\" name=\"{price}\" style=\"font-size:16px;\"></span><input type=\"text\" class=\"input\" value=\"{3}\" style=\"height:35px;width:30px;\" id=\"product_{id}\" name=\"product_{id}\" size=\"50\" placeholder=\"0\"><span class=\"addon icon-plus\" title=\"product_{id}\" name=\"{price}\" style=\"font-size:16px;\"></span></div>";
        var tempanel = "<dl class=\"dl-inline clearfix\"><dt class=\"hj-text-title\">{1}</dt><dd>{2}</dd></dl>";
        $("#U_O_Product").html("");
        var proArr = _Warning.products.split(",");
        var tempHtml = "";
        var tempAll = "";
        var cArr = _Warning.classInfo.split(",");
        for (var j = 0; j < cArr.length; j++) {
            tempAll = "";
            for (var i = 0; i < proArr.length; i++) {
                if (proArr[i].split("|")[0] == cArr[j].split("|")[0]) {
                    tempHtml = template.replace(/{id}/g, proArr[i].split("|")[3]);
                    tempHtml = tempHtml.replace(/{price}/g, proArr[i].split("|")[2]);
                    tempHtml = tempHtml.replace(/{pName}/g, proArr[i].split("|")[1]);
                    if (pInfo.indexOf("," + proArr[i].split("|")[3] + "|") >= 0) {
                        var pArr = pInfo.split(",");
                        var pNum = 0;
                        for (var n = 0; n < pArr.length; n++) {
                            if (pArr[n].split("|")[0] == proArr[i].split("|")[3]) {
                                pNum = pArr[n].split("|")[1];
                            }
                        }
                        tempHtml = tempHtml.replace("{3}", pNum);
                    }
                    else {
                        tempHtml = tempHtml.replace("{3}", "0");
                    }
                    tempAll += tempHtml;
                }
            }
            $("#U_O_Product").append(tempanel.replace("{1}", cArr[j].split("|")[1]).replace("{2}", tempAll))
        }
        //产品选择
        $("#U_O_Product").find(".icon-minus").unbind().bind("click", function () {
            var obj = $("#" + $(this).attr("title"));
            var nowNum = parseInt(obj.val());
            if (nowNum > 0) {
                nowNum = nowNum - 1;
            }
            obj.val(nowNum);
            _Warning.CountSalePrice();
        });
        $("#U_O_Product").find(".icon-plus").unbind().bind("click", function () {
            var obj = $("#" + $(this).attr("title"));
            var nowNum = parseInt(obj.val());
            if (nowNum < 100) {
                nowNum = nowNum + 1;
            }
            obj.val(nowNum);
            _Warning.CountSalePrice();
        });
    },
    //合成模板消息
    SetTMsg: function () {
        var first = $("#C_first").val();
        var last = $("#C_last").val();
        var orderNo = _Warning.orderNo;
        var NowDate = new Date().pattern("yyyy-MM-dd HH:mm");
        $("#first_Msg").text(first);
        $("#orderNo_Msg").text("订单号：" + orderNo);
        $("#Date_Msg").text("日期：" + NowDate);
        $("#last_Msg").html(last + "<br>[山西海景航空商旅 0351-7777066]");
    },
    SelectWork: function (id,workNo, workName) {
        $("#" + id).find("button").eq(0).text(workName);
        _Warning.workNo = workNo;
        $("#U_O_ArriveOn").click();
    },
    CountSalePrice: function () {
        var tempPrice = 0;//parseFloat(_Warning.perPrice) * parseInt(_Warning.shoesNum);
        $("#U_O_Product").find("div").each(function () {
            tempPrice += parseInt($(this).find(".icon-minus").attr("name")) * parseInt($(this).find("input").val());
        });
        _Warning.allPrice = tempPrice-_Warning.subPrice-_Warning.wxCardFee;
        $("#allPrice").val(tempPrice);
        $("#U_O_AllPrice").find("dd div h1 strong").text(tempPrice);
    },
    cancelUpdate: function () {
        $("#tab-Li-Update").removeClass("active").addClass("hidden");
        $("#tab-UpdateProduct").removeClass("active").addClass("hidden");
        $("#tab-Li-Info").removeClass("hidden").addClass("active");
        $("#tab-OrderInfo").removeClass("hidden").addClass("active");
        $("#tab-Li-List").removeClass("hidden");
        $("#tab-OrderList").removeClass("hidden");
    },
    operShow: function (State, isCall,isPay,payType) {
        $("#I_OrderSure").hide();
        $("#I_RefundFee").hide();
        $("#I_WashOver").hide();
        $("#WorkerForInfo").hide();
        $("#I_ReadyGet").hide();
        $("#I_ReadySend").hide();
        $("#I_CashOver").hide();
        $("#O_Submit_Update").removeAttr("disabled");
        if (isCall) {
            if (State == 2) {
                $("#WorkerForInfo").show();
                $("#I_ReadyGet").show();
            }
            else if (State == 4) {
                $("#I_WashOver").show();
            }
            else if (State == 5) {
                $("#WorkerForInfo").show();
                $("#I_ReadySend").show();
            }
            if (State > 6) {
                $("#O_Submit_Update").attr("disabled", "disabled");
            }
        }
        else {
            if (State == 0 || State == 1) {
                $("#I_OrderSure").show();
            }
            else if (State == 2) {
                $("#WorkerForInfo").show();
                $("#I_ReadyGet").show();
            }
            else if (State == 4) {
                $("#I_WashOver").show();
            }
            else if (State == 5) {
                $("#WorkerForInfo").show();
                $("#I_ReadySend").show();
            }
            if (State > 6) {
                $("#O_Submit_Update").attr("disabled", "disabled");
            }
            if (State == 9) {
                if (isPay == 1 && payType == 0) {
                    $("#I_RefundFee").show();
                }
            }
            //确认收现
            if (isPay == 0 && _Warning.oType == 1) {
                $("#I_CashOver").show();
            }
        }
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
				            $("#WorkerForInfo").find("ul").html("");
				            $("#WorkerForList").find("ul").html("");
                            //查询条件的派送员按钮
				            var btn_template = "<button class=\"button border-green\" value=\"{1}\">{2}</button>&nbsp;";
				            var btn_template_check = "<button class=\"button border-green icon-check\" value=\"{1}\">{2}</button>&nbsp;";
				            $("#btn_Employee_Group").append(btn_template_check.replace("{1}", "").replace("{2}", "全部"));
                            //End

				            var template = "<li><a href=\"javascript:_Warning.SelectWork('{3}', '{2}', '{name}');\">{name}</a></li>";
				            var tempHtml = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var ci = o.List[i];
				                _Warning.employeeS += ci.name + "|" + ci.workNo + "|" + ci.tel + "|" + ci.isService + ",";
				                if (ci.isService == 1) {
				                    $("#btn_Employee_Group").append(btn_template.replace("{1}", ci.workNo).replace("{2}", ci.name));
				                    tempHtml = template.replace(/{name}/g, ci.name);
				                    tempHtml = tempHtml.replace("{2}", ci.workNo);
				                    $("#WorkerForInfo").find("ul").append(tempHtml.replace("{3}", "WorkerForInfo"));
				                    $("#WorkerForList").find("ul").append(tempHtml.replace("{3}", "WorkerForList"));
				                }
				            }

				            $("#btn_Employee_Group").find("button").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_Employee_Group").find("button").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _Warning.selectNo = $(this).val();
				                    _Warning.HideOrderInfo(1);
				                    _Warning.ShowOrderList(_Warning.Page_Now);
				                    return;
				                }
				            });
				        }
				    }
				}
		);
    },
    GetEmployee: function (workNo) {
        var wInfo = "--";
        var einfo = _Warning.employeeS;
        if (einfo.length > 0 && workNo.length > 0) {
            try{
                var eArr = einfo.split(",");
                for (var i = 0; i < eArr.length; i++) {
                    var esArr = eArr[i].split("|");
                    if (esArr[1] == workNo) {
                        wInfo = esArr[0] + "[" + esArr[2] + "]";
                        i = eArr.length;
                    }
                }
            }
            catch(ex){}
        }
        return wInfo;
    },
    ShowOrderInfo: function (orderNo) {
        $("#tab-OrderInfo").find("div div dl dd").each(function () { $(this).html("&nbsp;"); });
        $("#btn_UpdatePrice").unbind().bind("click", _Warning.UpdatePrice);
        var htmlHead = "<tr><th width=\"150\">用户</th><th width=\"150\">工号</th><th width=\"150\">时间</th><th>内容</th></tr>";
        var template = "<tr><td>{3}</td><td>{4}</td><td>{1}</td><td>{2}</td></tr>";
        _Warning.orderNo = orderNo;
        _Warning.getWorkNo = "";
        _Warning.sendWorkNo = "";
        $("#Log_List").html("");
        $.ajax(
				    { url: _Init.ServerUrl,
				        context: document.body,
				        dataType: "json",
				        cache: false,
				        data: { fn: 23, orderNo: orderNo, t: new Date() },
				        success: function (o) {
				            if (o.Return == 0) {
                                //修改订单
				                $("#Hour").val(new Date(o.Info.getDate).pattern("yyyy-MM-dd"));
				                $("#tel").val(o.Info.tel);
				                $("#contact").val(o.Info.contact);
				                $("#addr").val(o.Info.addr);
				                $("#memo").val(o.Info.memo);
				                $("#shoesNum").val(o.Info.shoesNum);
				                _Warning.shoesNum = o.Info.shoesNum;
				                _Warning.getTime = o.Info.getTime;
                                //预约时间
				                $("#U_O_ArriveOn").find("dd button").each(function () {
				                    if ($(this).val() == o.Info.getTime) {
				                        $(this).addClass("icon-check");
				                    }
				                });
				                $("#U_O_Service").find("dd button").each(function () {
				                    $(this).removeClass("bg-main icon-check");
				                    if ($(this).val() == o.Info.serviceId) {
				                        $(this).removeClass("border-main").addClass("bg-main icon-check");
				                    }
				                });
				                _Warning.oType = o.Info.oType;
				                _Warning.price = o.Info.price;
				                _Warning.allPrice = o.Info.allPrice;
				                _Warning.subPrice = o.Info.subPrice;
				                _Warning.wxCardFee = o.Info.wxCardFee;
				                $("#price").val(o.Info.price);
				                $("#U_O_S_AllPrice").text(o.Info.allPrice);
				                $("#U_O_S_SubPrice").text(o.Info.subPrice);
				                $("#U_O_S_WxCardFee").text(o.Info.wxCardFee);
				                $("#U_O_AllPrice").find("dd div h1 strong").text(o.Info.price);
				                //业务信息
				                $("#O_PayType").find("dd").html(o.Info.payType.toString().replace("0", "微信支付").replace("1", "现金支付").replace("2", "余额支付"));
				                var isPay = "否";
				                if (o.Info.isPay == 1) {
				                    isPay = "是[" + new Date(o.Info.payOn).pattern("yyyy-MM-dd HH:mm") + "]";
				                }
				                if (o.Info.activeName != null) {
				                    if (o.Info.activeName.length > 0) {
				                        $("#O_Active").find("dd").html(o.Info.activeName);
				                    }
				                }
				                $("#O_IsPay").find("dd").html(isPay);
				                $("#O_State").find("dd").html(_Warning.getState(o.Info.state));
				                $("#P_OrderNo").html(o.Info.orderNo + "&nbsp;&nbsp;&nbsp;取送编号：" + o.Info.id);
				                var pInfo = "";
				                var pInfos = ",";
				                if (o.Info.lp != null) {
				                    for (var j = 0; j < o.Info.lp.length; j++) {
				                        pInfo += o.Info.lp[j].pName + "&nbsp;<span class=\"badge bg-red-light\">" + o.Info.lp[j].pNum + "x" + o.Info.lp[j].price + " </span>";
				                        pInfos += o.Info.lp[j].pid + "|" + o.Info.lp[j].pNum + ",";
				                    }
				                }
				                $("#O_Service").find("dd").html(pInfo);
				                $("#U_O_Product_Show").find("dl dd").html(pInfo);
				                //$("#O_IsVisit").find("dd").html(o.Info.isVisit.toString().replace("1", "是").replace("0", "否"));
				                $("#O_TestOn").find("dd").html(new Date(o.Info.getDate).pattern("yyyy-MM-dd") + "," + o.Info.getTime.toString().replace("-", "点-") + "点");
				                $("#O_AllPrice").text(o.Info.allPrice);
				                $("#O_Price").text(o.Info.price);
				                $("#O_SubPrice").text(o.Info.subPrice);
				                $("#O_WxCardFee").text(o.Info.wxCardFee);
				                //用户信息
				                $("#O_Contact").find("dd").html(o.Info.contact + "&nbsp;");
				                if (o.Info.userId != null) {
				                    _Warning.userId = o.Info.userId;
				                }
				                $("#O_Tel").find("dd").html(o.Info.tel);
				                if (o.Info.addr.length > 0) {
				                    $("#O_Addr").find("dd").html(o.Info.addr.toString().replace("^",""));
				                }
				                if (o.Info.memo.length > 0) {
				                    $("#O_Memo").find("dd").html(o.Info.memo);
				                }
				                if (o.Info.getWorker != null && o.Info.getWorker.toString().length > 0) {
				                    $("#O_GetWorker").find("dd").html(_Warning.GetEmployee(o.Info.getWorker));
				                    _Warning.getWorkNo = o.Info.getWorker;
				                    if (o.Info.state == 3) {
				                        var eArr = _Warning.employeeS.split(",");
				                        var template_g = "<button class=\"button border-green\" value=\"{1}\">{0}</button>&nbsp;";
				                        var template_g_check = "<button class=\"button border-green icon-check\" value=\"{1}\">{0}</button>&nbsp;";
				                        var tempHtml_g = "";
				                        $("#U_O_GetWorker").find("dd").html("");
				                        for (var i = 0; i < eArr.length; i++) {
				                            var esArr = eArr[i].split("|");
				                            if (esArr[0].length > 0 && esArr[3] == 1) {
				                                tempHtml_g = template_g.replace("{0}", esArr[0]);
				                                if (o.Info.getWorker.toString() == esArr[1]) {
				                                    tempHtml_g = template_g_check.replace("{0}", esArr[0]);
				                                }
				                                tempHtml_g = tempHtml_g.replace("{1}", esArr[1]);
				                                $("#U_O_GetWorker").find("dd").append(tempHtml_g);
				                            }
				                        }
				                        $("#U_O_GetWorker").find("dd button").unbind().bind("click", function () {
				                            if ($(this).hasClass("icon-check")) {
				                            }
				                            else {
				                                $("#U_O_GetWorker").find("dd button").removeClass("icon-check");
				                                $(this).addClass("icon-check");
				                                _Warning.getWorkNo = $(this).val();
				                            }
				                        });
				                    }
				                    else {
				                        $("#U_O_GetWorker").find("dd").html(o.Info.getWorkerName);
				                    }
				                }
				                if (o.Info.sendWorker != null && o.Info.sendWorker.toString().length>0) {
				                    $("#O_SendWorker").find("dd").html(_Warning.GetEmployee(o.Info.sendWorker));
				                    _Warning.sendWorkNo = o.Info.sendWorker;
				                    if (o.Info.state == 6) {
				                        var eArr = _Warning.employeeS.split(",");
				                        var template_s = "<button class=\"button border-red\" value=\"{1}\">{0}</button>&nbsp;";
				                        var template_s_check = "<button class=\"button border-red icon-check\" value=\"{1}\">{0}</button>&nbsp;";
				                        var tempHtml_s = "";
				                        $("#U_O_SendWorker").find("dd").html("");
				                        for (var i = 0; i < eArr.length; i++) {
				                            var esArr = eArr[i].split("|");
				                            if (esArr[0].length > 0 && esArr[3] == 1) {
				                                tempHtml_s = template_s.replace("{0}", esArr[0]);
				                                if (o.Info.sendWorker.toString() == esArr[1]) {
				                                    tempHtml_s = template_s_check.replace("{0}", esArr[0]);
				                                }
				                                tempHtml_s = tempHtml_s.replace("{1}", esArr[1]);
				                                $("#U_O_SendWorker").find("dd").append(tempHtml_s);
				                            }
				                        }
				                        $("#U_O_SendWorker").find("dd button").unbind().bind("click", function () {
				                            if ($(this).hasClass("icon-check")) {
				                            }
				                            else {
				                                $("#U_O_SendWorker").find("dd button").removeClass("icon-check");
				                                $(this).addClass("icon-check");
				                                _Warning.sendWorkNo = $(this).val();
				                            }
				                        });
				                    }
				                    else {
				                        $("#U_O_SendWorker").find("dd").html(o.Info.sendWorkerName);
				                    }

				                }
				                //产品信息
				                $("#O_ShoesNum").find("dd").html(o.Info.shoesNum + "双");

				                var tempHtml = "";
				                if (o.Info.log != null) {
				                    $("#Log_List").html(htmlHead);
				                    for (var i = 0; i < o.Info.log.length; i++) {
				                        var oi = o.Info.log[i];
				                        tempHtml = template.replace("{2}", oi.content);
				                        tempHtml = tempHtml.replace("{1}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				                        if (oi.lType == 0 || oi.lType == 3) {
				                            tempHtml = tempHtml.replace("{3}", oi.uName);
				                        }
				                        else {
				                            tempHtml = tempHtml.replace("{3}", "--");
				                        }
				                        if (oi.lType == 1 || oi.lType == 2) {
				                            tempHtml = tempHtml.replace("{4}", oi.eName);
				                        }
				                        else {
				                            tempHtml = tempHtml.replace("{4}", "--");
				                        }
				                        $("#Log_List").append(tempHtml);
				                    }
				                }
				                $("#ImgList").html("<div style=\"height:70px;\">无</div>");
				                $("#ImgList_Over").html("<div style=\"height:70px;\">无</div>");
				                if (o.Info.la != null) {
				                    $("#ImgList").html("");
				                    $("#ImgList_Over").html("");
				                    $("#pic_more_e").html("");
				                    $("#pic_more_s").html("");
				                    for (var i = 0; i < o.Info.la.length; i++) {
				                        if (o.Info.la[i].aType == 3) {
				                            $("#ImgList_Over").append("<img title=\"" + o.Info.la[i].aSrc + "\" src=\"" + _Init.BaseUrl + o.Info.la[i].aSrc + "\" data-toggle=\"click\" data-target=\"#mydialog_pic\" data-mask=\"1\" data-width=\"540\" width=\"70\" height=\"70\" class=\"img-border radius-small padding-little\" />");
				                            $("#pic_more_e").append("<img title=\"" + o.Info.la[i].aSrc + "\" src=\"" + _Init.BaseUrl + o.Info.la[i].aSrc + "\" class=\"img-border radius-small padding-little\" style=\"max-height:200px;\" />");
				                        }
				                        else {
				                            $("#ImgList").append("<img title=\"" + o.Info.la[i].aSrc + "\" src=\"" + _Init.BaseUrl + o.Info.la[i].aSrc + "\" data-toggle=\"click\" data-target=\"#mydialog_pic\" data-mask=\"1\" data-width=\"540\" width=\"70\" height=\"70\" class=\"img-border radius-small padding-little\" />");
				                            $("#pic_more_s").append("<img title=\"" + o.Info.la[i].aSrc + "\" src=\"" + _Init.BaseUrl + o.Info.la[i].aSrc + "\" class=\"img-border radius-small padding-little\" style=\"max-height:200px;\" />");
				                        }
				                    }
				                }
				                _Warning.operShow(o.Info.state,o.Info.uid==0,o.Info.isPay,o.Info.payType);
				                $("#tab-Li-Info").removeClass("hidden").addClass("active");
				                $("#tab-OrderInfo").removeClass("hidden").addClass("active");
				                $("#tab-Li-List").removeClass("active");
				                $("#tab-OrderList").removeClass("active");
				                $("#btn_Back").unbind().bind("click", function () { _Warning.HideOrderInfo(0); });
				                $("#btn_Close").unbind().bind("click", function () { _Warning.HideOrderInfo(1); });
				                //图片显示
				                _Warning.deleteImg = "";
				                $("#ImgList").find("img").unbind().bind("click", function () {
				                    var src = $(this).attr("src");
				                    $("#ShowBig_pic").attr("src", src);
				                    _Warning.deleteImg = $(this).attr("title");
				                    $showdialogs($(this));
				                });
				                $("#ImgList_Over").find("img").unbind().bind("click", function () {
				                    var src = $(this).attr("src");
				                    $("#ShowBig_pic").attr("src", src);
				                    _Warning.deleteImg = $(this).attr("title");
				                    $showdialogs($(this));
				                });
				                _Warning.InitProduct(pInfos);
				            }
				            else {
				            }
				        }
				    }
		    );
    },
    ShowLog: function (orderNo) {
        var htmlHead = "<tr><th width=\"150\">用户</th><th width=\"150\">工号</th><th width=\"150\">时间</th><th>内容</th></tr>";
        var template = "<tr><td>{3}</td><td>{4}</td><td>{1}</td><td>{2}</td></tr>";
        _Warning.orderNo = orderNo;
        $("#Log_List").html("");
        $.ajax(
				{ url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 24, orderNo: orderNo, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#Log_List").html("");
				            $("#Log_List").append(htmlHead);
				            var tempHtml = "";
				            if (o.List != null) {
				                for (var i = 0; i < o.List.length; i++) {
				                    var oi = o.List[i];
				                    tempHtml = template.replace("{2}", oi.content);
				                    tempHtml = tempHtml.replace("{1}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				                    if (oi.lType == 0 || oi.lType == 3) {
				                        tempHtml = tempHtml.replace("{3}", oi.uName);
				                    }
				                    else {
				                        tempHtml = tempHtml.replace("{3}", "--");
				                    }
				                    if (oi.lType == 1 || oi.lType == 2) {
				                        tempHtml = tempHtml.replace("{4}", oi.eName);
				                    }
				                    else {
				                        tempHtml = tempHtml.replace("{4}", "--");
				                    }
				                    $("#Log_List").append(tempHtml);
				                }
				            }
				        }
				        else {
				        }
				    }
				}
		    );
    },
    CancelOrder: function () {
        _Warning.action = 9;
        _Warning.AddLog();
    },
    OverOrder: function () {
        _Warning.action = 8;
        _Warning.AddLog();
    },
    CallUser: function () {
        _Warning.action = 100;
        _Warning.AddLog();
    },
    RepeatFix: function () {
        _Warning.action = 99;
        _Warning.AddLog();
    },
    OverCash: function () {
        _Warning.action = 101;
        _Warning.AddLog();
    },
    SendTMsg: function () {
        if (!confirm("确定要发送模板消息！")) {
            return false;
        }
        var first = $("#C_first").val();
        var last = $("#C_last").val();
        var orderNo = _Warning.orderNo;
        var uid = _Warning.userId;
        if (first.length == 0 || last.length == 0) {
            alert("请先填写发送内容");
            return false;
        }
        $.ajax(
				    {
				        url: _Init.ServerUrl,
				        context: document.body,
				        dataType: "json",
				        cache: false,
				        data: { fn: 91, uid:uid,orderNo: orderNo, last: last, first: first, t: new Date() },
				        success: function (o) {
				            alert(o.Msg);
				            if (o.Return == 0) {
				                $("#C_first").val("");
				                $("#C_last").val("");
				                $("#first_Msg").text("");
				                $("#orderNo_Msg").text("订单号：" + orderNo);
				                $("#Date_Msg").text("日期：" + NowDate);
				                $("#last_Msg").html("<br>[山西海景航空商旅 0351-7777066]");
				                _Warning.ShowLog(orderNo);
				            }
				        }
				    }
		    );
    },
    AddLog: function () {
        var content = $("#content").val();
        if (content.length == 0 && _Warning.action != 101) {
            alert("内容不能为空");
            return false;
        }
        $.ajax(
				    { url: _Init.ServerUrl,
				        context: document.body,
				        dataType: "json",
				        cache: false,
				        data: { fn: 25, action: _Warning.action, orderNo: _Warning.orderNo, content: escape(content), t: new Date() },
				        success: function (o) {
				            if (o.Return == 0) {
				                $("#content").val("");
				                if (_Warning.action > 0) {
				                    alert("处理完成");
				                    _Warning.ShowOrderInfo(_Warning.orderNo);
				                    //_Warning.HideOrderInfo(1);
				                    //_Warning.ShowOrderList(_Warning.Page_Now);
				                }
				                else {
				                    _Warning.ShowOrderInfo(_Warning.orderNo);
				                }
				            }
				            else {
				                alert(o.Msg);
				            }
				        }
				    }
		    );
    },
    RefundFee: function () {
        if (!confirm("确定要进行退款操作！")) {
            return false;
        }
        $.ajax(
				    {
				        url: _Init.ServerUrl,
				        context: document.body,
				        dataType: "json",
				        cache: false,
				        data: { fn: 5, orderNo: _Warning.orderNo, t: new Date() },
				        success: function (o) {
				            alert(o.Msg);
				            if (o.Return == 0) {
				                _Warning.ShowOrderInfo(_Warning.orderNo);
				            }
				        }
				    }
		    );
    },
    DeleteImg: function () {
        if (!confirm("确定要删除改图片吗！")) {
            return false;
        }
        if (_Warning.deleteImg.length == 0) {
            return false;
        }
        $.ajax(
				    {
				        url: _Init.ServerUrl,
				        context: document.body,
				        dataType: "json",
				        cache: false,
				        data: { fn: 38, deleteImg: _Warning.deleteImg, t: new Date() },
				        success: function (o) {
				            alert(o.Msg);
				            if (o.Return == 0) {
				                _Warning.ShowOrderInfo(_Warning.orderNo);
				                $('.dialog-mask').remove();
				                $(".dialog-win").remove();
				            }
				        }
				    }
		    );
    },
    MoreOrderSure: function () {
        var orders = "";
        $("span[name='checkItem']").each(function () {
            if ($(this).hasClass("icon-check-square-o")) {
                orders += $(this).attr("title") + ",";
            }
        });
        if (orders.length > 0) {
            _Warning.orderNo = orders;
            _Warning.OrderSure();
        }
        else {
            alert("请选择要处理的订单");
        }
    },
    OrderSure: function () {
        if (_Warning.state == 3 || _Warning.state == 6) {
            if (_Warning.workNo.length == 0) {
                alert("请选择配送员");
                return;
            }
        }
        $("#" + _Warning.btnID).attr("disabled", "disabled");
        $.ajax(
				    {
				        url: _Init.ServerUrl,
				        context: document.body,
				        dataType: "json",
				        cache: false,
				        data: { fn: 3, workNo:_Warning.workNo,state: _Warning.state, orderNo: _Warning.orderNo, submitCheck: escape(_Init.Title), t: new Date() },
				        success: function (o) {
				            alert(o.Msg);
				            if (o.Return == 0) {
				                _Warning.workNo = "";
				                $("#WorkerForList").find("button").eq(0).text("配送员");
				                $("#WorkerForInfo").find("button").eq(0).text("配送员");
				                if (_Warning.orderNo.indexOf(",") > -1) {
				                    _Warning.ShowOrderList(_Warning.Page_Now);
				                }
				                else {
				                    _Warning.ShowOrderInfo(_Warning.orderNo);
				                }				                
				            }
				            $("#" + _Warning.btnID).removeAttr("disabled");
				        }
				    }
		    );
    },
    HideOrderInfo: function (n) {
        if (n == 0) {
            $("#tab-Li-List").addClass("active");
            $("#tab-OrderList").addClass("active");
            $("#tab-Li-Info").removeClass("active");
            $("#tab-OrderInfo").removeClass("active");
        }
        else {
            $("#tab-Li-List").addClass("active");
            $("#tab-OrderList").addClass("active");
            $("#tab-Li-Info").removeClass("active").addClass("hidden");
            $("#tab-OrderInfo").removeClass("active").addClass("hidden");
        }
        if (_Warning.WarnAction == 3) {
            _Warning.getBalanceList(_Warning.Page_Now);
        }
        else {
            _Warning.ShowOrderList(_Warning.Page_Now);
        }
        
    },
    UpdateOrder: function () {
        var orderNo = _Warning.orderNo;
        //产品信息
        var productId = 1;
        var price = $("#price").val();
        //用户信息
        var tel = $("#tel").val();
        var contact = $("#contact").val();
        var addr = $("#addr").val();
        var memo = $("#memo").val();
        var hour = $("#Hour").val();
        var shopping = price + "|";
        var isUpdateProduct = _Warning.isUpdateProduct;
        if (isUpdateProduct == 1) {
            $("#U_O_Product").find("div").each(function () {
                if (parseInt($(this).find("input").val()) > 0) {
                    shopping += $(this).find("input").attr("name").toString().split("_")[1] + "-0-" + $(this).find("input").val() + "|";
                }
            });
        }
        else {
            shopping = "";
        }
        if (tel.length == 0 || contact.length == 0) {
            alert("请填写完整用户基本信息！");
            return false;
        }
        $("#O_Submit").attr("disabled", "disabled");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 2, isUpdateProduct:isUpdateProduct,shopping: shopping, sendWorkNo: _Warning.sendWorkNo, getWorkNo: _Warning.getWorkNo, serviceId: _Warning.serviceId, orderNo: orderNo, shoesNum: _Warning.shoesNum, getTime: escape(_Warning.getTime), hour: hour, serviceId: _Warning.serviceId, memo: escape(memo), addr: escape(addr), contact: escape(contact), tel: tel, price: price, subPrice: _Warning.subPrice, wxCardFee: _Warning.wxCardFee, productId: productId, submitCheck: escape(_Init.Title), t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            $("#isUpdateProduct").removeClass().addClass("icon-square-o");
				            $("#U_O_Product").hide();
				            _Warning.ShowOrderInfo(_Warning.orderNo);
				            _Warning.cancelUpdate();
				        }
				        $("#O_Submit").removeAttr("disabled");
				    },
				    complete: function (o) {
				        $("#O_Submit").removeAttr("disabled");
				    }
				}
		);
    },
    SumPage: function (page) {
        _Warning.ShowOrderList(page);
    },
    ShowOrderList: function (page) {
        _Warning.Page_Now = page;
        var htmlHead = "<tr><th>编号</th><th>时间</th><th width=\"300\">用户(点击可查看用户详情)</th><th>产品详情</th><th>配送详情</th><th>总价</th><th>回访</th><th>状态</th><th width=\"80\">操作</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td {3c}>{3}</td><td>{4}</td><td>{9}</td><td>{5}</td><td>{6}</td><td>{7}</td><td>{8}</td></tr>";
        var template_hz = "<tr class=\"{c}\"><td></td><td></td><td></td><td>{3}</td><td></td><td>{5}</td><td></td><td>{7}</td><td></td></tr>";
        var htmlHead_box = "<tr><th style=\"width:45px;\"><span id=\"checkAll\" class=\"icon-square-o\" style=\"font-size:20px;\"></span></th><th>订单号</th><th>下单时间</th><th>用户详情</th><th>产品详情</th><th>配送详情</th><th>总价</th><th>回访</th><th>状态</th><th>操作</th></tr>";
        var template_box = "<tr class=\"{c}\"><td><span name=\"checkItem\" class=\"icon-square-o\" style=\"font-size:20px;\" title=\"{no}\"></span></td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{9}</td><td>{5}</td><td>{6}</td><td>{7}</td><td>{8}</td></tr>";
        var template_hz_box = "<tr class=\"{c}\"><td>汇总</td><td></td><td></td><td></td><td>{3}</td><td></td><td>{5}</td><td></td><td></td><td></td></tr>";
        var btnTemplate = "<button class=\"button button-small bg-main\" onclick=\"_Warning.ShowOrderInfo('{no}');\">详情</button>";
        $("#OrderList").html("<span class=\"icon-refresh rotate\"></span>");
        $("#PagePanel").hide();
        $.ajax(
				{ url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 43, action: _Warning.WarnAction,Date:$('#DateS').val(),gworkNo: _Warning.selectNo, page: page, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#MoreOper").hide();
				            $("#OrderList").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            var allPrice_hz = 0;
				            var Price_hz = 0;
				            var Price_Wf_hz = 0;
				            var subPrice_hz = 0;
				            var wxCardFee_hz = 0;
				            var shoes = 0;
				            var payType = "微信";
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", oi.id.toString());
				                if (oi.state == 7 || oi.state == 8) {
				                    tempHtml = tempHtml.replace("{2}", "<span class=\"badge bg-blue-light\">下单</span>" + new Date(oi.addOn).pattern("MM-dd HH:mm") + "<br>" + "<span class=\"badge bg-red-light\">完成</span>" + new Date(oi.sendOn).pattern("MM-dd HH:mm") + "<br>" + oi.oType.toString().replace("0", "&nbsp;<span class=\"tag bg-mix\">微信下单</span>").replace("1", "&nbsp;<span class=\"tag bg-gray\">电话下单</span>"));
				                }
				                else {
				                    tempHtml = tempHtml.replace("{2}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm") + "<br>" + oi.oType.toString().replace("0", "<span class=\"tag bg-mix\">微信下单</span>").replace("1", "<span class=\"tag bg-gray\">电话下单</span>"));
				                }
				                var addrInfo = oi.addr;
				                if (oi.addr.indexOf("^") != -1) {
				                    addrInfo = oi.addr.split("^")[0] + "<br>" + oi.addr.split("^")[1];
				                }
				                tempHtml = tempHtml.replace("{3}", oi.contact + "[" + oi.tel + "]&nbsp;<br/>" + addrInfo + "<br/>备注：" + oi.memo);
				                tempHtml = tempHtml.replace("{3c}", "onclick=\"_UserInfo.uid=" + oi.userId + ";_UserInfo.showUserInfo();\"");
				                var pInfo = "";
				                var activeName = "";
				                if (oi.activeName != null) {
				                    activeName = "&nbsp;<span class=\"badge bg-blue-light\">" + oi.activeName + " </span>";
				                }
				                if (oi.lp != null) {
				                    for (var j = 0; j < oi.lp.length; j++) {
				                        shoes += parseInt(oi.lp[j].pNum);
				                        pInfo += oi.lp[j].pName + "&nbsp;<span class=\"badge bg-red-light\">" + oi.lp[j].pNum + "x" + oi.lp[j].price + " </span>" + activeName + "<br/>";
				                    }
				                }
				                if (oi.getDate != null) {
				                    pInfo += "取件：" + new Date(oi.getDate).pattern("MM月dd日") + "," + oi.getTime;
				                }
				                if (oi.sendDate != null && oi.state > 5 && oi.state < 9) {
				                    pInfo += "<br>送件：" + new Date(oi.sendDate).pattern("MM月dd日");
				                }
				                tempHtml = tempHtml.replace("{4}", pInfo);
				                var getInfo = "取：--";
				                var sendInfo = "<br>送：--";
				                if (oi.getWorker.length > 0) {
				                    getInfo = "取：" + oi.getWorkerName + "[" + oi.getWorkerTel + "]";
				                }
				                if (oi.sendWorker.length > 0) {
				                    sendInfo = "<br>送：" + oi.sendWorkerName + "[" + oi.sendWorkerTel + "]";
				                }
				                payType = "微信";
				                if (oi.payType.toString() == "2") {
				                    payType = "余额";
				                }
				                if (oi.payType.toString() == "1") {
				                    payType = "现金";
				                }
				                tempHtml = tempHtml.replace("{9}", getInfo + sendInfo);
				                tempHtml = tempHtml.replace("{5}", oi.allPrice.toString() + "<br>代金券：" + oi.subPrice.toString() + "<br>微信卡券：" + oi.wxCardFee.toString() + "<br>实付款：" + oi.price.toString());
				                tempHtml = tempHtml.replace("{6}", oi.isCall.toString().replace("0", "否").replace("1", "--"));
				                tempHtml = tempHtml.replace("{7}", _Warning.getState(oi.state.toString()) + "<br>" + oi.isPay.toString().replace("1", "<span class=\"badge bg-red-light\">已" + payType + "支付</span>").replace("0", "<span class=\"badge bg-green-light\">未支付</span>"));
				                tempHtml = tempHtml.replace("{8}", btnTemplate.replace(/{no}/g, oi.orderNo));
				                tempHtml = tempHtml.replace("{c}", cName);
				                tempHtml = tempHtml.replace(/{no}/g, oi.orderNo);
				                $("#OrderList").append(tempHtml);
				                allPrice_hz += parseFloat(oi.allPrice);
				                Price_hz += parseFloat(oi.price);
				                if (oi.isPay == 0) {
				                    Price_Wf_hz += parseFloat(oi.price);
				                }
				                subPrice_hz += parseFloat(oi.subPrice);
				                wxCardFee_hz += parseFloat(oi.wxCardFee);
				            }
				            tempHtml = template_hz.replace("{5}", allPrice_hz.toFixed(2) + "<br>代金券：" + subPrice_hz.toFixed(2) + "<br>微信卡券：" + wxCardFee_hz.toFixed(2) + "<br>实付款：" + Price_hz.toFixed(2));
				            tempHtml = tempHtml.replace("{7}", "未支付：" + Price_Wf_hz.toFixed(2) + "<br>实收：" + (allPrice_hz - subPrice_hz - wxCardFee_hz - Price_Wf_hz));
				            tempHtml = tempHtml.replace("{3}", shoes + "件");
				            $("#OrderList").append(tempHtml);
				            _Init.ShowPage(page, o.Msg, "_Warning", _Warning.Default_Page_Size);
				            //_Warning.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#OrderList").html("无记录");
				            $("#PagePanel").hide();
				        }
				    }
				}
		);
    },
    getBalanceList: function (page) {
        var htmlHead = "<tr><th width=\"160\">时间</th><th width=\"50\">类型</th><th width=\"200\">描述</th><th width=\"80\">用户(点击查看详情)</th><th width=\"70\">金额</th><th width=\"70\">赠送</th><th width=\"70\">状态</th></tr>";
        var template = "<tr class=\"{c}\"><td>{3}</td><td>{4}</td><td>{1}</td><td onclick=\"_Init.showUserInfo({uid});\">{2}</td><td>{5}</td><td>{6}</td><td>{7}</td></tr>";
        var DateS = $('#DateS').val();
        var DateE = $('#DateS').val();
        $.ajax(
                {
                    url: _Init.ServerUrl,
                    context: document.body,
                    dataType: "json",
                    cache: false,
                    data: { fn: 29, bType: -2, DateE: DateE, DateS: DateS, page: page, t: new Date() },
                    success: function (o) {
                        if (o.Return == 0) {
                            $("#OrderList").html(htmlHead);
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
                                tempHtml = tempHtml.replace("{7}", enable);
                                tempHtml = tempHtml.replace("{c}", cName);
                                tempHtml = tempHtml.replace("{uid}", oi.uid);
                                $("#OrderList").append(tempHtml);
                            }
                            _Init.ShowPage(page, o.Msg, "_Warning", _Warning.Default_Page_Size);
                            //_Balance.ShowPage(page, o.Msg);
                        }
                        else {
                            $("#OrderList").html("无记录");
                            $("#PagePanel").hide();
                        }
                    }
                }
        );
    },
    getState: function (state) {
        state = state.toString();
        switch (state) {
            case "0":
                return "新订单";
            case "1":
                return "待支付";
            case "2":
                return "待取件";
            case "3":
                return "取件中";
            case "5":
                return "待送件";
            case "6":
                return "送件中";
            case "7":
                return "已送达";
            case "8":
                return "已完成";
            case "9":
                return "订单取消";
            case "10":
                return "退款完成";
        }
    }
}
