var _Order = {
    bxNum: 1,
    bxjg: 30,
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
    Init: function () {
        if ($.cookie("seascape_def_USER_ID") != null) {
            _U.uid = $.cookie("seascape_def_USER_ID");
        }
        //测试完成放开
        //_U.mobile = "13100000138";
        var mobile = _U.mobile;
        if (mobile == null || mobile.length == 0) {
            mobile = $.cookie("_Mobile");
        }
        if (mobile != null && mobile.length > 0) {
        }
        else {
	        window.location = "c_role.html?state=0";
            //_C.RedirectUrl("c_role.html", 0, "snsapi_userinfo");
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
        $("#mobile").val(_U.mobile);
        $("#mobile").keyup(function () {
            $(this).popover("close");
        });
        _Order.initLayot();
        if ($.cookie("Trip_select") != null) {
            _F = JSON.parse($.cookie("Trip_select"));
            $(".topMenu").find("span").eq(0).text(_F.sCity);
            $(".topMenu").find("span").eq(2).text(_F.tCity);
            //$("title").text(_F.sCity + " - " + _F.tCity);
            if (_F.sType == 2) {
                _FBack = JSON.parse($.cookie("Trip_select_back"));
            }
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
            var obj = $(".PriceList").find("span");
            obj.eq(1).hide();
            obj.eq(2).hide();
            obj.eq(3).hide();
            obj.eq(4).hide();
            obj.eq(7).hide();
            obj.eq(8).hide();
            obj.eq(9).hide();
            obj.eq(10).hide();
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
            $("#my-actions").modal("open");
        });
        $("#btn_ToPay").click(function () {
            _Order.addOrder();
        });
        _Order.InitFare();
        _Order.InitVoucher();
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
            data: { fn: 102, mobile: _U.mobile, t: new Date() },
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
    InitVoucher: function () {
        var obj = $(".VoucherPanel").find("ul");
        var template = $("#template_voucher").html();
        obj.html("<li style=\"text-align:center;padding-top:2rem;\">无优惠券<li>");
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 112, uid: _U.uid, t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                    if (o.List != null) {
                        obj.html("");
                        var tempHtml = "";
                        var voucherTitle = "无限制通用现金红包";
                        var voucherType = "现金红包";
                        var memo = "&nbsp;";
                        for (var i = 0; i < o.List.length; i++) {
                            voucherTitle = "无限制通用现金红包";
                            memo = "&nbsp;";
                            var oi = o.List[i];
                            if (oi.voucherType == 1) {
                                voucherTitle = "贵宾服务券";
                                memo = "仅限贵宾服务使用";
                                voucherType = "贵宾服务";
                            }
                            tempHtml = template.replace("{voucherType}", voucherType);
                            tempHtml = tempHtml.replace("{voucherTitle}", voucherTitle);
                            tempHtml = tempHtml.replace("{voucherDate}", new Date(oi.endOn).pattern("yyyy-MM-dd"));
                            tempHtml = tempHtml.replace("{memo}", memo);
                            tempHtml = tempHtml.replace("{id}", oi.id);
                            tempHtml = tempHtml.replace("{title}", oi.voucherTitle);
                            tempHtml = tempHtml.replace("{price}", oi.voucherFee);
                            tempHtml = tempHtml.replace(/{type}/g, oi.voucherType);
                            tempHtml = tempHtml.replace("{voucherPrice}", oi.voucherFee);
                            obj.append(tempHtml);
                        }

                        obj.find("li").find(".bottomBtn").click(function () {
                            var price = $(this).attr("data-price");
                            var id = $(this).attr("data-id");
                            var title = $(this).attr("data-title");
                            var type = $(this).attr("data-type");
                            if (_Order.service_price == 0 && type == 1) {
                                return;
                            }
                            obj.find("li").removeClass("select");
                            $(this).parent().addClass("select");

                            $(this).parent().find(".ruleDesp").html("");
                            $(this).parent().find(".ruleDesp").hide();
                            $(this).parent().find(".rightPrice").find("i").removeClass("am-icon-angle-up").addClass("am-icon-angle-down");


                            _Order.voucherFee = price;
                            _Order.voucherId = id;
                            _Order.voucherType = type;
                            $(".PriceList").find("span").eq(14).find("em").text(price + "元");
                            $(".blockinput").eq(4).find("em").text("已选" + price + "元[" + title + "]");
                            $(".VoucherPanel").hide();
                            _Order.isOpenInfo = 0;
                            $(".flihtInfo").show();
                            $(".order_Fare").show();
                            $("header").show();
                            _Order.getPrice();
                        });

                        obj.find("li").find(".rightPrice").click(function () {
                            var type = $(this).attr("data-type");
                            var rule = "<p>使用细则：</p><p>1、	该优惠券仅限在“山西出行”公众号提交订单的用户使用；</p><p>2、	该优惠券限2017.12.31日前使用有效，每张优惠券限使用一次，且每张订单限使用一张优惠券，此优惠不可与其他优惠活动同时使用，不可叠加使用，不找零，不可兑换现金；</p><p>3、	用户在享受优惠立减后，若发生退票、改签等情况，则以实际支付金额为准，优惠立减金额不予退还；</p><p>4、	如发生恶意盗刷优惠券行为，“山西出行”公众号有权收回该行为涉及的优惠券，并取消该账号已获取的优惠。</p>";
                            if (type == 1) {
                                rule = "<p>使用细则：</p><p>1、	该优惠券仅限在“山西出行”公众号提交订单的用户使用；</p><p>2、	该优惠券仅限购买贵宾服务产品时使用；</p><p>3、	该优惠券限2017.12.31日前使用有效，每张优惠券限使用一次，且每张订单限使用一张优惠券，此优惠不可与其他优惠活动同时使用，不可叠加使用，不找零，不可兑换现金；</p><p>4、	用户在享受优惠立减后，若发生退票、改签等情况，则以实际支付金额为准，优惠立减金额不予退还；</p><p>5、	如发生恶意盗刷优惠券行为，“山西出行”公众号有权收回该行为涉及的优惠券，并取消该账号已获取的优惠。</p>";
                            }
                            if ($(this).find("i").hasClass("am-icon-angle-down")) {
                                $(this).parent().find(".ruleDesp").html(rule);
                                $(this).parent().find(".ruleDesp").show();
                                $(this).find("i").removeClass("am-icon-angle-down").addClass("am-icon-angle-up");
                            }
                            else {
                                $(this).parent().find(".ruleDesp").html("");
                                $(this).parent().find(".ruleDesp").hide();
                                $(this).find("i").removeClass("am-icon-angle-up").addClass("am-icon-angle-down");
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
            Obj.eq(0).html(new Date(_F.sDate).pattern("MM-dd"));
            Obj.eq(1).html(_C.getWeek(_F.sDate));
            Obj.eq(2).html(_F.sTime);
            Obj.eq(3).html(_F.flihtName + _F.flihtNo);
            Obj.eq(4).html(_F.cw);

            Obj.eq(5).text(_F.sPort + _F.sT);
            Obj.eq(7).text(_F.tPort + _F.tT);
            Obj.eq(8).text(_F.jixing);

            //核对页面
            var CObj = $(".CheckFliht").find("span");
            CObj.eq(1).find("em").html(_F.flihtName + _F.flihtNo + "<br/>&nbsp;&nbsp;&nbsp;&nbsp;" + _F.sDate + " " + _F.sPort + _F.sT + "-" + _F.tPort + _F.tT + " " + _F.sTime + "-" + _F.tTime);

            var pObj = $(".priceMunu").find("span");
            pObj.eq(1).text("￥" + _F.price);
            pObj.eq(4).text("￥" + _F.jj + "+" + "￥" + _F.tax);
            _Order.sType = _F.sType;
            _Order.price = parseInt(_F.price);
            _Order.tax = parseInt(_F.tax);
            _Order.jj = parseInt(_F.jj);
            _Order.aPrice = parseInt(_F.aPrice);

            if (_F.sCode.toUpperCase() == "TYN") {
                isTy = 1;
            }
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

        //退改签规定
        $(".priceMunu").find("span").eq(2).click(function () {
            var bgrule = _F.bgrule;
            var tprule = _F.tprule;
            $("#doc-modal-1").find("#bgrule").text(bgrule);
            $("#doc-modal-1").find("#tprule").text(tprule);
            $("#doc-modal-1").modal("open");
        });

        //儿童婴儿票规定
        $(".priceMunu").find("span").eq(5).click(function () {
            $("#doc-modal-2").modal("open");
        });
    },
    initLayot: function () {
        var h = window.screen.height;
        $(".farePanel").css("height", h + "px");
        $("#Div_ZMJS").css("height", parseInt(h * 5 / 9) + "px");
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

        $("#check_insurce").click(function () {
            if ($(this).hasClass("am-icon-square-o")) {
                $(this).removeClass("am-icon-square-o").addClass("am-icon-check-square-o");
                $(this).css("color", "#a01678");
                _Order.bxjg = 30;
                _Order.getPrice();
            }
            else {
                $(this).removeClass("am-icon-check-square-o").addClass("am-icon-square-o");
                $(this).css("color", "#aaa");
                _Order.bxjg = 0;
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
    delFare: function (num, id) {
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
        num++;
        var html = $("#fare_template").html();
        var bHtml = html.replace(/{num}/g, num).replace(/{id}/g, id);
        bHtml = bHtml.replace("{namevalue}", name);
        bHtml = bHtml.replace("{cardvalue}", card);
        var cardTypeS = "身份证";
        if (card.length == 0) {
            bHtml = bHtml.replace("{cardtype1}", "");
            bHtml = bHtml.replace("{cardtype2}", "");
            bHtml = bHtml.replace("{faretype}", "");
            bHtml = bHtml.replace("{faretype1}", "");
            bHtml = bHtml.replace("{faretype2}", "");
        }
        else {
            if (card.length > 14) {
                bHtml = bHtml.replace("{cardtype1}", "selected=\"selected\"");
                bHtml = bHtml.replace("{cardtype2}", "");
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
                bHtml = bHtml.replace("{cardtype2}", "selected=\"selected\"");
                cardTypeS = "护照";
                bHtml = bHtml.replace("{cardtype1}", "");
                bHtml = bHtml.replace("{faretype}", "成人");
                bHtml = bHtml.replace("{faretype1}", "");
                bHtml = bHtml.replace("{faretype2}", "");
            }
        }
        bHtml = bHtml.replace("{fareType_value}", "0");
        $("#btn_add_fare").before(bHtml);

        setTimeout(function () { $("#CardType_" + num).val(cardTypeS); }, 200);


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
        var Fliht_type = _Order.sType;//几个航段
        var FlihtInfo = _Order.getFlihtInfo(1);
        var FlihtInfo_Back = _Order.getFlihtInfo(2);
        var FareInfo = _Order.getFareInfo();
        var contact = _U.contact;
        var User_tel = $("#mobile").val();
        var Send_type = "门市自取";
        var post_name = "";
        var post_tel = "";
        var post_addr = "";
        if ($("#check_bx").hasClass("am-icon-check-square-o")) {
            Send_type = "邮寄";
            post_name = $("#Post_Name").val();
            post_tel = $("#Post_Tel").val();
            post_addr = $("#Post_Addr").val();
            if (post_name.length == 0 || post_tel.length == 0 || post_addr.length == 0) {
                $("#my-actions").modal("close");
                $("#div_bx").popover({
                    content: '请填写完整'
                });
                $("#Post_Name").focus();
                return;
            }
        }
        if (User_tel.length == 0) {
            $("#my-actions").modal("close");
            $("#mobile").popover({
                content: '请填写联系电话'
            });
            $("#mobile").click();
            return;
        }
        //alert(FlihtInfo);
        //alert(FlihtInfo_Back);
        //alert(FareInfo);
        //alert(_Order.checkFare());
        var isFare = _Order.checkFare();
        if (FlihtInfo.length > 0 && isFare && FareInfo.length > 0) {
            
        }
        else {
            if (!isFare) {
                alert("请检查乘客信息是否完整，儿童不能单独出票！");
            }
            else {
                alert("请完善乘客信息后再提交");
            }
            return;
        }
        $("#my-modal-loading").modal("open");
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "json",
            cache: false,
            data: { fn: 104, uid: _U.uid, voucherFee: _Order.voucherFee, voucherId: _Order.voucherId, cjfbx_remark: _Order.cjfbx_remark, cjfbx_total_price: _Order.service_total, User_name: contact, Send_type: Send_type, post_name: post_name, post_tel: post_tel, post_addr: post_addr, Fare_num: Fare_num, jp_total_price: _Order.price_total, jj_total_price: _Order.jj_total, ry_total_price: _Order.tax_total, jp_total_price_back: _Order.price_total_back, jj_total_price_back: _Order.jj_total_back, ry_total_price_back: _Order.tax_total_back, bx_total_price: _Order.bx_total, bx_total_price_back: _Order.bx_total_back, User_tel: User_tel, FareInfo: FareInfo, FlihtInfo_Back: FlihtInfo_Back, FlihtInfo: FlihtInfo, Fliht_type: Fliht_type, t: new Date() },
            success: function (o) {
                if (o.Return == 0) {
                    var orderNo = o.Msg;
                    if (orderNo.toString().indexOf("False") == -1 && orderNo.toString().indexOf("ERROR") == -1) {
                        //_Order.doPay(orderNo);
                        var date = new Date();
                        date.setTime(date.getTime() + (60 * 60 * 1000)); //1小时过期  
                        $.cookie("_OrderNo", orderNo, { path: '/', expires: date });
                        $.cookie("_Pirce", $("#topBar").data("_order_price"), { path: '/', expires: date });
                        if (_U.exOpenID == null) {
                            _U.exOpenID = "";
                        }

                        //window.location = "c_pay.html?v=20161219&no=" + orderNo;

                        
                        if (_U.exOpenID.length > 0) {
                            window.location = "c_pay.html?v=20161219&no=" + orderNo;
                        }
                        else {
                            _C.RedirectUrl("c_pay.html", 0, "snsapi_base");
                        }
                    }
                    else {
                        $("#my-alert").find(".am-modal-bd").text("您的订单已提交完成，因所选航班异常，我们正在处理中，稍后客服会给您回复。");
                        $("#my-alert").modal("open");
                        //window.location = "c_list.html";
                    }
                    //window.location = "c_pay.html?orderNo=" + orderNo;
                }
                else {
                    alert("提交失败，请稍后再试！");
                    $("#my-modal-loading").modal("close");
                }
            }
        }
        );
    },
    getPrice: function () {
        var bxNum = 1;
        if (_Order.sType == 2) {
            var ts = _C.dateDiff("D", _F.sDate, _F.tDate);
            if (ts > 1) {
                bxNum = 2;
            }
        }
        _Order.bxNum = bxNum;
        if (_Order.bxjg == 0) {
            _Order.bxNum = 0;
            bxNum = 0;
        }

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

        var chdPrice = parseInt(_Order.aPrice / 2);
        chdPrice = Math.ceil(chdPrice / 10) * 10;
        _Order.isHarfPrice = 1;
        /*
        if (chdPrice > _Order.price) {
            chdPrice = _Order.price;
        }
        else {
            _Order.isHarfPrice = 1;
        }*/
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
        _Order.chdPrice_back = chdPrice_back;

        if (chdNum > 0) {
            _Order.price_total = (_Order.price + _Order.price_back) * aduNum;
            _Order.price_total += (chdPrice + chdPrice_back) * chdNum;

            _Order.price_total_back = (_Order.price_back) * aduNum;
            _Order.price_total_back += chdPrice_back * chdNum;
        }
        else {
            _Order.price_total = (_Order.price + _Order.price_back) * num;
            _Order.price_total_back = (_Order.price_back) * num;
        }

        //基建和燃油儿童免费
        _Order.tax_total = (_Order.tax + _Order.tax_back) * aduNum;
        _Order.jj_total = (_Order.jj + _Order.jj_back) * aduNum;

        _Order.bx_total = _Order.bxjg * num * bxNum;

        _Order.tax_total_back = (_Order.tax_back) * aduNum;
        _Order.jj_total_back = (_Order.jj_back) * aduNum;

        if (bxNum > 1) {
            _Order.bx_total_back = _Order.bxjg * num;
        }

        //乘机方便行
        var service_price = _Order.service_price;
        var service_total = service_price * num;
        _Order.service_total = service_total;

        var total = _Order.price_total + _Order.tax_total + _Order.jj_total + _Order.bx_total + service_total;
        if ($("#check_bx").hasClass("am-icon-check-square-o")) {
            total = total + 10;
        }

        //优惠券
        if (total > 0) {
            if (service_total > 0) {
                var voucherFee = _Order.voucherFee;
                if (_Order.voucherFee > service_total) {
                    voucherFee = service_total;
                }
                total = total - voucherFee;
                $(".PriceList").find("span").eq(14).find("em").text(voucherFee + "元");
            }
            else {
                var voucherFee = _Order.voucherFee;
                total = total - voucherFee;
                $(".PriceList").find("span").eq(14).find("em").text(voucherFee + "元");
            }
        }


        $("#topBar").find(".am-u-sm-4").eq(0).find("span").eq(0).text("￥" + total);

        $("#topBar").data("_order_price", total + "");
        //明细说明
        var obj = $(".PriceList").find("span");
        var total_s = 0
        obj.eq(1).find("em").text(_Order.price + "元");
        obj.eq(2).find("em").text(_Order.jj + "元");
        obj.eq(3).find("em").text(_Order.tax + "元");
        obj.eq(4).find("em").text(_Order.bxjg + "元");

        total_s = _Order.price + _Order.jj + _Order.tax + _Order.bxjg;

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

        obj.eq(5).find("em").text(total_s + "元 * " + aduNum + "人");

        if (chdNum > 0) {
            var total_c = 0
            obj.eq(7).find("em").text(chdPrice + "元");
            /*
            obj.eq(8).find("em").text(_Order.jj + "元");
            obj.eq(9).find("em").text(_Order.tax + "元");
            */
            obj.eq(8).find("em").text("0元");
            obj.eq(9).find("em").text("0元");

            obj.eq(10).find("em").text(_Order.bxjg + "元");

            //total_c = chdPrice + _Order.jj + _Order.tax + _Order.bxjg;
            total_c = chdPrice + _Order.bxjg;

            if (_Order.price_back > 0) {
                obj.eq(7).find("em").append(" + " + chdPrice_back + "元");
                obj.eq(8).find("em").append(" + " + _Order.jj_back + "元");
                obj.eq(9).find("em").append(" + " + _Order.tax_back + "元");
                //total_c = chdPrice + _Order.jj + _Order.tax + _Order.bxjg + chdPrice_back + _Order.jj_back + _Order.tax_back;
                total_c = chdPrice + _Order.bxjg + chdPrice_back;
                if (bxNum > 1) {
                    obj.eq(10).find("em").append(" * " + bxNum + "&nbsp;&nbsp;&nbsp;&nbsp;<font style=\"font-size:1.3rem;color:#008ed6\">(往返行程超过2天)</font>");
                    //total_c = chdPrice + _Order.jj + _Order.tax + (_Order.bxjg * bxNum) + chdPrice_back + _Order.jj_back + _Order.tax_back;
                    total_c = chdPrice + (_Order.bxjg * bxNum) + chdPrice_back;
                }

            }

            //obj.eq(7).find("em").append("&nbsp;&nbsp;&nbsp;&nbsp;<font style=\"font-size:1.3rem;color:#008ed6\">(全价的50%)</font>");

            obj.eq(11).find("em").text(total_c + "元 * " + chdNum + "人");
        }

        if (_Order.service_price > 0) {
            $(".PriceList").find(".title").eq(3).find("em").text(_Order.service_price + "元 * " + num + "人");
        }
        obj.eq(15).find("em").text(total + "元");
    },
    getFareInfo: function () {
        var FareInfo = "";
        var FArr = new Array();
        var fn = 0;
        $(".order_Fare .cardadd").each(function () {
            var num = $(this).attr("id").replace("Fare_", "");
            var FareTypeStr = $("#FareType_" + num).val();
            if (FareTypeStr.length > 0) {
                $(this).attr("data-faretype", FareTypeStr);
            }
            var name = $("#FareName_" + num).val();
            var card = $("#FareCard_" + num).val();
            var cardType = $("#CardType_" + num).val();
            var fareType = $(this).attr("data-faretype");
            if (name.length > 0 && card.length > 0) {
                if (fareType == "1") {
                    FArr[fn] = name + "|" + card + "|" + cardType + "|" + fareType + "|" + _Order.price + "|" + _Order.tax + "|" + _Order.jj + "|" + _Order.bxNum + "|" + _Order.cjfbx_remark;
                    if (_F.sType == 2) {
                        FArr[fn] += "|" + _Order.price_back + "|" + _Order.tax_back + "|" + _Order.jj_back;
                    }
                }
                else {
                    FArr[fn] = name + "|" + card + "|" + cardType + "|" + fareType + "|" + _Order.chdPrice + "|" + _Order.tax + "|" + _Order.jj + "|" + _Order.bxNum + "|" + _Order.cjfbx_remark;
                    if (_F.sType == 2) {
                        FArr[fn] += "|" + _Order.chdPrice_back + "|" + _Order.tax_back + "|" + _Order.jj_back;
                    }
                }
                fn++;
            }
        });
        if (fn > 0) {
            FareInfo = FArr.join("@");
        }
        return FareInfo;
    },
    checkFare: function () {
        var cf = true;
        var aduNum = 0;
        var chdNum = 0;
        $(".order_Fare .cardadd").each(function () {
            var num = $(this).attr("id").replace("Fare_", "");
            var FareTypeStr = $("#FareType_" + num).val();
            if (FareTypeStr.length > 0) {
                $(this).attr("data-faretype", FareTypeStr);
            }
            var name = $("#FareName_" + num).val();
            var card = $("#FareCard_" + num).val();
            var cardType = $("#CardType_" + num).val();
            var fareType = $(this).attr("data-faretype");
            if (fareType == 0) {
                cf = false;
                $("#my-actions").modal("close");
                $("#FareType_" + num).popover({
                    content: '请选择乘客类别'
                });
                $("#FareType_" + num).click();
                return false;
            }
            if (name.length == 0) {
                cf = false;
                $("#my-actions").modal("close");
                $("#FareName_" + num).focus();
                return false;
            }
            if (card.length == 0) {
                cf = false;
                $("#my-actions").modal("close");
                $("#FareCard_" + num).focus();
                return false;
            }
            if (fareType == 1) {
                aduNum++;
            }
            if (fareType == 2) {
                chdNum++;
            }
        });
        if (aduNum == 0 && chdNum > 0) {
            cf = false;
            $("#my-actions").modal("close");
            $("#my-alert-ch").modal("open");
            return false;
        }
        return cf;
    },
    getFlihtInfo: function (type) {
        var Fliht = "";
        var fArr = new Array();
        if (type == 1) {
            _F = JSON.parse($.cookie("Trip_select"));
            fArr[0] = _F.flihtNo;
            fArr[1] = _F.sCity;
            fArr[2] = _F.tCity;
            fArr[3] = _F.sCode;
            fArr[4] = _F.tCode;
            fArr[5] = _F.sDate;
            fArr[6] = _F.sTime;
            fArr[7] = _F.tTime;
            fArr[8] = _F.cs;
            fArr[9] = _F.zk;
            fArr[10] = _F.sT;
            fArr[11] = _F.tT;
            fArr[12] = _Order.isHarfPrice;
            Fliht = fArr.join("@");
        }
        else {
            if (_Order.sType == 2) {
                _FBack = JSON.parse($.cookie("Trip_select_back"));
                if (_FBack != null) {
                    fArr[0] = _FBack.flihtNo;
                    fArr[1] = _FBack.sCity;
                    fArr[2] = _FBack.tCity;
                    fArr[3] = _FBack.sCode;
                    fArr[4] = _FBack.tCode;
                    fArr[5] = _FBack.tDate;
                    fArr[6] = _FBack.sTime;
                    fArr[7] = _FBack.tTime;
                    fArr[8] = _FBack.cs;
                    fArr[9] = _FBack.zk;
                    fArr[10] = _FBack.sT;
                    fArr[11] = _FBack.tT;
                    fArr[12] = _Order.isHarfPrice_back;
                    Fliht = fArr.join("@");
                }
            }
        }
        return Fliht;
    },
    doPay: function (no) {
        $.ajax(
        {
            url: _C.ServerUrl,
            context: document.body,
            dataType: "text",
            cache: false,
            data: { fn: 99, uid: _U.uid, orderNo: no, t: new Date() },
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
                                alert("为了给您安排，请尽快支付,如因未支付导致票价变动或者座位取消由您本人承担！");
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


_Order.Init();


