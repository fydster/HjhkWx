var _OrderList = {
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
    state: -2,
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
    classInfo: "",
    init: function () {
        //是否显示来源选择
        var C_SourceId = $.cookie("_SourceId");
        if (C_SourceId != null && C_SourceId.length > 0) {
            $("#S_O_SourceId").find("div").eq(1).html(_Init.initPartner("S_SourceId", 0));
            if (parseInt(C_SourceId) > 0) {  
                $("#S_O_SourceId").hide();
            }
        }
        $("#U_O_Service").find("dd button").unbind().bind("click", function () {
            $("#U_O_Service").find("dd button").removeClass();
            $("#U_O_Service").find("dd button").addClass("button button-big border-main");
            $(this).removeClass("border-main").addClass("bg-main icon-check");
            _OrderList.serviceId = $(this).val();
            if (_OrderList.serviceId == 1) {
                _OrderList.perPrice = 10;
            }
            else {
                _OrderList.perPrice = 15;
            }
            _OrderList.CountSalePrice();
        });
        var NowDate = new Date().pattern("yyyy-MM-dd");
        //$('#S_DateS').val(NowDate);
        $('#S_DateE').val(NowDate);
        $('#Q_DateS').val(NowDate);
        $('#S_DateS').datetimepicker({
            lang: 'ch',
            timepicker: false,
            format: 'Y-m-d',
            formatDate: 'Y-m-d'
        });
        $('#S_DateE').datetimepicker({
            lang: 'ch',
            timepicker: false,
            format: 'Y-m-d',
            formatDate: 'Y-m-d'
        });
        $('#Q_DateS').datetimepicker({
            lang: 'ch',
            timepicker: false,
            format: 'Y-m-d',
            formatDate: 'Y-m-d'
        });
        $("#btn_Select").unbind().bind("click", function () {
            _OrderList.HideOrderInfo(1);
            //_OrderList.ShowOrderList(_OrderList.Page_Now);
        });
        $("#btn_Select_Today").unbind().bind("click", function () {
            $('#S_DateS').val(NowDate);
            _OrderList.HideOrderInfo(1);
            //_OrderList.ShowOrderList(_OrderList.Page_Now);
        });
        $("#btn_CloseUpdate").unbind().bind("click", function () {
            _OrderList.ShowOrderInfo(_OrderList.orderNo);
            _OrderList.cancelUpdate();
        });
        $("#btn_CancelUpdate").unbind().bind("click", function () {
            _OrderList.ShowOrderInfo(_OrderList.orderNo);
            _OrderList.cancelUpdate();
        });
        //是否修改订单产品
        $("#isUpdateProduct").unbind().bind("click", function () {
            if ($(this).hasClass("icon-square-o")) {
                $(this).removeClass().addClass("icon-check-square-o");
                $("#U_O_Product").show();
                _OrderList.isUpdateProduct = 1;
            }
            else {
                $(this).removeClass().addClass("icon-square-o");
                $("#U_O_Product").hide();
                _OrderList.isUpdateProduct = 0;
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
            _OrderList.UpdateOrder();
        });
        //模板消息内容组合
        $("#C_first").keyup(function () {
            _OrderList.SetTMsg();
        });
        $("#C_last").keyup(function () {
            _OrderList.SetTMsg();
        });
        $("#btn_SendTMsg").unbind().bind("click", function () {
            _OrderList.SendTMsg();
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
                _OrderList.getTime = $(this).val();
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
            _OrderList.RefundFee();
        });
        $("#I_CashOver").unbind().bind("click", function () {
            _OrderList.OverCash();
        });
        $("#I_OrderSure").unbind().bind("click", function () {
            _OrderList.state = 2;
            _OrderList.btnID = "I_OrderSure";
            _OrderList.OrderSure()
        });
        $("#I_ReadyGet").unbind().bind("click", function () {
            _OrderList.state = 2;
            _OrderList.btnID = "I_ReadyGet";
            _OrderList.OrderSure()
        });
        $("#I_WashOver").unbind().bind("click", function () {
            _OrderList.state = 5;
            _OrderList.btnID = "I_WashOver";
            _OrderList.OrderSure()
        });
        $("#I_ReadySend").unbind().bind("click", function () {
            _OrderList.state = 6;
            _OrderList.btnID = "I_ReadySend";
            _OrderList.OrderSure()
        });
        $("#SendEnd").unbind().bind("click", function () {
            _OrderList.state = 8;
            _OrderList.btnID = "SendEnd";
            _OrderList.MoreOrderSure();
        });
        $("#SureOver").unbind().bind("click", function () {
            _OrderList.state = 2;
            _OrderList.btnID = "SureOver";
            _OrderList.MoreOrderSure();
        });
        $("#SendOver").unbind().bind("click", function () {
            _OrderList.state = 2;
            _OrderList.btnID = "SendOver";
            _OrderList.MoreOrderSure();
        });
        $("#WashOver").unbind().bind("click", function () {
            _OrderList.state = 12;
            _OrderList.btnID = "WashOver";
            _OrderList.MoreOrderSure();
        });
        $("#btn_imgDelete").unbind().bind("click", function () {
            _OrderList.DeleteImg();
        })
        //初始化状态查询按钮
        var btn_template = "<button class=\"button\" value=\"{1}\">{2}</button>&nbsp;";
        var btn_template_check = "<button class=\"button icon-check\" value=\"{1}\">{2}</button>&nbsp;";
        $("#btn_State_Group").html("");
        $("#btn_State_Group").append(btn_template.replace("{1}", "-1").replace("{2}", "全部"));
        for (var bi = -2; bi < 14; bi++) {
            if (bi == -2) {
                $("#btn_State_Group").append(btn_template_check.replace("{1}", "-2").replace("{2}", "新订单"));
            }
            if (bi == -1) {
                
            }
            if (bi == 0) {
                $("#btn_State_Group").append(btn_template.replace("{1}", "-3").replace("{2}", "已完成"));
            }
            if (bi == 1) {
                $("#btn_State_Group").append(btn_template.replace("{1}", "0").replace("{2}", "待派单"));
            }
            if (bi == 2) {
                $("#btn_State_Group").append(btn_template.replace("{1}", "2").replace("{2}", "配送中"));
            }
            if (bi > 8 &&  bi < 11) {
                $("#btn_State_Group").append(btn_template.replace("{1}", bi).replace("{2}", _Init.getState(bi)));
            }
            if (bi == 11) {
                $("#btn_State_Group").append(btn_template.replace("{1}", "11").replace("{2}", "未支付"));
            }
            if (bi == 12) {
                $("#btn_State_Group").append(btn_template.replace("{1}", "12").replace("{2}", "未回款"));
            }
            if (bi == 13) {
                $("#btn_State_Group").append(btn_template.replace("{1}", "13").replace("{2}", "团购"));
            }
        }
        $("#btn_State_Group").find("button").unbind().bind("click", function () {
            if ($(this).hasClass("icon-check")) {
            }
            else {
                $("#btn_State_Group").find("button").removeClass("icon-check");
                $(this).addClass("icon-check");
                _OrderList.state = $(this).val();
                if ($(this).val() == 22) {
                    $("#GetSelect").show();
                }
                else {
                    $("#GetSelect").hide();
                }
                if ($(this).val() == 7 || $(this).val() == -3 || $(this).val() == -1) {
                    if ($('#S_DateS').val().length == 0) {
                        var NowDate = new Date().pattern("yyyy-MM-dd");
                        $('#S_DateS').val(NowDate);
                    }
                }
                else {
                    $('#S_DateS').val("");
                }
                _OrderList.HideOrderInfo(1);
                //_OrderList.ShowOrderList(_OrderList.Page_Now);
                return;
            }
        });
        //END
        //初始化地址区域按钮
        btn_template = "<button class=\"button border-blue\" value=\"{1}\">{2}</button>&nbsp;";
        btn_template_check = "<button class=\"button border-blue icon-check\" value=\"{1}\">{2}</button>&nbsp;";
        var Areas = "小店|迎泽|杏花岭|万柏林|晋源|尖草坪".split("|");
        $("#btn_Area_Group").append(btn_template_check.replace("{1}", "").replace("{2}", "全部"));
        for (var a = 0; a < Areas.length; a++) {
            $("#btn_Area_Group").append(btn_template.replace("{1}", Areas[a]).replace("{2}", Areas[a]));
        }
        $("#btn_Area_Group").find("button").unbind().bind("click", function () {
            if ($(this).hasClass("icon-check")) {
            }
            else {
                $("#btn_Area_Group").find("button").removeClass("icon-check");
                $(this).addClass("icon-check");
                _OrderList.area = $(this).val();
                _OrderList.HideOrderInfo(1);
                //_OrderList.ShowOrderList(_OrderList.Page_Now);
                return;
            }
        });
        //END
        _OrderList.initEmployee();
        _OrderList.ShowOrderList(_OrderList.Page_Now);
    },
    //初始化产品修改列表
    InitProduct: function (pInfo) {
        var template = "<div class=\"input-group\" style=\"width:290px;height:35px;float:left; margin-right:15px;\"><span class=\"addon\"  style=\"font-size:16px;width:200px;\">{pName}[{price}元]</span><span class=\"addon icon-minus\" data-type=\"0\" data-id=\"{id}\" data-price=\"{price}\" title=\"product_{id}\" name=\"{price}\" style=\"font-size:16px;\"></span><input type=\"text\" class=\"input\" value=\"{3}\" style=\"height:35px;width:30px;\" id=\"product_{id}\" name=\"product_{id}\" size=\"50\" placeholder=\"0\"><span class=\"addon icon-plus\"  data-type=\"1\" data-id=\"{id}\" data-price=\"{price}\" style=\"font-size:16px;\"></span></div>";
        var tempanel = "<dl class=\"dl-inline clearfix\"><dt class=\"hj-text-title\">&nbsp;</dt><dd>{2}</dd></dl>";
        //pInfos += o.Info.lp[j].pid + "|" + o.Info.lp[j].pNum + "|" + o.Info.lp[j].pName + "|" + o.Info.lp[j].price + ",";
        var proArr = pInfo.split(",");
        $("#U_O_Product").html("");
        var tempAll = "";
        for (var i = 0; i < proArr.length; i++) {
            if (proArr[i].length > 0) {
                tempHtml = template.replace(/{id}/g, proArr[i].split("|")[0]);
                tempHtml = tempHtml.replace(/{price}/g, proArr[i].split("|")[3]);
                tempHtml = tempHtml.replace(/{pName}/g, proArr[i].split("|")[2]);
                tempHtml = tempHtml.replace("{3}", proArr[i].split("|")[1]);
                tempAll += tempHtml;
            }
        }
        $("#U_O_Product").append(tempanel.replace("{2}", tempAll));
        //计算价格
        $("#U_O_Product").find(".icon-minus").click(function () {
            _OrderList.countPrice($(this));
        });
        $("#U_O_Product").find(".icon-plus").click(function () {
            _OrderList.countPrice($(this));
        });
    },
    countPrice: function (obj) {
        var type = obj.attr("data-type");
        var price = obj.attr("data-price");
        var id = obj.attr("data-id");
        var pnum = $("#product_" + id).val();
        pnum = parseInt(pnum);
        price = parseFloat(price);
        if (type == 1) {
            pnum++;
        }
        else {
            pnum--;
        }
        if (pnum < 0) {
            pnum = 0;
        }
        $("#product_" + id).val(pnum);

        var allPrice = 0;
        $("#U_O_Product").find("dl dd div").each(function () {
            price = $(this).find(".icon-minus").attr("data-price");
            pnum = $(this).find("input").val();
            allPrice += parseInt(pnum) * parseFloat(price);
        });

        _OrderList.allPrice = allPrice;
        $("#price").val(allPrice);
        $("#U_O_AllPrice").find("dd div h1 strong").text(allPrice);
        $("#U_O_S_AllPrice").text(allPrice);
    },
    InitProduct_old: function (pInfo) {
        var products = _OrderList.products;
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
                                    _OrderList.products = products;
                                    _OrderList.OperProduct(pInfo);
                                }
                            }
                        }
                    );
        }
        else {
            _OrderList.OperProduct(pInfo);
        }
    },
    OperProduct: function (pInfo) {
        var template = "<div class=\"input-group\" style=\"width:290px;height:35px;float:left; margin-right:15px;\"><span class=\"addon\" style=\"font-size:16px;width:200px;\">{pName}[{price}元]</span><span class=\"addon icon-minus\" title=\"product_{id}\" name=\"{price}\" style=\"font-size:16px;\"></span><input type=\"text\" class=\"input\" value=\"{3}\" style=\"height:35px;width:30px;\" id=\"product_{id}\" name=\"product_{id}\" size=\"50\" placeholder=\"0\"><span class=\"addon icon-plus\" title=\"product_{id}\" name=\"{price}\" style=\"font-size:16px;\"></span></div>";
        var tempanel = "<dl class=\"dl-inline clearfix\"><dt class=\"hj-text-title\">{1}</dt><dd>{2}</dd></dl>";
        $("#U_O_Product").html("");
        var proArr = _OrderList.products.split(",");
        var tempHtml = "";
        var tempAll = "";
        var cArr = _OrderList.classInfo.split(",");
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
            _OrderList.CountSalePrice();
        });
        $("#U_O_Product").find(".icon-plus").unbind().bind("click", function () {
            var obj = $("#" + $(this).attr("title"));
            var nowNum = parseInt(obj.val());
            if (nowNum < 100) {
                nowNum = nowNum + 1;
            }
            obj.val(nowNum);
            _OrderList.CountSalePrice();
        });
    },
    //合成模板消息
    SetTMsg: function () {
        var first = $("#C_first").val();
        var last = $("#C_last").val();
        var orderNo = _OrderList.orderNo;
        var NowDate = new Date().pattern("yyyy-MM-dd HH:mm");
        $("#first_Msg").text(first);
        $("#orderNo_Msg").text("订单号：" + orderNo);
        $("#Date_Msg").text("日期：" + NowDate);
        $("#last_Msg").html(last + "<br>[山西海景航空商旅 0351-7777066]");
    },
    SelectWork: function (id,workNo, workName) {
        $("#" + id).find("button").eq(0).text(workName);
        _OrderList.workNo = workNo;
        $("#U_O_ArriveOn").click();
    },
    CountSalePrice: function () {
        var tempPrice = 0;//parseFloat(_OrderList.perPrice) * parseInt(_OrderList.shoesNum);
        $("#U_O_Product").find("div").each(function () {
            tempPrice += parseInt($(this).find(".icon-minus").attr("name")) * parseInt($(this).find("input").val());
        });
        _OrderList.allPrice = tempPrice-_OrderList.subPrice-_OrderList.wxCardFee;
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
        $("#I_Cancel").hide();
        $("#O_Submit_Update").removeAttr("disabled");
        if (isCall) {
            if (State == 2) {
                //$("#WorkerForInfo").show();
                //$("#I_ReadyGet").show();
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
                //$("#I_OrderSure").show();
                $("#WorkerForInfo").show();
                $("#I_ReadyGet").show();
            }
            else if (State == 2) {
                //$("#WorkerForInfo").show();
                //$("#I_ReadyGet").show();
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
            if (isPay == 0) {
                $("#I_CashOver").show();
            }
        }
        if (State < 9) {
            $("#I_Cancel").show();
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
				            $("#G_WorkNo").html("<option value=\"\">--全部--</option>");
				            $("#S_WorkNo").html("<option value=\"\">--全部--</option>");
				            var template = "<li><a href=\"javascript:_OrderList.SelectWork('{3}', '{2}', '{name}');\">{name}</a></li>";
				            var tempHtml = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var ci = o.List[i];
				                _OrderList.employeeS += ci.name + "|" + ci.workNo + "|" + ci.tel + "|" + ci.isService + ",";
				                if (ci.isService == 1) {
				                    $("#btn_Employee_Group").append(btn_template.replace("{1}", ci.workNo).replace("{2}", ci.name));
				                    tempHtml = template.replace(/{name}/g, ci.name);
				                    tempHtml = tempHtml.replace("{2}", ci.workNo);
				                    $("#WorkerForInfo").find("ul").append(tempHtml.replace("{3}", "WorkerForInfo"));
				                    $("#WorkerForList").find("ul").append(tempHtml.replace("{3}", "WorkerForList"));
				                    $("#G_WorkNo").append("<option value=\"" + ci.workNo + "\">" + ci.name + "</option>");
				                    $("#S_WorkNo").append("<option value=\"" + ci.workNo + "\">" + ci.name + "</option>");
				                }
				            }

				            $("#btn_Employee_Group").find("button").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_Employee_Group").find("button").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _OrderList.selectNo = $(this).val();
				                    _OrderList.HideOrderInfo(1);
				                    //_OrderList.ShowOrderList(_OrderList.Page_Now);
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
        var einfo = _OrderList.employeeS;
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
        $("#btn_UpdatePrice").unbind().bind("click", _OrderList.UpdatePrice);
        $("#isUpdateProduct").removeClass().addClass("icon-square-o");
        $("#U_O_Product").hide();
        _OrderList.isUpdateProduct = 0;
        var htmlHead = "<tr><th width=\"150\">用户</th><th width=\"150\">工号</th><th width=\"150\">时间</th><th>内容</th></tr>";
        var template = "<tr><td>{3}</td><td>{4}</td><td>{1}</td><td>{2}</td></tr>";
        _OrderList.orderNo = orderNo;
        _OrderList.getWorkNo = "";
        _OrderList.sendWorkNo = "";
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
				                _OrderList.shoesNum = o.Info.shoesNum;
				                _OrderList.getTime = o.Info.getTime;
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
				                _OrderList.oType = o.Info.oType;
				                _OrderList.price = o.Info.allPrice;
				                _OrderList.allPrice = o.Info.allPrice;
				                _OrderList.subPrice = o.Info.subPrice;
				                _OrderList.wxCardFee = o.Info.wxCardFee;
				                $("#price").val(o.Info.allPrice);
				                $("#U_O_S_AllPrice").text(o.Info.allPrice);
				                $("#U_O_S_SubPrice").text(o.Info.subPrice);
				                $("#U_O_S_WxCardFee").text(o.Info.wxCardFee);
				                $("#U_O_AllPrice").find("dd div h1 strong").text(o.Info.allPrice);
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
				                $("#O_State").find("dd").html(_Init.getState(o.Info.state));
				                $("#P_OrderNo").html(o.Info.orderNo + "&nbsp;&nbsp;&nbsp;取送编号：" + o.Info.id);
				                var pInfo = "";
				                var pInfos = ",";
				                if (o.Info.lp != null) {
				                    for (var j = 0; j < o.Info.lp.length; j++) {
				                        pInfo += o.Info.lp[j].pName + "&nbsp;<span class=\"badge bg-red-light\">" + o.Info.lp[j].pNum + "x" + o.Info.lp[j].price + " </span>";
				                        pInfos += o.Info.lp[j].pid + "|" + o.Info.lp[j].pNum + "|" + o.Info.lp[j].pName + "|" + o.Info.lp[j].price + ",";
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
				                try{
				                    $("#O_Flower").find("dd").html(o.Info.user.flower.fName);
				                }
				                catch (e) {
				                    $("#O_Flower").find("dd").html("个人用户");
				                }
				                $("#O_Contact").find("dd").html(o.Info.contact + "&nbsp;");
				                if (o.Info.userId != null) {
				                    _OrderList.userId = o.Info.userId;
				                }
				                $("#O_Tel").find("dd").html(o.Info.tel);
				                if (o.Info.addr.length > 0) {
				                    $("#O_Addr").find("dd").html(o.Info.addr.toString().replace("^",""));
				                }
				                if (o.Info.memo.length > 0) {
				                    $("#O_Memo").find("dd").html(o.Info.memo);
				                }
				                if (o.Info.getWorker != null && o.Info.getWorker.toString().length > 0) {
				                    $("#O_GetWorker").find("dd").html(_OrderList.GetEmployee(o.Info.getWorker));
				                    _OrderList.getWorkNo = o.Info.getWorker;
				                    if (o.Info.state == 3) {
				                        var eArr = _OrderList.employeeS.split(",");
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
				                                _OrderList.getWorkNo = $(this).val();
				                            }
				                        });
				                    }
				                    else {
				                        $("#U_O_GetWorker").find("dd").html(o.Info.getWorkerName);
				                    }
				                }
				                if (o.Info.sendWorker != null && o.Info.sendWorker.toString().length>0) {
				                    $("#O_SendWorker").find("dd").html(_OrderList.GetEmployee(o.Info.sendWorker));
				                    _OrderList.sendWorkNo = o.Info.sendWorker;
				                    if (o.Info.state == 6) {
				                        var eArr = _OrderList.employeeS.split(",");
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
				                                _OrderList.sendWorkNo = $(this).val();
				                            }
				                        });
				                    }
				                    else {
				                        $("#U_O_SendWorker").find("dd").html(o.Info.sendWorkerName);
				                    }

				                }
				                //产品信息
				                //$("#O_ShoesNum").find("dd").html(o.Info.shoesNum + "双");

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
				                _OrderList.operShow(o.Info.state,o.Info.uid==0,o.Info.isPay,o.Info.payType);
				                $("#tab-Li-Info").removeClass("hidden").addClass("active");
				                $("#tab-OrderInfo").removeClass("hidden").addClass("active");
				                $("#tab-Li-List").removeClass("active");
				                $("#tab-OrderList").removeClass("active");
				                $("#panel_select").hide();
				                $("#btn_Back").unbind().bind("click", function () { _OrderList.HideOrderInfo(0); });
				                $("#btn_Close").unbind().bind("click", function () { _OrderList.HideOrderInfo(1); });
				                //图片显示
				                _OrderList.deleteImg = "";
				                $("#ImgList").find("img").unbind().bind("click", function () {
				                    var src = $(this).attr("src");
				                    $("#ShowBig_pic").attr("src", src);
				                    _OrderList.deleteImg = $(this).attr("title");
				                    $showdialogs($(this));
				                });
				                $("#ImgList_Over").find("img").unbind().bind("click", function () {
				                    var src = $(this).attr("src");
				                    $("#ShowBig_pic").attr("src", src);
				                    _OrderList.deleteImg = $(this).attr("title");
				                    $showdialogs($(this));
				                });
				                _OrderList.InitProduct(pInfos);
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
        _OrderList.orderNo = orderNo;
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
        _OrderList.action = 9;
        _OrderList.AddLog();
    },
    OverOrder: function () {
        _OrderList.action = 8;
        _OrderList.AddLog();
    },
    CallUser: function () {
        _OrderList.action = 100;
        _OrderList.AddLog();
    },
    RepeatFix: function () {
        _OrderList.action = 99;
        _OrderList.AddLog();
    },
    OverCash: function () {
        _OrderList.action = 101;
        _OrderList.AddLog();
    },
    SendTMsg: function () {
        if (!confirm("确定要发送模板消息！")) {
            return false;
        }
        var first = $("#C_first").val();
        var last = $("#C_last").val();
        var orderNo = _OrderList.orderNo;
        var uid = _OrderList.userId;
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
				                _OrderList.ShowLog(orderNo);
				            }
				        }
				    }
		    );
    },
    AddLog: function () {
        var content = $("#content").val();
        if (content.length == 0 && _OrderList.action != 101) {
            alert("内容不能为空");
            return false;
        }
        $.ajax(
				    { url: _Init.ServerUrl,
				        context: document.body,
				        dataType: "json",
				        cache: false,
				        data: { fn: 25, action: _OrderList.action, orderNo: _OrderList.orderNo, content: escape(content), t: new Date() },
				        success: function (o) {
				            if (o.Return == 0) {
				                $("#content").val("");
				                if (_OrderList.action > 0) {
				                    alert("处理完成");
				                    _OrderList.ShowOrderInfo(_OrderList.orderNo);
				                    //_OrderList.HideOrderInfo(1);
				                    //_OrderList.ShowOrderList(_OrderList.Page_Now);
				                }
				                else {
				                    _OrderList.ShowOrderInfo(_OrderList.orderNo);
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
				        data: { fn: 5, orderNo: _OrderList.orderNo, t: new Date() },
				        success: function (o) {
				            alert(o.Msg);
				            if (o.Return == 0) {
				                _OrderList.ShowOrderInfo(_OrderList.orderNo);
				            }
				        }
				    }
		    );
    },
    DeleteImg: function () {
        if (!confirm("确定要删除改图片吗！")) {
            return false;
        }
        if (_OrderList.deleteImg.length == 0) {
            return false;
        }
        $.ajax(
				    {
				        url: _Init.ServerUrl,
				        context: document.body,
				        dataType: "json",
				        cache: false,
				        data: { fn: 38, deleteImg: _OrderList.deleteImg, t: new Date() },
				        success: function (o) {
				            alert(o.Msg);
				            if (o.Return == 0) {
				                _OrderList.ShowOrderInfo(_OrderList.orderNo);
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
            _OrderList.orderNo = orders;
            _OrderList.OrderSure();
        }
        else {
            alert("请选择要处理的订单");
        }
    },
    OrderSure: function () {
        if (_OrderList.state == 2) {
            if (_OrderList.workNo.length == 0) {
                alert("请选择配送员");
                return;
            }
        }
        $("#" + _OrderList.btnID).attr("disabled", "disabled");
        $.ajax(
				    {
				        url: _Init.ServerUrl,
				        context: document.body,
				        dataType: "json",
				        cache: false,
				        data: { fn: 3, workNo:_OrderList.workNo,state: _OrderList.state, orderNo: _OrderList.orderNo, submitCheck: escape(_Init.Title), t: new Date() },
				        success: function (o) {
				            alert(o.Msg);
				            if (o.Return == 0) {
				                _OrderList.workNo = "";
				                $("#WorkerForList").find("button").eq(0).text("配送员");
				                $("#WorkerForInfo").find("button").eq(0).text("配送员");
				                if (_OrderList.orderNo.indexOf(",") > -1) {
				                    _OrderList.ShowOrderList(_OrderList.Page_Now);
				                }
				                else {
				                    _OrderList.ShowOrderInfo(_OrderList.orderNo);
				                }				                
				            }
				            $("#" + _OrderList.btnID).removeAttr("disabled");
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
        $("#panel_select").show();
        _OrderList.ShowOrderList(_OrderList.Page_Now);
    },
    UpdateOrder: function () {
        var orderNo = _OrderList.orderNo;
        //产品信息
        var productId = 1;
        var price = $("#price").val();
        //用户信息
        var tel = $("#tel").val();
        var contact = $("#contact").val();
        var addr = $("#addr").val();
        var memo = $("#memo").val();
        var hour = $("#Hour").val();
        var shopping = "";
        var isUpdateProduct = _OrderList.isUpdateProduct;
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
				    data: { fn: 2, isUpdateProduct:isUpdateProduct,shopping: shopping, sendWorkNo: _OrderList.sendWorkNo, getWorkNo: _OrderList.getWorkNo, serviceId: _OrderList.serviceId, orderNo: orderNo, shoesNum: _OrderList.shoesNum, getTime: escape(_OrderList.getTime), hour: hour, serviceId: _OrderList.serviceId, memo: escape(memo), addr: escape(addr), contact: escape(contact), tel: tel, price: price, subPrice: _OrderList.subPrice, wxCardFee: _OrderList.wxCardFee, productId: productId, submitCheck: escape(_Init.Title), t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            $("#isUpdateProduct").removeClass().addClass("icon-square-o");
				            $("#U_O_Product").hide();
				            _OrderList.ShowOrderInfo(_OrderList.orderNo);
				            _OrderList.cancelUpdate();
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
        _OrderList.ShowOrderList(page);
    },
    ShowOrderList: function (page) {
        _OrderList.Page_Now = page;
        var htmlHead = "<tr><th>编号</th><th>时间</th><th width=\"300\">用户</th><th>产品详情</th><th>配送详情</th><th>总价</th><th>回访</th><th>状态</th><th width=\"80\">操作</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td {3c}>{3}</td><td>{4}</td><td>{9}</td><td>{5}</td><td>{6}</td><td>{7}</td><td>{8}</td></tr>";
        var template_hz = "<tr class=\"{c}\"><td></td><td></td><td></td><td>{3}</td><td></td><td>{5}</td><td></td><td>{7}</td><td></td></tr>";
        var htmlHead_box = "<tr><th style=\"width:45px;\"><span id=\"checkAll\" class=\"icon-square-o\" style=\"font-size:20px;\"></span></th><th>订单号</th><th>下单时间</th><th>用户详情</th><th>产品详情</th><th>配送详情</th><th>总价</th><th>回访</th><th>状态</th><th>操作</th></tr>";
        var template_box = "<tr class=\"{c}\"><td><span name=\"checkItem\" class=\"icon-square-o\" style=\"font-size:20px;\" title=\"{no}\"></span></td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{9}</td><td>{5}</td><td>{6}</td><td>{7}</td><td>{8}</td></tr>";
        var template_hz_box = "<tr class=\"{c}\"><td>汇总</td><td></td><td></td><td></td><td>{3}</td><td></td><td>{5}</td><td></td><td></td><td></td></tr>";
        var btnTemplate = "<button class=\"button button-small bg-main\" onclick=\"_OrderList.ShowOrderInfo('{no}');\">详情</button>";
        var DateS = $("#S_DateS").val();
        var DateE = $("#S_DateE").val();
        var Mobile = $("#S_Mobile").val();
        var Contact = $("#S_Contact").val();
        var OrderNo = "";//$("#S_OrderNo").val();
        var State = _OrderList.state; //$("#S_State").val();
        var sworkNo = $("#S_WorkNo").val();
        var gworkNo = $("#G_WorkNo").val();
        var getDate = $("#Q_DateS").val();
        var getTime = $("#S_GetTime").val();
        var isPay = $("#S_isPay").val();
        var payType = $("#S_payType").val();
        var sourceId = $("#S_SourceId").val();
        var serviceId = $("#S_serviceId").val();
        var id = $("#S_ID").val();
        var fid = $("#F_ID").val();
        $("#OrderList").html("<span class=\"icon-refresh rotate\"></span>");
        $("#PagePanel").hide();
        $.ajax(
				{ url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 22,fid:fid, serviceId:serviceId,sourceId: sourceId, selectNo: _OrderList.selectNo, area: _OrderList.area, payType: payType, isPay: isPay, id: id, getTime: getTime, getDate: getDate, gworkNo: gworkNo, sworkNo: sworkNo, State: State, OrderNo: OrderNo, Contact: escape(Contact), Mobile: Mobile, DateE: DateE, DateS: DateS, page: page, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#MoreOper").hide();
				            //if (State == 4 || State == 5 || State == 2 || State == -4) {
				            if (State == 0 || State == 2 || State == 12) {
				                $("#SendEnd").hide();
				                $("#SendOver").hide();
				                $("#SureOver").hide();
				                $("#WashOver").hide();
				                if (State == 0) {
				                    $("#WorkerForList").show();
				                    $("#SendOver").removeAttr("disabled");
				                    $("#SendOver").show();
				                }
				                else {
				                    $("#WorkerForList").hide();
				                    if (State == 2) {
				                        $("#SendEnd").show();
				                        $("#SendEnd").removeAttr("disabled");
				                    }
				                    else {
				                        $("#WashOver").show();
				                        $("#WashOver").removeAttr("disabled");
				                    }
				                }
				                template = template_box;
				                template_hz = template_hz_box;
				                htmlHead = htmlHead_box;
				                $("#MoreOper").show();
				            }
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
				            var sourceName = "";
				            var tuanInfo = "";
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                sourceName = "";
				                if (oi.sourceName.length > 0) {
				                    sourceName = "<span class=\"badge bg-blue-light\">" + oi.sourceName + "</span>";
				                }
				                tuanInfo = "";
				                if (oi.oType == 2) {
				                    tuanInfo = "<span style=\"color:red;\">团购</span>";
				                }
				                tempHtml = template.replace("{1}", oi.id.toString() + "<br/>" + tuanInfo + "<br/>" + sourceName);
				                if (oi.state == 7 || oi.state == 8) {
				                    //tempHtml = tempHtml.replace("{2}", "<span class=\"badge bg-blue-light\">下单</span>" + new Date(oi.addOn).pattern("MM-dd HH:mm") + "<br>" + "<span class=\"badge bg-red-light\">完成</span>" + new Date(oi.sendOn).pattern("MM-dd HH:mm") + "<br>" + oi.oType.toString().replace("0", "&nbsp;<span class=\"tag bg-mix\">微信下单</span>").replace("1", "&nbsp;<span class=\"tag bg-gray\">电话下单</span>"));
				                    tempHtml = tempHtml.replace("{2}", "<span class=\"badge bg-blue-light\">下单</span>" + new Date(oi.addOn).pattern("MM-dd HH:mm") + "<br>" + "<span class=\"badge bg-red-light\">完成</span>" + new Date(oi.sendOn).pattern("MM-dd HH:mm"));
				                }
				                else {
				                    //tempHtml = tempHtml.replace("{2}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm") + "<br>" + oi.oType.toString().replace("0", "<span class=\"tag bg-mix\">微信下单</span>").replace("1", "<span class=\"tag bg-gray\">电话下单</span>"));
				                    tempHtml = tempHtml.replace("{2}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				                }
				                var addrInfo = oi.addr;
				                if (oi.addr.indexOf("^") != -1) {
				                    addrInfo = oi.addr.split("^")[0] + "<br>" + oi.addr.split("^")[1];
				                }
				                try{
				                    tempHtml = tempHtml.replace("{3}", oi.user.flower.fName + "&nbsp;[编号:" + oi.user.flower.id + "]<br/>" + oi.contact + "[" + oi.tel + "]&nbsp;<br/>" + addrInfo + "<br/>备注：" + oi.memo);
				                }
				                catch(e){
				                    tempHtml = tempHtml.replace("{3}", oi.contact + "[" + oi.tel + "]&nbsp;<br/>" + addrInfo + "<br/>备注：" + oi.memo);
				                }
				                
				                //tempHtml = tempHtml.replace("{3c}", "onclick=\"_UserInfo.uid=" + oi.userId + ";_UserInfo.showUserInfo();\"");
				                tempHtml = tempHtml.replace("{3c}", "");
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
				                if (oi.sendDate != null && oi.state > 1 && oi.state < 9) {
				                    pInfo += "送件：" + new Date(oi.sendDate).pattern("MM月dd日");
				                }
				                tempHtml = tempHtml.replace("{4}", pInfo);
				                //var getInfo = "取：--";
				                var sendInfo = "送：--";
				                if (oi.sendWorker.length > 0) {
				                    sendInfo = "送：" + oi.sendWorkerName + "[" + oi.sendWorkerTel + "]";
				                }
				                payType = "微信";
				                if (oi.payType.toString() == "2") {
				                    payType = "余额";
				                }
				                if (oi.payType.toString() == "1") {
				                    payType = "现金";
				                }
				                //tempHtml = tempHtml.replace("{9}", getInfo + sendInfo);
				                tempHtml = tempHtml.replace("{9}", sendInfo);
				                //tempHtml = tempHtml.replace("{5}", oi.allPrice.toString() + "<br>代金券：" + oi.subPrice.toString() + "<br>微信卡券：" + oi.wxCardFee.toString() + "<br>实付款：" + oi.price.toString());
				                tempHtml = tempHtml.replace("{5}", oi.allPrice.toString());
				                tempHtml = tempHtml.replace("{6}", oi.isCall.toString().replace("0", "否").replace("1", "--"));
				                //tempHtml = tempHtml.replace("{7}", _Init.getState(oi.state.toString()) + "<br>" + oi.isPay.toString().replace("1", "<span class=\"badge bg-red-light\">已" + payType + "支付</span>").replace("0", "<span class=\"badge bg-green-light\">未支付</span>"));
				                tempHtml = tempHtml.replace("{7}", _Init.getState(oi.state.toString()));
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
				            //tempHtml = template_hz.replace("{5}", allPrice_hz.toFixed(2) + "<br>代金券：" + subPrice_hz.toFixed(2) + "<br>微信卡券：" + wxCardFee_hz.toFixed(2) + "<br>实付款：" + Price_hz.toFixed(2));
				            tempHtml = template_hz.replace("{5}", allPrice_hz.toFixed(2));
				            tempHtml = tempHtml.replace("{7}", "未支付：" + Price_Wf_hz.toFixed(2) + "<br>实收：" + (allPrice_hz - subPrice_hz - wxCardFee_hz - Price_Wf_hz).toFixed(1));
				            tempHtml = tempHtml.replace("{3}", shoes + "件");
				            $("#OrderList").append(tempHtml);
				            _Init.ShowPage(page, o.Msg, "_OrderList", _OrderList.Default_Page_Size);
				            //_OrderList.ShowPage(page, o.Msg);

				            $("#checkAll").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-square-o")) {
				                    $(this).removeClass().addClass("icon-check-square-o");
				                    $("span[name='checkItem']").removeClass().addClass("icon-check-square-o");
				                }
				                else {
				                    $(this).removeClass().addClass("icon-square-o");
				                    $("span[name='checkItem']").removeClass().addClass("icon-square-o");
				                }
				            });
				            $("span[name='checkItem']").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-square-o")) {
				                    $(this).removeClass().addClass("icon-check-square-o");
				                }
				                else {
				                    $(this).removeClass().addClass("icon-square-o");
				                }
				            });
				        }
				        else {
				            $("#OrderList").html("无记录");
				            $("#PagePanel").hide();
				        }
				    }
				}
		);
    }
}
