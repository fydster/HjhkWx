var _List = {
    isOpenInfo: 0,
    no: "",
    type: 5,
    exOpenID: "",
    Init: function () {
        if (_U.mobile.length == 0) {
            var user = $.cookie("_UserInfo");
            if (user != null) {
                _U = JSON.parse(user);
            }
            if (_U.mobile.length == 0) {
                _C.RedirectUrl("c_role.html", 4, "snsapi_userinfo");
                return;
            }
        }
        if (_B.source == "0000") {
            _List.exOpenID = _U.openId;
        }
        if (_U.exOpenID == null) {
            _U.exOpenID = "";
        }
        if (_U.exOpenID.length > 0) {
            _List.exOpenID = _U.exOpenID;
        }


        _List.initLayot();
        _List.getOrder();
        _C.initWx();
        window.onpopstate = function () {
            if (_List.isOpenInfo == 1) {
                $("#my-popup").modal('close');
                _List.isOpenInfo = 2;
            }
            else if (_List.isOpenInfo == 2) {
                window.location = "c_uc.html";
            }
        }
    },
    initLayot: function () {
        $("#my-popup").find(".am-popup-inner .am-popup-hd").click(function () {
            $("#my-popup").modal('close');
            _List.isOpenInfo = 2;
        });
        $(".am-icon-home").click(function () {
            window.location = "c_index_home.html";
        });
        $("#div_tgq").find("button").click(function () {
            $("#div_tgq").find("button").removeClass("am-icon-check");
            $(this).addClass("am-icon-check");
            var type = $(this).attr("data-type");
            _List.type = type;
        });
        $("#btn_toTGQ").click(function () {
            _List.addTgq();
        });
    },
    updateState: function () {
        var getDate = "";
        if (_List.state == 1) {
            getDate = $("#input_getDate").val();
        }
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 106,uid:_U.uid,getDate:getDate,orderNo: _List.no, state: _List.state, t: new Date() },
				    success: function (o) {
				        //alert(o.Msg);
				        if (o.Return == 0) {
				            _List.getOrder();
				            $("#my-popup").modal('close');
				        }

				    }
				}
		);
    },
    addTgq: function () {
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 109, uid: _U.uid, Ask_type: _List.type, orderNo: _List.no, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#my-alert").find(".am-modal-bd").text("您已提交成功，稍后我们客户会联系您处理！");
				        }
				        else {
				            $("#my-alert").find(".am-modal-bd").text("提交失败，请稍后再试，您可以直接拨打4006660000进行相关操作！");
				        }
				        $("#my-alert").modal("open");
				        _List.getOrder();
				    }
				}
		);
    },
    getOrder: function () {
        //var template = $("#template_list").html();
        //var template_e = $("#template_evaluate").html();
        var template = $("#template_list").html();
        var obj = $("#ul_order");
        var id = $("#input_id").val();
        var date = $("#input_sdate").val();
        obj.html("<i class=\"am-icon-spinner am-icon-spin\"></i>");
        $.ajax(
                {
                    url: _C.ServerUrl,
                    context: document.body,
                    dataType: "json",
                    cache: false,
                    data: { fn: 105,uid:_U.uid, t: new Date() },
                    success: function (o) {
                        var tempHtml = "";
                        obj.html("");
                        var sName = "";
                        if (o.length > 0) {
                            for (var i = 0; i < o.length; i++) {
                                var oi = o[i];
                                var order = oi.order;
                                var fare = oi.fare;
                                var log = oi.changeLog;
                                tempHtml = template.replace("{RecordDate}", new Date(order.Record_time).pattern("yyyy-MM-dd"));
                                tempHtml = tempHtml.replace(/{addOn}/g, new Date(order.Record_time).pattern("yyyy-MM-dd HH:mm"));
                                tempHtml = tempHtml.replace("{FlihtFrom}", order.Fliht_from);
                                tempHtml = tempHtml.replace("{sPort}", "");
                                tempHtml = tempHtml.replace("{sT}", order.Fliht_T.toString().split("/")[0]);
                                tempHtml = tempHtml.replace("{FlihtTo}", order.Fliht_to);
                                tempHtml = tempHtml.replace("{tPort}", "");
                                tempHtml = tempHtml.replace("{tT}", order.Fliht_T.toString().split("/")[1]);
                                tempHtml = tempHtml.replace("{Price}", order.total_price);
                                sName = _C.getState(order.Order_state)
                                if (order.Order_state == 2 && order.ZuoHao_state > 0) {
                                    if (order.ZuoHao_state == 5) {
                                        sName = "申请退票中";
                                    }
                                    else {
                                        sName = "申请改签中";
                                    }
                                }
                                tempHtml = tempHtml.replace("{state}", sName);
                                if (order.Order_state == 2 && order.ZuoHao_state == 0) {
                                    tempHtml = tempHtml.replace("{hide}", "");
                                }
                                else {
                                    tempHtml = tempHtml.replace("{hide}", "am-hide");
                                }
                                if (order.Money_return == 0 && order.Order_state == 0) {
                                    tempHtml = tempHtml.replace("{payhide}", "");
                                }
                                else {
                                    tempHtml = tempHtml.replace("{payhide}", "am-hide");
                                }
                                tempHtml = tempHtml.replace(/{no}/g, order.Order_no);
                                if (order.Fliht_type == 2) {
                                    tempHtml = tempHtml.replace("am-icon-long-arrow-right", "am-icon-exchange");
                                }
                                fName = "";
                                var fn = 0;
                                if (fare != null) {
                                    for (var j = 0; j < fare.length; j++) {
                                        if (fn < 3) {
                                            fName += fare[j].Fare_name + ",";
                                        }
                                        fn++;
                                    }
                                }
                                if (fn > 3) {
                                    fName = fName.substring(0, fName.length - 2) + "等" + fn + "位乘客";
                                }
                                tempHtml = tempHtml.replace("{Fare}", fName);
                                obj.append(tempHtml);
                            }
                            $(".am-btn-warning").click(function () {
                                _List.isOpenInfo = 1;
                                var orderno = $(this).attr("data-no");
                                _List.getOrderInfo(orderno);
                                $("#my-popup").modal('open');
                            });

                            $(".am-btn-success").click(function () {
                                var no = $(this).attr("data-no");
                                var time = $(this).attr("data-time");
                                if (no.length > 0) {
                                    _List.no = no;
                                    var seconds = _C.dateDiff("S", new Date(time).pattern("yyyy-MM-dd HH:mm"), new Date().pattern("yyyy-MM-dd HH:mm"));
                                    if (seconds > 600) {
                                        alert("操作时间过长，航班价格可能变动，请重新选择航班。");
                                        window.location = "c_index_home.html";
                                    }
                                    else {
                                        _List.doPay(no);
                                    }

                                }
                            });

                            $(".am-btn-secondary").click(function () {
                                var orderno = $(this).attr("data-no");
                                _List.no = orderno;
                                $("#my-confirm").modal('open');
                            });
                        }
                    }
                }
        );

        obj = $("#ul_order_train");
        $.ajax(
                {
                    url: _C.TrainServerUrl,
                    context: document.body,
                    dataType: "json",
                    cache: false,
                    data: { fn: 101, uid: _U.uid, t: new Date() },
                    success: function (o) {
                        var tempHtml = "";
                        obj.html("");
                        var fName = "";
                        if (o.length > 0) {
                            for (var i = 0; i < o.length; i++) {
                                var oi = o[i];
                                var trip = oi.trip;
                                var fare = oi.fare;
                                var log = oi.log;
                                tempHtml = template.replace("{RecordDate}", new Date(oi.addOn).pattern("yyyy-MM-dd"));
                                tempHtml = tempHtml.replace("{FlihtFrom}", trip.fromCity);
                                tempHtml = tempHtml.replace("{FlihtTo}", trip.toCity);
                                tempHtml = tempHtml.replace("{Price}", oi.totalPrice);
                                for (var j = 0; j < fare.length; j++) {
                                    fName += fare[j].passengerName + ",";
                                }
                                tempHtml = tempHtml.replace("{Fare}", fName);
                                obj.append(tempHtml);
                            }
                            
                        }
                    }
                }
        );
    },
    getOrderInfo: function (no) {
        _List.no = no;
        $.ajax(
                {
                    url: _C.ServerUrl,
                    context: document.body,
                    dataType: "json",
                    cache: false,
                    data: { fn: 106,uid:_U.uid, orderNo: no, t: new Date() },
                    success: function (o) {
                        if (o != null && o.order != null) {
                            var oi = o.order;
                            $(".am-btn-block").attr("data-no", no);
                            $(".am-btn-block").attr("data-time", new Date(oi.Record_time).pattern("yyyy-MM-dd HH:mm"));
                            $(".am-btn-block").hide();
                            $(".am-popup-title").text("订单编号 [ " + oi.id + " ]");
                            var b = $("#order_div").find(".am-input-group").find("input");
                            b.val("");
                            b.eq(0).val(new Date(oi.Record_time).pattern("yyyy-MM-dd HH:mm"));
                            b.eq(1).val(_C.getState(oi.Order_state));
                            b.eq(2).val(oi.jp_total_price + "元");
                            b.eq(3).val(oi.jj_total_price + "元");
                            b.eq(4).val(oi.ry_total_price + "元");
                            b.eq(5).val(oi.bx_total_price + "元");
                            b.eq(6).val(oi.cjfbx_total_price + "元");
                            b.eq(7).val(oi.service_total_price + "元");
                            b.eq(8).val(oi.IsPass + "元");
                            b.eq(9).val(oi.total_price + "元");
                            b.eq(10).val(oi.User_tel);

                            var Fliht = $("#template_f").html();
                            Fliht = Fliht.replace(/{FlihtDate}/g, new Date(oi.Fliht_date).pattern("yy-MM-dd"));
                            Fliht = Fliht.replace(/{week}/g, _C.getWeek(new Date(oi.Fliht_date).pattern("yyyy-MM-dd")));
                            Fliht = Fliht.replace("{sTime}", new Date(oi.Fliht_date).pattern("HH:mm"));
                            Fliht = Fliht.replace("{tTime}", oi.Fliht_to_time.toString().substring(0, 2) + ":" + oi.Fliht_to_time.toString().substring(2, 4));
                            Fliht = Fliht.replace("{sFrom}", oi.Fliht_from + oi.Fliht_T.toString().split("/")[0]);
                            Fliht = Fliht.replace("{sTo}", oi.Fliht_to + oi.Fliht_T.toString().split("/")[1]);
                            Fliht = Fliht.replace("{FlihtNo}", oi.Fliht_no);
                            $("#div_fliht").html(Fliht);

                            if (oi.Fliht_type == 2) {
                                Fliht = $("#template_f").html();
                                Fliht = Fliht.replace(/{FlihtDate}/g, new Date(oi.Fliht_date_back).pattern("yy-MM-dd"));
                                Fliht = Fliht.replace(/{week}/g, _C.getWeek(new Date(oi.Fliht_date_back).pattern("yyyy-MM-dd")));
                                Fliht = Fliht.replace("{sTime}", new Date(oi.Fliht_date_back).pattern("HH:mm"));
                                Fliht = Fliht.replace("{tTime}", oi.Fliht_time_to_back.toString().substring(0, 2) + ":" + oi.Fliht_time_to_back.toString().substring(2, 4));
                                Fliht = Fliht.replace("{sFrom}", oi.Fliht_from_back + oi.Fliht_T_back.toString().split("/")[0]);
                                Fliht = Fliht.replace("{sTo}", oi.Fliht_to_back + oi.Fliht_T_back.toString().split("/")[1]);
                                Fliht = Fliht.replace("{FlihtNo}", oi.Fliht_no_back);
                                $("#div_fliht").append(Fliht);
                            }

                            if (o.fare != null) {
                                fName = "";
                                for (var j = 0; j < o.fare.length; j++) {
                                    fName += "<div>";
                                    fName += "<span>" + o.fare[j].Fare_name + "</span><em>" + o.fare[j].Fare_card + "</em> <em>" + o.fare[j].Fare_type + "</em>";
                                    if (o.fare[j].ticket_no.length > 0) {
                                        fName += "<span class=\"downList\">票号：" + o.fare[j].ticket_no + "</span>";
                                    }
                                    if (o.fare[j].ticket_no_back.length > 0) {
                                        fName += "<span class=\"downList\">票号：" + o.fare[j].ticket_no_back + "</span>";
                                    }
                                    fName += "</div>";
                                }
                                $("#div_fare").html(fName);
                            }
                            if (o.changeLog != null) {
                                $("#div_loginfo").html("");
                                var log_t = $("#log_template").html();
                                var log_s = "";
                                for (var i = 0; i < o.changeLog.length; i++) {
                                    var li = o.changeLog[i];
                                    log_s = log_t.replace(/{time}/g, new Date(li.Otime).pattern("yyyy-MM-dd HH:mm"));
                                    log_s = log_s.replace("{content}", li.Content);
                                    $("#div_loginfo").append(log_s);
                                }
                            }

                            if (oi.Order_state == 0 && oi.Money_return == 0) {
                                $("#btn_Pay").show();
                            }

                            $("#btn_Pay").click(function () {
                                var no = $(this).attr("data-no");
                                var time = $(this).attr("data-time");
                                if (no.length > 0) {
                                    var seconds = _C.dateDiff("S", new Date(time).pattern("yyyy-MM-dd HH:mm"), new Date().pattern("yyyy-MM-dd HH:mm"));
                                    if (seconds > 600) {
                                        alert("操作时间过长，航班价格可能变动，请重新选择航班。");
                                        window.location = "c_index_home.html";
                                    }
                                    else {
                                        _List.doPay(no);
                                    }
                                    
                                }
                            });

                            $("#my-popup").modal('open');
                            _List.isOpenInfo = 1;
                            var json = { time: new Date().getTime() };
                            window.history.pushState(json, "http://hjhk.edmp.cc/loading.html?action=0");
                        }
                    }
                }
        );
    },
    doPay: function () {
        $("#my-modal-loading").modal("open");
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "text",
            cache: false,
            data: { fn: 99, uid: _U.uid,openId:_List.exOpenID, orderNo:_List.no, t: new Date() },
            success: function (o) {
                $("#my-modal-loading").modal("close");
                if (o.length > 0) {
                    var os = o.split("|");
                    wx.chooseWXPay({
                        timestamp: os[4], // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: os[1], // 支付签名随机串，不长于 32 位
                        package: os[2], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                        signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: os[3], // 支付签名
                        success: function (res) {
                            // 支付成功后的回调函数
                            window.location = "c_list.html";
                        },
                        cancel: function (res) {
                            if (res.errMsg == "chooseWXPay:cancel") {
                                alert("为了给您安排，请尽快支付,如因未支付导致票价变动或者座位取消由您本人承担！");
                                window.location = "c_list.html";
                            }
                        }
                    });
                }
                else {
                    alert("该订单暂时不能支付，请稍后再试！");
                    _List.getOrder();
                }

            }
        }
        );
    }
}


_List.Init();
