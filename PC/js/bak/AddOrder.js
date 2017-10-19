var _AddOrder = {
    allPrice: 0,
    products: "",
    fid: 0,
    uid: 0,
    init: function () {
        $("#O_Submit").unbind().bind("click", _AddOrder.saveOrder);
        //常用联系人
        $("#tel").keyup(function () {
            var tel = $(this).val();
            if (tel.length == 11) {
                _AddOrder.initAddr(tel);
            }
        });
        $(".icon-minus").click(function () {
            _AddOrder.CountSalePrice(0);
        });
        $(".icon-plus").click(function () {
            _AddOrder.CountSalePrice(1);
        });
        $("#product_id").change(function () {
            $("#pNum").val("0");
        });
        //初始化产品
        _AddOrder.initProduct(0);
        _AddOrder.initClass();
    },
    CountSalePrice: function (type) {
        var pinfo = $("#product_id").val();
        if (pinfo != "0") {
            var pid = pinfo.split("|")[0];
            var price = pinfo.split("|")[1];
            var pname = pinfo.split("|")[2];
            var pNum = $("#pNum").val();
            pNum = parseInt(pNum);
            price = parseFloat(price).toFixed(1);
            if (type == 1) {
                pNum++;
            }
            else {
                pNum--;
            }
            if (pNum < 0) {
                pNum = 0;
            }
            $("#pNum").val(pNum);
            if (pNum > 0) {
                if (typeof ($("#btn_" + pid).html()) == "undefined") {
                    $("#productList").append("<button id=\"btn_" + pid + "\" data-pnum=\"" + pNum + "\" data-price=\"" + price + "\" data-id=\"" + pid + "\" data-name=\"" + pname + "\" class=\"button border-blue\" type=\"button\">" + pname + "[" + pNum + "*" + price + "]&nbsp;&nbsp;<span data-id=\"" + pid + "\" class=\"icon-times\"></span></button>");
                }
                else {
                    $("#btn_" + pid).html(pname + "[" + pNum + "*" + price + "]&nbsp;&nbsp;<span data-id=\"" + pid + "\" class=\"icon-times\"></span>");
                    $("#btn_" + pid).attr("data-pnum", pNum);
                }
            }
            else {
                $("#btn_" + pid).remove();
            }
            $("#productList").find(".icon-times").click(function () {
                var did = $(this).attr("data-id");
                $("#btn_" + did).remove();
                $("#pNum").val("0");
                $("#product_id").val("0");
                _AddOrder.setPrice();
            });
            _AddOrder.setPrice();
        }
        
    },
    setPrice: function () {
        _AddOrder.allPrice = 0;
        $("#productList").find("button").each(function () {
            _AddOrder.allPrice += parseInt($(this).attr("data-pnum")) * parseFloat($(this).attr("data-price"));
        });
        _AddOrder.allPrice = parseFloat(_AddOrder.allPrice).toFixed(1);
        $("#div_price").text(_AddOrder.allPrice + "元");
    },
    initClass: function () {
        $("#btn_CID").html("");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 54, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#btn_CID").append("<span class=\"button icon-check\" value=\"0\">全部</span>&nbsp;&nbsp;");
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                $("#btn_CID").append("<span class=\"button\" value=\"" + oi.id + "\">" + oi.cName + "</span>&nbsp;&nbsp;");
				            }
				            $("#btn_CID").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_CID").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _AddOrder.cId = $(this).attr("value");
				                    _AddOrder.initProduct(_AddOrder.cId);
				                }
				                return;
				            });
				        }
				        else {
				            $("#btn_CID").html("无记录");
				        }
				    }
				}
		);
    },
    initProduct: function (cid) {
        $("#pNum").val("0");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 58, cid: cid, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#product_id").html("<option value=\"0\">全部产品</option>");
				            var pinfo = "";
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                if (oi.unitNo != null) {
				                    if (oi.unitNo.length > 0) {
				                        pinfo = oi.id + "|" + oi.unit.mPrice + "|" + oi.pName;
				                        $("#product_id").append("<option value=\"" + pinfo + "\">" + oi.pName + "</option>");
				                    }
				                }
				            }
				        }
				        else {
				            $("#product_id").html("<option value=\"0\">全部产品</option>");
				        }
				    }
				}
		);
    },
    initAddr: function (tel) {
        $("#addr").html("");
        $("#contact").val("");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 61, tel: tel, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var oi = o.Info;
				            $("#contact").val(oi.contact);
				            $("#addr").val(oi.addr);
				            $("#fName").val(oi.fName);
				            _AddOrder.fid = oi.id;
				            if (o.uInfo != null) {
				                _AddOrder.uid = o.uInfo.id;
				            }
				        }
				    }
				}
		    );
    },
    saveOrder: function () {
        //价格
        var price = _AddOrder.allPrice;
        //用户信息
        var tel = $("#tel").val();
        var contact = $("#contact").val();
        var addr = $("#addr").val();
        var memo = $("#memo").val();

        //产品列表
        var shopping = "";
        var sArr = new Array();
        var s = 0;
        $("#productList").find("button").each(function () {
            sArr[s] = $(this).attr("data-pnum") + "@" + $(this).attr("data-id") + "@" + $(this).attr("data-price") + "@" + $(this).attr("data-name");
            s++;
        });
        if (s > 0) {
            shopping = sArr.join(",");
        }
        if (tel.length == 0 || contact.length == 0) {
            alert("请填写完整用户基本信息！");
            return false;
        }
        if (shopping.length == 0) {
            alert("请选择产品！");
            return false;
        }
        $("#O_Submit").find("span").addClass("icon-refresh rotate");
        $("#O_Submit").attr("disabled", "disabled");
        $.ajax(
				{ url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 20,uid:_AddOrder.uid,fid:_AddOrder.fid , shopping: escape(shopping), memo: escape(memo), addr: escape(addr), contact: escape(contact), tel: tel, price: price,submitCheck: escape(_Init.Title), t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _AddOrder.fid = 0;
				            _AddOrder.uid = 0;
				            $("#productList").html("");
				            $("#contact").val("");
				            $("#tel").val("");
				            $("#addr").val("");
				            $("#memo").val("");
				            $("#pNum").val("0");
				            $("#product_id").val("0");
				            $("#div_price").text("0.0元");
				        }
				        $("#O_Submit").removeAttr("disabled");
				    },
				    complete: function (o) {
				        $("#O_Submit").removeAttr("disabled");
				        $("#O_Submit").find("span").removeClass("icon-refresh rotate");
				    }
				}
		);
    }
}