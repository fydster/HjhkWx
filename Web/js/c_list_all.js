var _List = {
    isOpenInfo: 0,
    no: "",
    type: 5,
    exOpenID: "",
    oType: 0,
    Init: function () {
        $("#bottomMenu").find(".weui-flex__item").eq(0).click(function () {
            window.location = "c_home.html";
        });
        $("#bottomMenu").find(".weui-flex__item").eq(1).click(function () {
            window.location = "c_index_home.html";
        });
        $("#bottomMenu").find(".weui-flex__item").eq(3).click(function () {
            window.location = "c_uc.html";
        });
        if (_B.source == "0000") {
            _List.exOpenID = _U.openId;
        }
        if (_U.exOpenID == null) {
            _U.exOpenID = "";
        }
        if (_U.exOpenID.length > 0) {
            _List.exOpenID = _U.exOpenID;
        }

        _List.oType = _C.getParam("oType");
        if (_List.oType != null && _List.oType == 1) {
            $(".am-tabs-nav").find("li").removeClass("am-active");
            $(".am-tabs-nav").find("li").eq(1).addClass("am-active");
            $(".am-tab-panel").removeClass("am-active");
            $(".am-tab-panel").eq(1).addClass("am-active");
        }

        _List.initLayot();
        _List.getOrder();
        _C.initWx();
        window.onpopstate = function () {
            if (_List.isOpenInfo == 1) {
                $("#my-popup").modal('close');
                $("#my-popup-train").modal('close');
                _List.isOpenInfo = 2;
            }
            else if (_List.isOpenInfo == 2) {
                window.location = "c_uc.html";
            }
        }

        $(".am-topbar").find(".am-u-sm-3").eq(1).click(function () {
            _List.getOrder();
        });
    },
    initLayot: function () {
        var h = window.screen.height;
        $(".am-tabs").css("height", (h - 145) + "px");
        $("#my-popup").find(".am-popup-inner .am-popup-hd").click(function () {
            $("#my-popup").modal('close');
            _List.isOpenInfo = 2;
        });
        $("#my-popup-train").find(".am-popup-inner .am-popup-hd").click(function () {
            $("#my-popup-train").modal('close');
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
        $("#btn_Cancel_Train").click(function () {
            var no = $(this).attr("data-no");
            if (no.length > 0) {
                _List.no = no;
                weui.confirm('确定要取消订单吗！', function () { _List.trainCancelOrder(no); }, function () {  });
            }
        });

        $("#confirm_sure").click(function () {
            _List.trainCancelOrder(_List.no);
        });

        $("#cancelTuiP").click(function () {
            $("#refund_show").slideUp("fast");
        });

        $("#toTuiP").click(function () {
            var obj = document.getElementsByName("checkbox1");
            var passenger = "";
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].checked) {
                    passenger += obj[i].id + ",";
                }
            }
            if (passenger.length > 0) {
                _List.trainRefundlOrder(_List.no, passenger);
            }
            
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
    trainCancelOrder: function (no) {
        $("#toast").show();
        $.ajax(
            {
                url: _C.TrainServerUrl,
                context: document.body,
                dataType: "json",
                cache: false,
                data: { fn: 6, uid: _U.uid, orderNo: no, t: new Date() },
                success: function (o) {
                    $("#toast").hide();
                    if (o.Return == 0) {
                        $("#my-alert").find(".am-modal-bd").text("取消完成！");
                    }
                    else {
                        $("#my-alert").find(".am-modal-bd").text("取消失败，请稍后再试！");
                    }
                    $("#my-alert").modal("open");
                    _List.getTrainOrderInfo(no);
                    _List.getOrder();
                }
            }
        );
    },
    trainRefundlOrder: function (no, passengers) {
        $("#refund_show").slideUp("fast");
        $("#toast").show();
        $.ajax(
            {
                url: _C.TrainServerUrl,
                context: document.body,
                dataType: "json",
                cache: false,
                data: { fn: 7, uid: _U.uid, orderNo: no, passengerId: passengers, t: new Date() },
                success: function (o) {
                    $("#toast").hide();
                    if (o.Return == 0) {
                        $("#my-alert").find(".am-modal-bd").text("退票申请完成，请留意微信消息或查看订单详情！");
                    }
                    else {
                        $("#my-alert").find(".am-modal-bd").text("退票申请失败，请稍后再试！");
                    }
                    $("#my-alert").modal("open");
                    _List.getTrainOrderInfo(no);
                },
                error: function () {
                    $("#toast").hide();
                    $("#my-alert").find(".am-modal-bd").text("退票申请失败，请稍后再试！");
                    $("#my-alert").modal("open");
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
                    data: { fn: 105, uid: $.cookie("seascape_def_USER_ID"), t: new Date() },
                    success: function (o) {
                        var tempHtml = "";
                        obj.html("");
                        var sName = "";
                        var isH = true;
                        try{
                            if (o.Return == 1) {
                                isH = false;
                            }
                        }
                        catch(e){

                        }
                        if (isH && o.length > 0) {
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
                            obj.find(".am-btn-warning").click(function () {
                                _List.isOpenInfo = 1;
                                var orderno = $(this).attr("data-no");
                                _List.getOrderInfo(orderno);
                                $("#my-popup").modal('open');
                            });

                            obj.find(".am-btn-success").click(function () {
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

                            obj.find(".am-btn-secondary").click(function () {
                                var orderno = $(this).attr("data-no");
                                _List.no = orderno;
                                $("#my-confirm").modal('open');
                            });
                        }
                    }
                }
        );

        var obj_train = $("#ul_order_train");
        template = $("#template_list_train").html();
        obj_train.html("<i class=\"am-icon-spinner am-icon-spin\"></i>");
        $.ajax(
                {
                    url: _C.TrainServerUrl,
                    context: document.body,
                    dataType: "json",
                    cache: false,
                    data: { fn: 101, uid: _U.uid, t: new Date() },
                    success: function (o) {
                        var tempHtml = "";
                        obj_train.html("");
                        var fName = "";
                        var fareInfo = "";
                        if (o.List.length > 0) {
                            for (var i = 0; i < o.List.length; i++) {
                                fName = "";
                                var oi = o.List[i];
                                var trip = oi.trip[0];
                                var fare = oi.fare;
                                var log = oi.log;

                                tempHtml = template.replace("{RecordDate}", new Date(oi.addOn).pattern("yyyy-MM-dd"));
                                tempHtml = tempHtml.replace("{FlihtFrom}", trip.fromCity);
                                tempHtml = tempHtml.replace("{FlihtTo}", trip.toCity);
                                tempHtml = tempHtml.replace("{Price}", oi.totalPrice);
                                tempHtml = tempHtml.replace("{state}", _C.getStateForTrain(oi.state));
                                tempHtml = tempHtml.replace(/{no}/g, oi.orderNo);

                                fareInfo = "";
                                for (var j = 0; j < fare.length; j++) {
                                    fName += fare[j].passengerName + ",";
                                    fareInfo += fare[j].passengerName + "|" + fare[j].idCard + "|" + fare[j].passengerId + "|" + fare[j].seatNo + "@";
                                }
                                tempHtml = tempHtml.replace(/{fare}/g, fareInfo);
                                if (oi.state == 3) {
                                    tempHtml = tempHtml.replace("{hide}", "am-hide");
                                }
                                else {
                                    tempHtml = tempHtml.replace("{hide}", "am-hide");
                                }
                                if (oi.isPay == 0 && oi.state == 2) {
                                    tempHtml = tempHtml.replace("{payhide}", "");
                                }
                                else {
                                    tempHtml = tempHtml.replace("{payhide}", "am-hide");
                                }
                                tempHtml = tempHtml.replace("{Fare}", fName);
                                obj_train.append(tempHtml);
                            }

                            obj_train.find("li").find(".am-btn-warning").click(function () {
                                var orderNo = $(this).attr("data-no");
                                _List.getTrainOrderInfo(orderNo);
                            });

                            obj_train.find(".am-btn-success").click(function () {
                                var no = $(this).attr("data-no");
                                if (no.length > 0) {
                                    _List.no = no;
                                    _List.doPay_Train(no);
                                }
                            });
                            
                        }
                    }
                }
        );
    },
    getTrainOrderInfo: function (no) {
        var obj = $("#order_div_train");
        _List.no = no;
        $.ajax(
                {
                    url: _C.TrainServerUrl,
                    context: document.body,
                    dataType: "json",
                    cache: false,
                    data: { fn: 102,uid:_U.uid, orderNo: no, t: new Date() },
                    success: function (o) {
                        if (o != null && o.Info != null) {
                            var oi = o.Info;
                            obj.find(".am-btn-block").attr("data-no", no);
                            obj.find(".am-btn-block").hide();
                            obj.find(".am-popup-title").text("订单编号 [ " + oi.id + " ]");
                            var b = obj.find(".am-input-group").find("input");
                            b.val("");
                            b.eq(0).val(new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
                            b.eq(1).val(_C.getStateForTrain(oi.state));
                            b.eq(2).val((oi.ticketPrice + oi.insurePrice) + "元");
                            b.eq(3).val(oi.ticketPrice + "元");
                            b.eq(4).val(oi.insurePrice + "元");
                            b.eq(10).val(oi.mobile);

                            var trip = o.Info.trip[0];
                            var Fliht = $("#template_t").html();
                            Fliht = Fliht.replace(/{FlihtDate}/g, new Date(trip.tDate).pattern("yy-MM-dd"));
                            Fliht = Fliht.replace(/{week}/g, _C.getWeek(new Date(trip.tDate).pattern("yyyy-MM-dd")));
                            Fliht = Fliht.replace("{sTime}", trip.sTime);
                            Fliht = Fliht.replace("{tTime}", trip.tTime);
                            Fliht = Fliht.replace("{sFrom}", trip.fromCity);
                            Fliht = Fliht.replace("{sTo}", trip.toCity);
                            Fliht = Fliht.replace("{TrainNo}", trip.trainNo);
                            $("#div_fliht_train").html(Fliht);

                            var fare = o.Info.fare;
                            var fareInfo = "";
                            if (fare != null) {
                                fName = "";
                                for (var j = 0; j < fare.length; j++) {
                                    fName += "<div style='border-bottom:1px solid #ddd;width:100%;'>";
                                    fName += "<span>乘客：" + fare[j].passengerName + "</span> <em>" + fare[j].idCard + "</em>";
                                    if (fare[j].seatNo.length > 0) {
                                        fName += "<span class=\"downList\" style='display:block;'>座位：" + fare[j].seatNo + "</span>";
                                    }
                                    fName += "</div>";
                                    fareInfo += fare[j].passengerName + "|" + fare[j].idCard + "|" + fare[j].passengerId + "|" + fare[j].seatNo + "@";
                                }
                                $("#div_fare_train").html(fName);
                            }

                            $("#btn_Tui_Train").attr("data-fare", fareInfo);

                            var log = o.Info.log;
                            if (log != null) {
                                $("#div_loginfo_train").html("");
                                var log_t = $("#log_template").html();
                                var log_s = "";
                                for (var i = 0; i < log.length; i++) {
                                    var li = log[i];
                                    log_s = log_t.replace(/{time}/g, new Date(li.addOn).pattern("yyyy-MM-dd HH:mm"));
                                    log_s = log_s.replace("{content}", li.content);
                                    $("#div_loginfo_train").append(log_s);
                                }
                            }

                            if (oi.state > 1 && oi.state < 8 && oi.isPay == 0) {
                                $("#btn_Pay_Train").show();
                            }

                            if (oi.state == 3 && oi.isPay == 1) {
                                $("#btn_Tui_Train").show();
                            }

                            if (oi.state > 0 && oi.state < 3 && oi.isPay == 0) {
                                $("#btn_Cancel_Train").show();
                            }

                            $("#btn_Pay_Train").click(function () {
                                //alert("");
                                var no = $(this).attr("data-no");
                                var time = $(this).attr("data-time");
                                if (no.length > 0) {
                                    var seconds = _C.dateDiff("S", new Date(time).pattern("yyyy-MM-dd HH:mm"), new Date().pattern("yyyy-MM-dd HH:mm"));
                                    if (seconds > 600) {
                                        alert("操作时间过长，航班价格可能变动，请重新选择航班。");
                                        window.location = "c_index_home.html";
                                    }
                                    else {
                                        //alert(no);
                                        _List.doPay_Train(no);
                                    }
                                    
                                }
                            });

                            $("#btn_Tui_Train").click(function () {
                                var no = $(this).attr("data-no");
                                var fare = $(this).attr("data-fare");
                                if (no.length > 0) {
                                    //weui.confirm("确定要进行退票操作吗！", function () { _List.trainRefundlOrder(no); }, function () { });
                                    _List.no = no;
                                    _List.showRefundTrain(fare);
                                }
                            });

                            $("#my-popup-train").modal('open');
                            $("#my-popup-train").find(".am-popup-hd").click(function () {
                                $("#my-popup-train").modal('close');
                                _List.isOpenInfo = 2;
                            });
                            _List.isOpenInfo = 1;
                            var json = { time: new Date().getTime() };
                            window.history.pushState(json, "http://hjhk.edmp.cc/loading.html?action=0");
                        }
                    }
                }
        );
    },
    getOrderInfo: function (no) {
        var obj = $("#order_div");
        _List.no = no;
        $.ajax(
                {
                    url: _C.ServerUrl,
                    context: document.body,
                    dataType: "json",
                    cache: false,
                    data: { fn: 106, uid: _U.uid, orderNo: no, t: new Date() },
                    success: function (o) {
                        if (o != null && o.order != null) {
                            var oi = o.order;
                            obj.find(".am-btn-block").attr("data-no", no);
                            obj.find(".am-btn-block").attr("data-time", new Date(oi.Record_time).pattern("yyyy-MM-dd HH:mm"));
                            obj.find(".am-btn-block").hide();
                            obj.find(".am-popup-title").text("订单编号 [ " + oi.id + " ]");
                            var b = obj.find(".am-input-group").find("input");
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
                            $("#my-popup").find(".am-popup-hd").click(function () {
                                $("#my-popup").modal('close');
                                _List.isOpenInfo = 2;
                            });
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
    },
    doPay_Train: function (no) {
        //alert(no);
        //alert(_U.uid);
        $.ajax(
        {
            url: _C.TrainServerUrl,
            context: document.body,
            dataType: "text",
            cache: false,
            data: { fn: 5, uid: _U.uid,openId:_U.openId, orderNo: no, t: new Date() },
            success: function (o) {
                if (o.length > 0) {
                    $("#my-modal-loading").modal("close");
                    var os = o.split("|");
                    wx.chooseWXPay({
                        timestamp: os[4], // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: os[1], // 支付签名随机串，不长于 32 位
                        package: os[2], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                        signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: os[3], // 支付签名
                        success: function (res) {
                            // 支付成功后的回调函数
                            _List.getOrder();
                        },
                        cancel: function (res) {
                            if (res.errMsg == "chooseWXPay:cancel") {
                                weui.alert("为了给您安排，请尽快支付,如因未支付导致座位取消由您本人承担！", function () {
                                    //window.location = "c_list.html";
                                });
                                
                            }
                        }
                    });
                }

            }
        }
        );
    },
    showRefundTrain: function (fare) {
        var fArr = fare.split("@");
        var tempHtml = "";
        var template = $("#fx_template").html();
        $(".weui-cells_checkbox").html("");
        for (var i = 0; i < fArr.length; i++) {
            if (fArr[i].length > 0) {
                var itemA = fArr[i].split("|");
                tempHtml = template.replace(/{passengerId}/g, itemA[2]);
                tempHtml = tempHtml.replace("{name}", "checkbox1")
                tempHtml = tempHtml.replace("{fareInfo}", itemA[0] + "[" + itemA[1] + "]<br/>" + itemA[3]);
                $(".weui-cells_checkbox").append(tempHtml);
            }
        }
        $("#refund_show").slideDown("fast");
    }
}