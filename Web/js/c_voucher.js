var _Voucher = {
    Init: function () {
        //测试完成放开
        _Voucher.InitVoucher();
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

                        $(".bottomBtn").click(function () {
                            window.location = "c_index_home.html";
                        });
                    }
                }

            }
        }
        );
    }
}

