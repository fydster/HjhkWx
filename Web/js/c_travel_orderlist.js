var _List = {
    isOpenInfo: 0,
    no: "",
    Init: function () {
        if (_U.uid == null || _U.uid == 0) {
            _C.RedirectUrl("c_role.html", 6, "snsapi_userinfo");
            return;
        }


        _List.initLayot();
        _List.getOrder();
        _C.initWx();
        window.onpopstate = function () {
            if (_List.isOpenInfo == 1) {
                $("#my-popup-train").modal('close');
                _List.isOpenInfo = 2;
            }
            else if (_List.isOpenInfo == 2) {
                window.location = "c_uc.html";
            }
        }
    },
    initLayot: function () {
        var h = window.screen.height;
        $("#my-popup-train").find(".am-popup-inner .am-popup-hd").click(function () {
            $("#my-popup-train").modal('close');
            _List.isOpenInfo = 2;
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
    trainCancelOrder: function (no,orderId) {
        if (!confirm("确定要取消订单吗！")) {
            return;
        }
        $("#toast").show();
        $.ajax(
            {
                url: "/service/travelHandler.ashx",
                context: document.body,
                dataType: "json",
                cache: false,
                data: { fn: 7, uid: _U.uid, orderId: orderId, orderNo: no, t: new Date() },
                success: function (o) {
                    $("#toast").hide();
                    if (o.errorCode == 231000) {
                        $("#my-alert").find(".am-modal-bd").text("取消完成！");
                    }
                    else {
                        $("#my-alert").find(".am-modal-bd").text("取消失败，请稍后再试！");
                    }
                    $("#my-alert").modal("open");
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
        var obj_train = $("#ul_order_train");
        var template = $("#template_list_train").html();
        obj_train.html("<i class=\"am-icon-spinner am-icon-spin\"></i>");
        $.ajax(
                {
                    url: "/service/travelHandler.ashx",
                    context: document.body,
                    dataType: "json",
                    cache: false,
                    data: { fn: 12, uid: _U.uid, t: new Date() },
                    success: function (o) {
                        var tempHtml = "";
                        obj_train.html("");
                        if (o.List.length > 0) {
                            for (var i = 0; i < o.List.length; i++) {
                                fName = "";
                                var oi = o.List[i];
                                //var log = oi.log;

                                tempHtml = template.replace("{RecordDate}", new Date(oi.addOn).pattern("yyyy-MM-dd"));
                                tempHtml = tempHtml.replace("{ticketOn}", new Date(oi.ticketOn).pattern("yyyy-MM-dd"));
                                tempHtml = tempHtml.replace("{Price}", oi.totalPrice);
                                tempHtml = tempHtml.replace("{productName}", oi.productName);
                                tempHtml = tempHtml.replace("{fareNum}", oi.fareNum);
                                tempHtml = tempHtml.replace("{state}", _C.getStateForTravel(oi.state));
                                tempHtml = tempHtml.replace(/{no}/g, oi.orderNo);
                                tempHtml = tempHtml.replace(/{orderId}/g, oi.orderId);

                                tempHtml = tempHtml.replace(/{fare}/g, oi.contact + "," + oi.mobile);
                                if (oi.state == 3) {
                                    tempHtml = tempHtml.replace("{hide}", "am-hide");
                                }
                                else {
                                    tempHtml = tempHtml.replace("{hide}", "am-hide");
                                }
                                if (oi.isPay == 0 && oi.state == 1) {
                                    tempHtml = tempHtml.replace("{payhide}", "");
                                }
                                else {
                                    tempHtml = tempHtml.replace("{payhide}", "am-hide");
                                }
                                if (oi.state < 9) {
                                    tempHtml = tempHtml.replace("{cancelhide}", "");
                                }
                                else {
                                    tempHtml = tempHtml.replace("{cancelhide}", "am-hide");
                                }
                                obj_train.append(tempHtml);
                            }

                            obj_train.find("li").find(".am-btn-warning").click(function () {
                                var orderNo = $(this).attr("data-no");
                                _List.getTrainOrderInfo(orderNo);
                            });

                            obj_train.find("li").find(".am-btn-default").click(function () {
                                var orderNo = $(this).attr("data-no");
                                var orderId = $(this).attr("data-id");
                                _List.trainCancelOrder(orderNo,orderId);
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
    }
}


_List.Init();
