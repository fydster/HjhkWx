var _UserInfo = {
    uid: 0,
    init: function () {
        $("#btn_Close_UserInfo").unbind().bind("click", function () {
            _UserInfo.hideUserInfo();
        });
        $("#tab-UserInfo").find("ul li").unbind().bind("click", function () {
            $("#tab-UserInfo").find("ul li a").removeClass("icon-check-circle");
            $(this).find("a").addClass("icon-check-circle");
            $("#B_Info_S").find("div").removeClass("hidden").addClass("hidden");
            $($(this).attr("data-target")).removeClass("hidden");
            _UserInfo.initShow($(this).attr("data-target"));
        });
        $("#btn_SetGJ").click(_UserInfo.SetGJ);
    },
    hideUserInfo: function () {
        $("#tab-UserInfo").removeClass("active").addClass("hidden");
        $("#tab-Li-UserInfo").removeClass("active").addClass("hidden");
        $("#tab-Li-List").removeClass("hidden").addClass("active");
        $("#tab-OrderList").removeClass("hidden").addClass("active");
    },
    showUserInfo: function () {
        $("#tab-UserInfo").removeClass("hidden").addClass("active");
        $("#tab-Li-UserInfo").removeClass("hidden").addClass("active");
        $("#tab-Li-List").removeClass("active");
        $("#tab-OrderList").removeClass("active");
        //清理
        $("#OrderList_U").html("");
        $("#BalanceList_U").html("");
        $("#VoucherList_U").html("");
        $("#tab-UserInfo").find("ul li a").removeClass("icon-check-circle");
        $("#tab-UserInfo").find("ul li").eq(0).find("a").removeClass("icon-check-circle");
        $("#B_Info_S").find("div").removeClass("hidden").addClass("hidden");
        $("#B_Info1").removeClass("hidden");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 33, uid: _UserInfo.uid, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var oi = o.Info;
				            $("#O_NickName").val(oi.nickName + " [" + _UserInfo.uid + "]");
				            $("#O_Contact_U").val(oi.contact);
				            $("#O_Mobile").val(oi.mobile);
				            $("#O_Sex").val(oi.sex.toString().replace("1", "男").replace("2", "女"));
				            $("#O_Area").val(oi.area);
				            $("#O_AddOn").val(new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				            $("#O_Balance").val(oi.balance);
				            $("#O_PhotoUrl").attr("src", oi.photoUrl);
				            $("#B_Info1").find("div").removeClass("hidden");
				            _UserInfo.getUserAll();
				        }
				        else {
				            
				        }
				    }
				}
		);
    },
    showOrderList: function () {
        var htmlHead = "<tr><th>编号</th><th>时间</th><th width=\"300\">用户详情</th><th>产品详情</th><th>配送详情</th><th>总价</th><th>回访</th><th>状态</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{9}</td><td>{5}</td><td>{6}</td><td>{7}</td></tr>";
        var template_hz = "<tr class=\"{c}\"><td></td><td></td><td></td><td>{3}</td><td></td><td>{5}</td><td></td><td></td></tr>";
        $("#OrderList_U").html("<span class=\"icon-refresh rotate\"></span>");
        $.ajax(
				{ url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 32,uid:_UserInfo.uid, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#OrderList_U").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            var allPrice_hz = 0;
				            var Price_hz = 0;
				            var subPrice_hz = 0;
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
				                tempHtml = tempHtml.replace("{3}", oi.contact + "[" + oi.tel + "]<br/>" + addrInfo);
				                var pInfo = "";
				                var activeName = "";
				                if (oi.activeName != null) {
				                    activeName = "&nbsp;<span class=\"badge bg-blue-light\">" + oi.activeName + " </span>";
				                }
				                if (oi.lp != null) {
				                    for (var j = 0; j < oi.lp.length; j++) {
				                        shoes += parseInt(oi.lp[j].pNum);
				                        pInfo += oi.lp[j].pName + "&nbsp;<span class=\"badge bg-red-light\">" + oi.lp[j].pNum + " 双</span>" + activeName + "<br/>";
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
				                tempHtml = tempHtml.replace("{7}", _Init.getState(oi.state.toString()) + "<br>" + oi.isPay.toString().replace("1", "<span class=\"badge bg-red-light\">已" + payType + "支付</span>").replace("0", "<span class=\"badge bg-green-light\">未支付</span>"));
				                tempHtml = tempHtml.replace("{c}", cName);
				                tempHtml = tempHtml.replace(/{no}/g, oi.orderNo);
				                $("#OrderList_U").append(tempHtml);
				                allPrice_hz += parseFloat(oi.allPrice);
				                Price_hz += parseFloat(oi.price);
				                subPrice_hz += parseFloat(oi.subPrice);
				            }
				            tempHtml = template_hz.replace("{5}", allPrice_hz.toFixed(2) + "<br>代金券：" + subPrice_hz.toFixed(2) + "<br>实付款：" + Price_hz.toFixed(2));
				            tempHtml = tempHtml.replace("{3}", shoes + "双");
				            $("#OrderList_U").append(tempHtml);
				        }
				        else {
				            $("#OrderList_U").html("无记录");
				        }
				    }
				}
		);
    },
    showBalanceList: function () {
        var htmlHead = "<tr><th width=\"160\">时间</th><th width=\"50\">类型</th><th width=\"200\">描述</th><th width=\"70\">金额</th><th width=\"70\">赠送</th><th width=\"70\">状态</th></tr>";
        var template = "<tr class=\"{c}\"><td>{3}</td><td>{4}</td><td>{1}</td><td>{5}</td><td>{6}</td><td>{7}</td></tr>";
        $.ajax(
                {
                    url: _Init.ServerUrl,
                    context: document.body,
                    dataType: "json",
                    cache: false,
                    data: { fn: 17, uid:_UserInfo.uid, t: new Date() },
                    success: function (o) {
                        if (o.Return == 0) {
                            $("#BalanceList_U").html(htmlHead);
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
                                if (oi.bType == 0 && oi.enable == 1) {
                                    balance += oi.balance;
                                    aBalance += oi.aBalance;
                                }
                                if (oi.bType == 1 && oi.enable == 0) {
                                    sBalance += oi.balance;
                                }
                                tempHtml = tempHtml.replace("{7}", enable);
                                tempHtml = tempHtml.replace("{c}", cName);
                                $("#BalanceList_U").append(tempHtml);
                            }
                            tempHtml = template.replace("{1}", "");
                            tempHtml = tempHtml.replace("{2}", "");
                            tempHtml = tempHtml.replace("{3}", "汇总");
                            tempHtml = tempHtml.replace("{4}", "");
                            tempHtml = tempHtml.replace("{5}", "充值：" + balance);
                            tempHtml = tempHtml.replace("{6}", "赠送：" + aBalance);
                            tempHtml = tempHtml.replace("{7}", "消费：" + sBalance);
                            $("#BalanceList_U").append(tempHtml);
                        }
                        else {
                            $("#BalanceList_U").html("无记录");
                        }
                    }
                }
        );
    },
    getUserAll: function () {
        var template = "<li><span class=\"float-left\">{2}</span>&nbsp;&nbsp;{1}</li>";
        $.ajax(
                {
                    url: _Init.ServerUrl,
                    context: document.body,
                    dataType: "json",
                    cache: false,
                    data: { fn: 44, uid: _UserInfo.uid, t: new Date() },
                    success: function (o) {
                        if (o.Return == 0) {
                            $("#UserAll").html("");
                            var tempHtml = "";
                            var cName = "current";
                            var info = "";
                            for (var i = 0; i < o.List.length; i++) {
                                cName = "current";
                                if (i % 2 == 1) {
                                    cName = "blue";
                                }
                                var oi = o.List[i];
                                info = oi.iType.toString().replace("1", "用户注册").replace("2", "新增订单").replace("3", "领代金券").replace("4", "余额充值").replace("5", "推荐有礼");
                                if (oi.iType == 4 && oi.state == 1) {
                                    info = "余额消费";
                                }
                                if (oi.iType == 2) {
                                    info += "&nbsp;&nbsp;[" + _Init.getState(oi.state) + "]";
                                }
                                if (oi.iType == 5) {
                                    info += "&nbsp;&nbsp;[分享成功]";
                                }
                                tempHtml = template.replace("{1}", info);
                                tempHtml = tempHtml.replace("{2}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
                                $("#UserAll").append(tempHtml);
                            }
                        }
                        else {
                            $("#UserAll").html("无记录");
                        }
                    }
                }
        );
    },
    showVoucherList: function () {
        var htmlHead = "<tr><th width=\"120\">获取时间</th><th width=\"50\">类型</th><th width=\"200\">面值</th><th width=\"70\">实际使用金额</th><th width=\"120\">使用时间</th><th width=\"70\">来源</th><th width=\"70\">状态</th></tr>";
        var template = "<tr class=\"{c}\"><td>{3}</td><td>{4}</td><td>{2}</td><td>{5}</td><td>{8}</td><td>{6}</td><td>{7}</td></tr>";
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 16, uid:_UserInfo.uid, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#VoucherList_U").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            var enable = "";
				            var voucherFee = 0;
				            var useFee = 0;
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                voucherFee += parseInt(oi.voucherFee);
				                useFee += parseFloat(oi.useFee);
				                tempHtml = template.replace("{2}", oi.voucherFee);
				                tempHtml = tempHtml.replace("{3}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{4}", _UserInfo.getVoucherName(oi.voucherType));
				                tempHtml = tempHtml.replace("{5}", oi.useFee);
				                tempHtml = tempHtml.replace("{6}", oi.srcUserName == null ? "" : oi.srcUserName);
				                enable = "未用";
				                if (oi.enable == 1) {
				                    enable = "<span class=\"badge bg-green-light\">已用</span>";
				                    tempHtml = tempHtml.replace("{8}", new Date(oi.useOn).pattern("yyyy-MM-dd HH:mm"));
				                }
				                else {
				                    tempHtml = tempHtml.replace("{8}", "");
				                }
				                tempHtml = tempHtml.replace("{7}", enable);
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#VoucherList_U").append(tempHtml);
				            }
				            tempHtml = template.replace("{1}", "");
				            tempHtml = tempHtml.replace("{2}", voucherFee);
				            tempHtml = tempHtml.replace("{3}", "汇总");
				            tempHtml = tempHtml.replace("{4}", "");
				            tempHtml = tempHtml.replace("{5}", useFee);
				            tempHtml = tempHtml.replace("{6}", "");
				            tempHtml = tempHtml.replace("{7}", "");
				            tempHtml = tempHtml.replace("{8}", "");
				            $("#VoucherList_U").append(tempHtml);
				        }
				        else {
				            $("#VoucherList_U").html("无记录");
				        }
				    }
				}
		);
    },
    SetGJ: function () {
        if (!confirm("确定要设置为小区管家吗！")) {
            return;
        }
        var mobile = $("#O_Mobile").val();
        if (mobile.length != 11) {
            alert("手机号码必填");
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 52, uid: _UserInfo.uid,mobile:mobile, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				    }
				}
		);
    },
    getVoucherName: function (voucherType) {
        var vName = "<span class=\"badge bg-red-light\">代金券</span>";
        return vName;
    },
    showUserList: function (page) {
        var htmlHead = "<tr><th>头像</th><th>注册日期</th><th>昵称</th><th>姓名</th><th>联系电话</th><th>地区</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td></tr>";
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 4, action: 1, uid: _UserInfo.uid, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#UserList_U").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", "<img class=\"tips\" src=\"" + oi.photoUrl + "\" width=40 height=40 />");
				                tempHtml = tempHtml.replace("{2}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{3}", oi.nickName);
				                tempHtml = tempHtml.replace("{4}", oi.contact);
				                tempHtml = tempHtml.replace("{5}", oi.mobile);
				                tempHtml = tempHtml.replace("{6}", oi.area);
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#UserList_U").append(tempHtml);
				            }
				        }
				        else {
				            $("#UserList_U").html("无记录");
				        }
				    }
				}
		);
    },
    initShow: function (id) {
        if (id == "#B_Info1") {
            _UserInfo.showUserInfo();
        }
        if (id == "#B_Info2") {
            _UserInfo.showOrderList();
        }
        if (id == "#B_Info3") {
            _UserInfo.showBalanceList(id);
        }
        if (id == "#B_Info4") {
            _UserInfo.showVoucherList(id);
        }
        if (id == "#B_Info5") {
            _UserInfo.showUserList(id);
        }
    }
}