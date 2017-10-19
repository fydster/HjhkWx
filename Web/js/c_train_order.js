var _Order = {
    bxNum: 1,
    bxjg:0,
    sType: 1,
    aPrice: 0,
    price: 0,
    tax: 0,
    jj: 0,
    bx: 0,
    price_back: 0,
    aPrice_back: 0,
    tax_back: 0,
    jj_back: 0,
    bx_back: 0,
    price_total: 0,
    tax_total: 0,
    jj_total: 0,
    bx_total: 0,
    price_total_back: 0,
    tax_total_back: 0,
    jj_total_back: 0,
    bx_total_back: 0,
    service_price: 0,
    service_total: 0,
    cjfbx_remark: 0,
    chdPrice: 0,
    chdPrice_back: 0,
    isOpenInfo: 0,
    voucherFee: 0,
    voucherId: 0,
    voucherType: 0,
    isHarfPrice: 0,
    isHarfPrice_back: 0,
    isValadFare: false,
    Init: function () {
        //测试完成放开

        if ($.cookie("seascape_def_USER_ID") != null) {
            _U.uid = $.cookie("seascape_def_USER_ID");
        }

        var mobile = _U.mobile;
        if (mobile == null || mobile.length == 0) {
            mobile = $.cookie("_Mobile");
        }
        if (mobile != null && mobile.length > 0) {
        }
        else {
            window.location = "c_role.html?state=7";
            //_C.RedirectUrl("c_role.html", 7, "snsapi_userinfo");
            return;
        }
        //处理返回键
        window.onpopstate = function () {
            if (_Order.isOpenInfo == 1) {
                $(".farePanel").hide();
                _Order.isOpenInfo = 0;
                $(".flihtInfo").show();
                $(".order_Fare").show();
                $("header").show();
            }
            if (_Order.isOpenInfo == 3) {
                $(".VoucherPanel").hide();
                _Order.isOpenInfo = 0;
                $(".flihtInfo").show();
                $(".order_Fare").show();
                $("header").show();
            }
        }

        //退改签规定
        $(".priceMunu").find("span").eq(2).click(function () {
            $("#doc-modal-1").modal("open");
        });

        $("#mobile").val(_U.mobile);
        $("#mobile").keyup(function () {
            $(this).popover("close");
        });
        _Order.initLayot();
        if ($.cookie("Trip_select") != null) {
            _T = JSON.parse($.cookie("Trip_select"));
            $(".topMenu").find("span").eq(0).text(_T.sCity);
            $(".topMenu").find("span").eq(2).text(_T.tCity);
            //$("title").text(_T.sCity + " - " + _T.tCity);
            /*
            if (_F.sType == 2) {
                _FBack = JSON.parse($.cookie("Trip_select_back"));
            }*/
            _Order.showFliht();
        }
        else {
            window.location = "c_index_home.html";
        }
        $("#btn_showAll").click(function () {
            $(".FareList").find("li").show();
        });

        $("#div_goback").click(function () {
            window.location = "c_trip.html?s=1";
        });

        $(".am-icon-angle-right").click(function () {
            $(".VoucherPanel").show();
            _Order.isOpenInfo = 3;
            var json = { time: new Date().getTime() };
            window.history.pushState(json, "http://hjhk.edmp.cc/loading.html?action=0");
            $(".flihtInfo").hide();
            $(".order_Fare").hide();
            $("header").hide();
        });

        $("#btn_toSave").click(function () {
            $(".order_Fare").find(".cardadd").each(function () {
                if ($(this).find(".tselect select").val().length == 0) {
                    var card = $(this).find(".tinput input").eq(1).val();
                    var name = $(this).find(".tinput input").eq(0).val();
                    if (card.length == 0 || name.length == 0) {
                        $(this).remove();
                    }
                }
            });
            _Order.getPrice();
            $("#my-actions").find(".am-btn-warning").removeClass("am-hide");
            $(".CheckFliht").show();
            $("#my-actions").modal("open");
        });
        $("#btn_ToPay").click(function () {
            _Order.addOrder();
        });
        _Order.InitFare();
        _C.initWx();
    },
    InitFare: function () {
        $(".FareList").html("");
        $(".Alllater").find("li").hide();
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 122, mobile: _U.mobile, t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                    if (o.List != null) {
                        for (var i = 0; i < o.List.length; i++) {
                            var oi = o.List[i];
                            $(".FareList").append("<li id=\"Fare_" + oi.id + "\" data-py=\"" + oi.user_py + "\"><div class=\"FLeft\"><span>" + oi.fare_name + "</span><span style=\"font-size:1.4rem;color:#999;\">" + oi.fare_card + "</span></div><div class=\"FRight\"><i data-id=\"" + oi.id + "\" data-name=\"" + oi.fare_name + "\" data-card=\"" + oi.fare_card + "\" class=\"am-icon-square-o\"></i></div></li>");
                            $(".Alllater").find("li").each(function () {
                                if ($(this).find("span").text() == oi.user_py.toString().toUpperCase()) {
                                    $(this).show();
                                }
                            });
                        }
                        $(".Alllater").find("li").click(function () {
                            var l = $(this).find("span").text();
                            $(".FareList").find("li").each(function () {
                                if ($(this).attr("data-py").toString().toUpperCase() == l) {
                                    $(this).show();
                                }
                                else {
                                    $(this).hide();
                                }
                            });
                        });
                        $(".FareList").find("li").click(function () {
                            var fObj = $(this).find(".FRight i");
                            if (fObj.hasClass("am-icon-square-o")) {
                                fObj.removeClass("am-icon-square-o").addClass("am-icon-check-square-o");
                                var name = fObj.attr("data-name");
                                var card = fObj.attr("data-card");
                                var id = fObj.attr("data-id");
                                _Order.addFare(name, card, id);
                            }
                            else {
                                fObj.removeClass("am-icon-check-square-o").addClass("am-icon-square-o");
                                var id = fObj.attr("data-id");
                                _Order.delFare(0, id);
                            }
                        });
                    }
                }

            }
        }
        );
    },
    showFliht: function () {
        var isTy = 0;
        if (_F.sType == 1) {
            var Obj = $(".flihtMenu").find("span");
            Obj.eq(0).html(new Date(_T.sDate).pattern("MM-dd"));
            Obj.eq(1).html(_C.getWeek(_T.sDate));
            Obj.eq(2).html(_T.sTime);
            Obj.eq(3).html(_T.trainNo);
            Obj.eq(4).html(_T.seatName);

            var pObj = $(".priceMunu").find("span");
            pObj.eq(1).text("￥" + _T.price);

            //核对页面
            var CObj = $(".CheckFliht").find("span");
            CObj.eq(1).find("em").html(_T.sCity + " 至 " + _T.tCity + " [ 车次：" + _T.trainNo + " ]<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + _T.sDate + " 出发" + _T.sTime + " - 到达" + _T.tTime);
        }
        else {
            $(".flihtInfo").find(".info").find(".hb").hide();
            $(".flihtInfo").find(".info").find(".am-g").eq(0).hide();
            $("#div_second").show();
            $("#div_goback").show();
            var Obj = $("#div_second").find("div");
            Obj.eq(0).find("span").eq(1).html(new Date(_F.sDate).pattern("MM月dd日") + " " + _C.getWeek(_F.sDate) + " " + _F.sTime + " " + _F.sPort + _F.sT + " - " + _F.tPort + _F.tT);
            Obj.eq(1).find("span").eq(1).html(new Date(_F.tDate).pattern("MM月dd日") + " " + _C.getWeek(_F.tDate) + " " + _FBack.sTime + " " + _FBack.sPort + _FBack.sT + " - " + _FBack.tPort + _FBack.tT);

            //核对页面
            var CObj = $(".CheckFliht").find("span");
            CObj.eq(1).find("em").html(_F.flihtName + "[ " + _F.flihtNo + " ] &nbsp;&nbsp;&nbsp;" + _F.sDate + "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + _F.sPort + _F.sT + "-" + _F.tPort + _F.tT + " &nbsp;&nbsp;&nbsp;" + _F.sTime + "-" + _F.tTime);
            CObj.eq(2).find("em").html(_FBack.flihtName + "[ " + _FBack.flihtNo + " ] &nbsp;&nbsp;&nbsp;" + _F.tDate + "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + _FBack.sPort + _FBack.sT + "-" + _FBack.tPort + _FBack.tT + " &nbsp;&nbsp;&nbsp;" + _FBack.sTime + "-" + _FBack.tTime);
            CObj.eq(2).show();

            var pObj = $(".flihtInfo").find(".info").find(".am-u-sm-4");
            pObj.eq(0).find("em").text("￥" + (parseInt(_F.price) + parseInt(_FBack.price)));
            pObj.eq(1).find("em").text("￥" + (parseInt(_F.jj) + parseInt(_FBack.jj)));
            pObj.eq(2).find("em").text("￥" + (parseInt(_F.tax) + parseInt(_FBack.tax)));

            if (_FBack.sCode.toUpperCase() == "TYN" || _F.sCode.toUpperCase() == "TYN") {
                isTy = 1;
            }

            _Order.sType = _F.sType;
            _Order.price = parseInt(_F.price);
            _Order.tax = parseInt(_F.tax);
            _Order.jj = parseInt(_F.jj);
            _Order.aPrice = parseInt(_F.aPrice);
            
            _Order.price_back = parseInt(_FBack.price);
            _Order.tax_back = parseInt(_FBack.tax);
            _Order.jj_back = parseInt(_FBack.jj);
            _Order.aPrice_back = parseInt(_FBack.aPrice);
        }
        if (isTy == 0) {
            $(".order_other").find(".blockinput").eq(2).hide();
        }
    },
    initLayot: function () {
        var h = window.screen.height;
        $(".farePanel").css("height", h + "px");
        $("#Div_ZMJS").css("height", parseInt(h*5 / 9) + "px");
        $(".VoucherPanel").css("height", h + "px");

        $("#check_bx").click(function () {
            if ($(this).hasClass("am-icon-square-o")) {
                $(this).removeClass("am-icon-square-o").addClass("am-icon-check-square-o");
                $(this).css("color", "#a01678");
                $(".innerPanel").eq(1).show();
                $(".PriceList").find(".title").eq(2).show();
                _Order.getPrice();
            }
            else {
                $(this).removeClass("am-icon-check-square-o").addClass("am-icon-square-o");
                $(this).css("color", "#aaa");
                $(".innerPanel").eq(1).hide();
                $(".PriceList").find(".title").eq(2).hide();
                _Order.getPrice();
            }
        });

        $("#check_gb").click(function () {
            _Order.service_price = 0;
            _Order.cjfbx_remark = "";
            $(".PriceList").find(".title").eq(3).hide();
            $(".innerPanel").find("i").removeClass("am-icon-check-circle-o").addClass("am-icon-circle-o");
            if (_Order.voucherFee > 0 && _Order.voucherType == 1) {
                $(".VoucherPanel").find("ul").find("li").removeClass("select");
                $(".blockinput").eq(4).find("em").text("已选0元");
                $(".PriceList").find("span").eq(14).find("em").text("0元");
                _Order.voucherFee = 0;
                _Order.voucherType = 0;
                _Order.voucherId = 0;
            }
            if ($(this).hasClass("am-icon-square-o")) {
                $(this).removeClass("am-icon-square-o").addClass("am-icon-check-square-o");
                $(this).css("color", "#a01678");
                $(".innerPanel").eq(0).show();
                //$(".PriceList").find(".title").eq(2).show();
                _Order.getPrice();
            }
            else {
                $(this).removeClass("am-icon-check-square-o").addClass("am-icon-square-o");
                $(this).css("color", "#aaa");
                $(".innerPanel").eq(0).hide();
                //$(".PriceList").find(".title").eq(2).hide();
                _Order.getPrice();
            }
        });

        $(".innerPanel").find("i").click(function () {
            $(".innerPanel").find("i").removeClass("am-icon-check-circle-o").addClass("am-icon-circle-o");
            $(this).removeClass("am-icon-circle-o").addClass("am-icon-check-circle-o");
            _Order.service_price = $(this).attr("data-price");
            _Order.cjfbx_remark = $(this).attr("data-service");
            $(".PriceList").find(".title").eq(3).show();
            _Order.getPrice();
        });

        $("#btn_fare_hide").click(function () {
            $(".farePanel").hide();
            _Order.isOpenInfo = 0;
            $(".flihtInfo").show();
            $(".order_Fare").show();
            $("header").show();
        });

        $(".am-btn-link").click(function () {
            $(".PayPanel").hide();
            $(".flihtInfo").show();
            $(".order_Fare").show();
            $("header").show();
        });

        $("#btn_price_show").click(function () {
            $(".order_Fare").find(".cardadd").each(function () {
                /*
                if ($(this).find(".tselect em").text().length == 0) {
                    var card = $(this).find(".tinput input").eq(1).val();
                    var name = $(this).find(".tinput input").eq(0).val();
                    if (card.length == 0 || name.length == 0) {
                        $(this).remove();
                    }
                }*/
                if ($(this).find(".tselect select").val().length == 0) {
                    var card = $(this).find(".tinput input").eq(1).val();
                    var name = $(this).find(".tinput input").eq(0).val();
                    if (card.length == 0 || name.length == 0) {
                        $(this).remove();
                    }
                }
            });
            _Order.getPrice();
            $("#my-actions").modal("open");
            $(".CheckFliht").hide();
            $(".PriceList").find("span").show();
            if ($("#check_bx").hasClass("am-icon-square-o")) {
                $(".PriceList").find(".title").eq(2).hide();
            }
            else {
                $(".PriceList").find(".title").eq(2).show();
            }
            $(".PriceList").find(".title").eq(3).hide();
            if (_Order.service_price > 0) {
                $(".PriceList").find(".title").eq(3).show();
            }
            $("#my-actions").find(".am-btn-warning").removeClass("am-hide").addClass("am-hide");
            //$(".PayPanel").show();
            //$(".flihtInfo").hide();
            //$(".order_Fare").hide();
            //$("header").hide();
        });

        $("#btn_price_hide").click(function () {
            $(".PayPanel").hide();
            $(".flihtInfo").show();
            $(".order_Fare").show();
            $("header").show();
        });

        $("#btn_show_fare").click(function () {
            $(".farePanel").show();
            _Order.isOpenInfo = 1;
            var json = { time: new Date().getTime() };
            window.history.pushState(json, "http://hjhk.edmp.cc/loading.html?action=0");
            $(".flihtInfo").hide();
            $(".order_Fare").hide();
            $("header").hide();
        });

        $("#btn_add_fare").click(function () {
            _Order.addFare("", "", 0);
        });

        $("#my-alert").find(".am-modal-btn").click(function () {
            window.location = "c_order_all.html";
        });
    },
    delFare: function (num,id) {
        if (id > 0) {
            $("#Fare_" + id).find(".FRight i").removeClass("am-icon-check-square-o").addClass("am-icon-square-o");
        }
        if (num > 0) {
            $("#Fare_" + num).remove();
        }
        else {
            $(".am-btn-danger").each(function () {
                var id_s = $(this).attr("data-id");
                if (id_s == id) {
                    var num_s = $(this).attr("data-num");
                    $("#Fare_" + num_s).remove();
                }
            });
        }
        _Order.countFare();
    },
    addFare: function (name, card, id) {
        var num = $(".order_Fare").find(".cardadd").length;
        if (num == 5) {
            weui.alert("每个订单乘客不能超过5人");
            return;
        }
        num++;
        var html = $("#fare_template").html();
        var bHtml = html.replace(/{num}/g, num).replace(/{id}/g, id);
        bHtml = bHtml.replace("{namevalue}", name);
        bHtml = bHtml.replace("{cardvalue}", card);
        var cardTypeS = "身份证";
        if (card.length == 0) {
            bHtml = bHtml.replace("{faretype}", "");
            bHtml = bHtml.replace("{faretype1}", "");
            bHtml = bHtml.replace("{faretype2}", "");
        }
        else {
            if (card.length > 14) {
                var nl = 0;
                var nls = "";
                var nowD = new Date().pattern("yyyyMMdd");
                if (card.length == 15) {
                    nls = "19" + card.substring(6, 12);
                }
                else {
                    nls = card.substring(6, 14);
                }
                nl = parseInt(nowD.substring(0, 4)) - parseInt(nls.substring(0, 4));
                if (parseInt(nowD.substring(4, 8)) > parseInt(nls.substring(4, 8))) {
                    nl = nl - 1;
                }
                if (nl < 13) {
                    bHtml = bHtml.replace("{faretype}", "儿童");
                    bHtml = bHtml.replace("{fareType_value}", "2");
                    bHtml = bHtml.replace("{faretype2}", "selected=\"selected\"");
                }
                else {
                    bHtml = bHtml.replace("{fareType_value}", "1");
                    bHtml = bHtml.replace("{faretype1}", "selected=\"selected\"");
                    bHtml = bHtml.replace("{faretype}", "成人");
                }
            }
            else {
                cardTypeS = "护照";
                bHtml = bHtml.replace("{faretype}", "成人");
                bHtml = bHtml.replace("{faretype1}", "");
                bHtml = bHtml.replace("{faretype2}", "");
            }
        }
        bHtml = bHtml.replace("{fareType_value}", "0");
        $("#btn_add_fare").before(bHtml);


        cardTypeS = cardTypeS.replace("身份证", "1").replace("护照", "2");
        setTimeout(function () { $("#CardType_" + num).val(cardTypeS); }, 1000);
        

        $(".tselect").find("select").change(function () {
            var ftype = $(this).val();
            if (ftype.length == 0) {
                ftype = 0;
            }
            $(this).parent().parent().attr("data-faretype", ftype);
            _Order.getPrice();
            $(".am-popover").remove();
        });
        

        $(".am-btn-danger").click(function () {
            var num = $(this).attr("data-num");
            var id = $(this).attr("data-id");
            _Order.delFare(num, id);
        });
        _Order.countFare();
    },
    countFare: function () {
        var num = $(".order_Fare").find(".cardadd").length;
        $(".maintitle").find("em").text(num + "人");
        $("#span_FNum").html("(共" + num + "人)");
        _Order.getPrice();
    },
    addOrder: function () {
        var Fare_num = $(".order_Fare").find(".cardadd").length;
        var FareInfo = _Order.getFareInfo();
        var TripInfo = _Order.getTripInfo();
        var contact = _U.contact;
        var User_tel = $("#mobile").val();
        if (User_tel.length == 0) {
            $("#my-actions").modal("close");
            weui.topTips('请填写联系电话', 3000);
            return;
        }
        //alert(FlihtInfo);
        //alert(FlihtInfo_Back);
        //alert(FareInfo);
        //alert(_Order.checkFare());
        if (TripInfo.length > 0 && FareInfo.length > 0) {
            
        }
        else {
            weui.topTips('乘客信息不全', 3000);
            $("#my-actions").modal("close");
            return;
        }
        $("#my-modal-loading").modal("open");

        $.ajax(
                    {
                        url: _C.TrainServerUrl,
                        context: document.body,
                        dataType: "json",
                        cache: false,
                        data: { fn: 4, uid: _U.uid, uidtemp: $.cookie("seascape_def_USER_ID"), perTicketPrice: _T.price, contact: contact, fareNum: Fare_num, ticketPrice: _Order.price_total, insurePrice: _Order.bx_total, mobile: User_tel, passengers: FareInfo, TripInfo: TripInfo, t: new Date() },
                        success: function (o) {
                            if (o.msgCode == 100) {
                                $("#my-actions").modal("close");
                                $("#my-modal-loading").modal("close");
                                weui.alert('订单创建完成，系统正在申请座位，请注意查看座位申请情况，并及时支付以免座位取消', function () {
                                    window.location = "c_train_pay.html?no=" + o.outOrderNo;
                                });
                                //_Order.doPay(o.outOrderNo)
                                //window.location = "c_pay.html?orderNo=" + orderNo;
                            }
                            else {
                                weui.alert("提交失败，请稍后再试！");
                                $("#my-modal-loading").modal("close");
                            }
                        }
                    }
                    );
    },
    getTripInfo: function () {
        return _T.trainNo + "@" + _T.sCity + "@" + _T.sCode + "@" + _T.tCity + "@" + _T.tCode + "@" + _T.sDate + "@" + _T.seat + "@" + _T.seatName + "@" + _T.sTime + "@" + _T.tTime + "@" + _T.queryKey;
    },
    getPrice: function () {
        var bxNum = 1;
        /*
        if (_Order.sType == 2) {
            var ts = _C.dateDiff("D", _F.sDate, _F.tDate);
            if (ts > 1) {
                bxNum = 2;
            }
        }
        */
        _Order.bxNum = bxNum;

        var num = 0;
        var chdNum = 0;
        var aduNum = 0;
        $(".order_Fare").find(".cardadd").each(function () {
            if ($(this).find(".tselect select").val().length == 0) {
                var card = $(this).find(".tinput input").eq(1).val();
                if (card.length > 0) {
                    if (card.length == 15 || card.length == 18) {
                        var age = _C.getAge(card);
                        if (age > 12) {
                            $(this).find(".tselect select").val("1");
                            $(this).attr("data-faretype", "1");
                        }
                        else {
                            $(this).find(".tselect select").val("2");
                            $(this).attr("data-faretype", "2");
                        }
                    }
                    else {
                        //$(this).find(".tselect select").val("");
                    }
                }
            }
            /*
            if ($(this).find(".tselect em").text().length == 0) {
                var card = $(this).find(".tinput input").eq(1).val();
                if (card.length > 0) {
                    if (card.length == 15 || card.length == 18) {
                        var age = _C.getAge(card);
                        if (age > 12) {
                            $(this).find(".tselect em").text("成人");
                        }
                        else {
                            $(this).find(".tselect em").text("儿童");
                            $(this).attr("data-faretype", "2");
                        }
                    }
                    else {
                        $(this).find(".tselect em").text("成人");
                    }
                }
            }            
            */
            if ($(this).attr("data-faretype") == "1" || $(this).attr("data-faretype") == "0") {
                aduNum++;
            }
            else {
                chdNum++;
            }
        });
        num = aduNum + chdNum;

        var chdPrice = parseInt(_T.price / 2);
        chdPrice = Math.ceil(chdPrice / 10) * 10;
        _Order.isHarfPrice = 1;
        /*
        if (chdPrice > _Order.price) {
            chdPrice = _Order.price;
        }
        else {
            _Order.isHarfPrice = 1;
        }
        var chdPrice_back = parseInt(_Order.aPrice_back / 2);
        chdPrice_back = Math.ceil(chdPrice_back / 10) * 10;
        _Order.isHarfPrice_back = 1;
        /*
        if (chdPrice_back > _Order.price_back) {
            chdPrice_back = _Order.price_back;
        }
        else {
            _Order.isHarfPrice_back = 1;
        }*/
        _Order.chdPrice = chdPrice;
        //_Order.chdPrice_back = chdPrice_back;

        if (chdNum > 0) {
            _Order.price_total = _T.price * aduNum;
            _Order.price_total += chdPrice * chdNum;

            //_Order.price_total_back = (_Order.price_back) * aduNum;
            //_Order.price_total_back += chdPrice_back * chdNum;
        }
        else {
            _Order.price_total = _T.price * num;
            //_Order.price_total_back = (_Order.price_back) * num;
        }

        //基建和燃油儿童免费
        _Order.bx_total = _Order.bxjg * num * bxNum;

        if (bxNum > 1) {
            _Order.bx_total_back = _Order.bxjg * num;
        }

        var total = _Order.price_total + _Order.bx_total;

        //优惠券
        if (total > 0) {
            var voucherFee = _Order.voucherFee;
            total = total - voucherFee;
            $(".PriceList").find("span").eq(14).find("em").text(voucherFee + "元");
        }
        

        $("#topBar").find(".am-u-sm-4").eq(0).find("span").eq(0).text("￥" + total);

        $("#topBar").data("_order_price", total + "");
        //明细说明
        var obj = $(".PriceList").find("span");
        var total_s = 0
        obj.eq(1).find("em").text(_T.price + "元");
        obj.eq(2).find("em").text(_Order.bxjg + "元");

        total_s = parseFloat(_T.price) + parseFloat(_Order.bxjg);

        /*
        if (_Order.price_back > 0) {
            obj.eq(1).find("em").append(" + " + _Order.price_back + "元");
            obj.eq(2).find("em").append(" + " + _Order.jj_back + "元");
            obj.eq(3).find("em").append(" + " + _Order.tax_back + "元");
            total_s = _Order.price + _Order.jj + _Order.tax + _Order.bxjg + _Order.price_back + _Order.jj_back + _Order.tax_back;
            if (bxNum > 1) {
                obj.eq(4).find("em").append(" * " + bxNum + "&nbsp;&nbsp;&nbsp;&nbsp;<font style=\"font-size:1.3rem;color:#008ed6\">(往返行程超过2天)</font>");
                total_s = _Order.price + _Order.jj + _Order.tax + (_Order.bxjg * bxNum) + _Order.price_back + _Order.jj_back + _Order.tax_back;
            }

        }
        */

        obj.eq(3).find("em").text(total_s + "元 * " + aduNum + "人");

        if (chdNum > 0) {
            var total_c = 0
            obj.eq(5).find("em").text(chdPrice + "元");
            /*
            obj.eq(8).find("em").text(_Order.jj + "元");
            obj.eq(9).find("em").text(_Order.tax + "元");
            */

            obj.eq(6).find("em").text(_Order.bxjg + "元");

            //total_c = chdPrice + _Order.jj + _Order.tax + _Order.bxjg;
            total_c = chdPrice + _Order.bxjg;

            //obj.eq(7).find("em").append("&nbsp;&nbsp;&nbsp;&nbsp;<font style=\"font-size:1.3rem;color:#008ed6\">(全价的50%)</font>");

            obj.eq(7).find("em").text(total_c + "元 * " + chdNum + "人");
        }

        obj.eq(9).find("em").text(total + "元");
        _Order.CheckFareFor12306();
    },
    getFareInfo: function () {
        var FareInfo = "";
        $(".order_Fare .cardadd").each(function () {
            var num = $(this).attr("id").replace("Fare_", "");
            var name = $("#FareName_" + num).val();
            var card = $("#FareCard_" + num).val();
            var cardType = "身份证";//$("#CardType_" + num).val().replace("身份证", "1").replace("护照", "2");
            try{
                cardType = $("#CardType_" + num).val();
            }
            catch (e) {
                cardType = "身份证";
            }
            var fareType = $(this).attr("data-faretype").replace("成人", "1").replace("儿童", "2");
            if (name.length > 0 && card.length > 0) {
                FareInfo += name + "|" + card + "|" + cardType + "|" + fareType + "@";
            }
        });
        return FareInfo;
    },
    CheckFareFor12306: function () {
        var passengers = "";
        $(".order_Fare .cardadd").each(function () {
            var num = $(this).attr("id").replace("Fare_", "");
            var name = $("#FareName_" + num).val();
            var card = $("#FareCard_" + num).val();
            var cardType = "身份证";//$("#CardType_" + num).val().replace("身份证", "1").replace("护照", "2");
            try {
                cardType = $("#CardType_" + num).val();
            }
            catch (e) {
                cardType = "身份证";
            }
            var fareType = $(this).attr("data-faretype").replace("成人", "1").replace("儿童", "2");
            if (name.length > 0 && card.length > 0) {
                passengers += name + "|" + card + "|" + cardType + "|" + fareType + "@";
            }
        });
        if (passengers.length > 0) {
            $.ajax(
                    {
                        url: _C.TrainServerUrl,
                        context: document.body,
                        dataType: "json",
                        cache: false,
                        data: { fn: 3, passengers: passengers, t: new Date() },
                        success: function (o) {
                            if (o.msgCode == 100) {
                                var failNum = 0;
                                var failInfo = "";
                                if (o.passengers != null) {
                                    for (var i = 0; i < o.passengers.length; i++) {
                                        var or = o.passengers[i];
                                        if (or.status == "failed") {
                                            failNum++;
                                            failInfo += or.passengerName + " [ " + or.cardNo + " ] <br/>";
                                        }
                                    }
                                }
                                if (failNum > 0) {
                                    _Order.isValadFare = false;
                                    $("#my-alert-fareCheck").find(".am-modal-hd span").text(failNum);
                                    $("#my-alert-fareCheck").find(".am-modal-bd p").html(failInfo);
                                    $("#my-alert-fareCheck").modal("open");
                                }
                                else {
                                    _Order.isValadFare = true;
                                }
                            }
                        }
                    }
                    );
        }
    },
    doPay: function (no) {
        $.ajax(
        {
            url: _C.TrainServerUrl,
            context: document.body,
            dataType: "text",
            cache: false,
            data: { fn: 5,uid:_U.uid, orderNo: no, t: new Date() },
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
                            window.location = "c_order_all.html";
                        },
                        cancel: function (res) {
                            if (res.errMsg == "chooseWXPay:cancel") {
                                alert("为了给您安排，请尽快支付,如因未支付导致座位取消由您本人承担！");
                                window.location = "c_order_all.html";
                            }
                        }
                    });
                }

            }
        }
        );
    }
}

