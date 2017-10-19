var _TOrder = {
    allPrice: 0,
    price: 0,
    products: "",
    fid: 0,
    no: "",
    init: function () {
        $("#O_Submit").unbind().bind("click", _TOrder.saveOrder);
        $("#btn_select").click(function () {
            var no = $("#orderNo").val();
            if (no.length > 0) {
                _TOrder.getOrderInfo(no);
            }
            
        });
    },
    getOrderInfo: function (no) {
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 23, id: no, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            _TOrder.no = no;
				            var oi = o.Info;
				            _TOrder.allPrice = oi.allPrice;
				            var obj = $("#infoPanel");
				            obj.find(".x2").find("span").eq(0).html(o.Info.user.flower.fName);
				            obj.find(".x2").find("span").eq(1).html(o.Info.contact + "[" + o.Info.tel + "]");
				            if (o.Info.sendWorkerName != null) {
				                obj.find(".x2").find("span").eq(2).html(o.Info.sendWorkerName + "[" + o.Info.sendWorkerTel + "]");
				            }
				            obj.find(".x2").find("span").eq(3).html(o.Info.allPrice + "元");
				            var template = $("#template").html();
				            var tempHtml = "";
				            if (oi.lp != null) {
				                obj.find(".x9 ul").html("");
				                for (var j = 0; j < oi.lp.length; j++) {
				                    tempHtml = template.replace("{pName}", oi.lp[j].pName);
				                    tempHtml = tempHtml.replace("{pNum}", oi.lp[j].pNum);
				                    tempHtml = tempHtml.replace(/{mPrice}/g, oi.lp[j].price);
				                    tempHtml = tempHtml.replace(/{pId}/g, oi.lp[j].pid);
				                    obj.find(".x9 ul").append(tempHtml);
				                }
				            }
				            $(".border-sub").click(function () {
				                if ($(this).hasClass("icon-check")) {

				                }
				                else {
				                    $(this).parent().find(".button").removeClass("icon-check");
				                    $(this).addClass("icon-check")
				                }
				            });
				            $(".border-main").click(function () {
				                if ($(this).hasClass("icon-check")) {

				                }
				                else {
				                    $(this).parent().find(".button").removeClass("icon-check");
				                    $(this).addClass("icon-check")
				                }
				            });
				            $(".x9").find("input").keyup(function () {
				                var sprice = 0;
				                var obj = $(".x9").find("input");
				                $(obj).each(function (i) {
				                    var pid = $(obj[i]).attr("data-pid");
				                    if ($("#pNum_" + pid).val() > 0) {
				                        sprice += parseInt($("#pNum_" + pid).val()) * parseFloat($("#pNum_" + pid).attr("data-price"));
				                        $("#pName_" + pid).css("color", "red");
				                    }
				                    else {
				                        $("#pName_" + pid).css("color", "black");
				                    }
				                });
				                $("#infoPanel").find(".x2").find("span").eq(3).html(parseFloat(_TOrder.allPrice - sprice).toFixed(1) + "元");
				                _TOrder.price = (_TOrder.allPrice - sprice).toFixed(1);
				            });
				        }
				        else {
				            alert("编号有误！");
				        }
				    }
				}
		);
    },
    saveOrder: function () {
        var updateInfo = "";
        $("#infoPanel").find(".x9 ul").find("li input").each(function () {
            if ($(this).val() > 0) {
                if (typeof ($(this).parent().parent().find(".icon-check").attr("data-type")) == "undefined") {
                    alert("请选择处理方式！");
                    return false;
                }
                else {
                    updateInfo += $(this).attr("data-pid") + "@" + $(this).val() + "@" + $(this).parent().parent().find(".icon-check").attr("data-type") + "@" + $("#reason_" + $(this).attr("data-pid")).val() + ",";
                }
            }
        });
        if (updateInfo.length == 0) {
            alert("请选择退货产品！");
            return false;
        }
        $("#O_Submit").attr("disabled", "disabled");
        $.ajax(
				{ url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 94, price: _TOrder.price, id: _TOrder.no, updateInfo: updateInfo, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            var obj = $("#infoPanel");
				            obj.find(".x2").find("span").html("");
				            obj.find(".x9 ul").html("");
				        }
				        $("#O_Submit").removeAttr("disabled");
				    },
				    complete: function (o) {
				        $("#O_Submit").removeAttr("disabled");
				    }
				}
		);
    }
}