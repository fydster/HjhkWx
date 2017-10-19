var _Unit = {
    Default_Page_Size: 100,
    Page_Now: 1,
    pId: 0,
    cId: 0,
    id: 0,
    enable: 0,
    isSubject: 0,
    init: function () {
        var NowDate = new Date().pattern("yyyy-MM-dd");
        //$('#S_DateS').val(NowDate);
        $('#S_DateE').val(NowDate);
        $('#S_DateS').val(NowDate);
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
        _Unit.isSubject = _Init.getParam("isSubject");
        if (_Unit.isSubject == 1) {
            $(".panel-head").find("span").text("[-----团购-----]");
        }
        _Unit.initClass();
        _Unit.getUnitList(1);
        _Unit.initSign();
        $("#btn_Select").click(function () {
            _Unit.getUnitList(1);
        });
        $("#btn_Close").click(function () {
            _Unit.hideUserInfo();
        });
        $("#btn_updateUnit").click(function () {
            _Unit.addUnit();
        });
        $("#jPrice").keyup(function () {
            var jPrice = $("#jPrice").val();
            if (isNaN(jPrice)) {
                alert("必须为数字");
                $("#jPrice").val("0");
                return;
            }
            var mPrice = jPrice * 1.2;
            mPrice = parseFloat(mPrice).toFixed(1);
            $("#mPrice").val(mPrice);
        });
        $("#pName_S").keyup(function () {
            var p = $("#pName_S").val();
            if (p.length > 0) {
                $("#ProductList").find("tr").each(function () {
                    if ($(this).attr("data-name") == "0") {
                        $(this).show();
                    }
                    else {
                        if ($(this).attr("data-name").indexOf(p) > -1) {
                            $(this).show();
                        }
                        else {
                            $(this).hide();
                        }
                    }
                });
            }
            else {
                $("#ProductList").find("tr").show();
            }
        });
    },
    showUnit: function (pid) {
        _Unit.pId = pid;
        _Unit.showUserInfo();
    },
    hideUserInfo: function () {
        $("#tab-UserInfo").removeClass("active").addClass("hidden");
        $("#tab-Li-UserInfo").removeClass("active").addClass("hidden");
        $("#tab-Li-List").removeClass("hidden").addClass("active");
        $("#tab-OrderList").removeClass("hidden").addClass("active");
        $("#panel_add").show();
    },
    delUnit: function (id, unitNo) {
        if (!confirm("确定要删除该批次吗！")) {
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 60, id: id,unitNo:unitNo, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _Unit.getUnitList(1);
				            _Unit.hideUserInfo();
				        }
				    }
				}
		);
    },
    SumPage: function (page) {
        _Unit.getProductList(page);
    },
    addUnit: function () {
        var uNum = $("#uNum").val();
        var jPrice = $("#jPrice").val();
        var mPrice = $("#mPrice").val();
        var uInfo = $("#uInfo").val();
        var uImg = "";
        $("#div_img").find("img").each(function () {
            uImg += $(this).attr("src") + ",";
        });
        var signs = "";
        $("#div_sign").find("span").each(function () {
            if ($(this).hasClass("icon-check")) {
                signs += $(this).attr("value") + ",";
            }
        });
        if (uNum.length == 0 || jPrice.length == 0 || mPrice.length == 0) {
            alert("请填写完整");
            return false;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 15, uNum: uNum,id:_Unit.id, pid: _Unit.pId, jPrice: jPrice, uInfo: escape(uInfo), mPrice: mPrice, uImg: uImg,signs:signs, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            $("#uNum").val("0");
				            $("#jPrice").val("0");
				            $("#mPrice").val("0");
				            $("#uInfo").val("");
				            $("#div_img").html("");
				            $("#div_sign").find("span").removeClass("icon-check");
				            _Unit.getUnitList(_Unit.Page_Now);
				            _Unit.hideUserInfo();
				        }
				    }
				}
		);
    },
    showUpdate:function(id,pid,pInfo){
        //oi.uNum + "@" + oi.pinfo.enable + "@" + oi.uInfo + "@" + oi.uImg + "@" + oi.jPrice + "@" + oi.mPrice
        _Unit.id = id;
        _Unit.pId = pid;
        var pArr = pInfo.split("@");
        $("#uNum").val(pArr[0]);
        $("#jPrice").val(parseFloat(pArr[4]).toFixed(1));
        $("#mPrice").val(parseFloat(pArr[5]).toFixed(1));
        $("#uInfo").val(pArr[2]);
        $("#div_sign").find("span").removeClass("icon-check");
        $("#div_sign").find("span").each(function () {
            if (("," + pArr[6] + ",").indexOf("," + $(this).attr("value") + ",") > -1) {
                $(this).addClass("icon-check");
            }
        });
        var imgs = pArr[3].split(",");
        for (var j = 0; j < imgs.length; j++) {
            if (imgs[j].length > 0) {
                allId++;
                var temp = $("#div_template").html();
                temp = temp.replace("{1}", imgs[j]);
                temp = temp.replace(/{id}/g, allId);
                $("#div_img").append(temp);
                $("#b_delete_" + allId).click(function () {
                    var id = $(this).attr("data-id");
                    $("#img_" + id).remove();
                });
            }
        }
        $("#tab-UserInfo").removeClass("hidden").addClass("active");
        $("#tab-Li-UserInfo").removeClass("hidden").addClass("active");
        $("#tab-Li-List").removeClass("active").addClass("hidden");
        $("#tab-OrderList").removeClass("active");
        $("#panel_add").hide();
    },
    cancelUpdate:function(){
        $("#pName").val("");
        $("#imgUrl").val("");
        $("#pItem").val("");
        _Unit.pId = 0;
        $("#btn_CID").find("span").removeClass("icon-check");
        _Unit.enable = 0;
        $("#enable").removeClass().addClass("icon-square-o");
        $("#btn_addProduct").text("添加产品");
        $("#CancelShow").addClass("hidden");
        $("#div_sign_p").find("span").removeClass("icon-check");
        $(".tab").show();
    },
    showInfo: function (id,text,img) {
        $(window.parent.document.getElementById("info_text")).html(text);
        var imgA = img.split(",");
        $(window.parent.document.getElementById("info_img")).html("");
        for (var i = 0; i < imgA.length; i++) {
            if (imgA[i].length > 0) {
                $(window.parent.document.getElementById("info_img")).append("<img src=\"" + imgA[i] + "\" width=\"400\"/>");
            }
        }
        //$showdialogs();
        $(window.parent.document.getElementById("show_dialog")).click();
    },
    SumPage: function (page) {
        _Unit.getUnitList(page);
    },
    getUnitList: function (page) {
        //_Unit.hideUserInfo();
        _Unit.Page_Now = page;
        var DateS = $("#S_DateS").val();
        var DateE = $("#S_DateE").val();
        var pid = $("#product_id").val();
        var htmlHead = "<tr data-name=\"0\"><th>产品名称</th><th>产品分类</th><th>单位</th><th>状态</th><th>入库</th><th>库存</th><th>进价</th><th>售价</th><th>添加时间</th><th>操作</th></tr>";
        var template = "<tr data-name=\"{pName}\"  class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{10}</td><td>{8}</td><td>{6}</td><td>{7}</td><td>{9}</td><td>{5}</td></tr>";
        var btnTemplate = "<button class=\"button button-small border-sub\" onclick=\"_Unit.showInfo({id},'{text}','{img}');\">详情</button>&nbsp;<button class=\"button button-small border-main\" onclick=\"_Unit.showUpdate({id},{pid},'{uInfo}');\">修改</button>&nbsp;<button class=\"button button-small border-dot\" onclick=\"_Unit.delUnit({id},'{unitNo}');\">删除</button>";
        $("#ProductList").html("载入中......");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 59, DateS: DateS, DateE:DateE,isSubject: _Unit.isSubject, cid: _Unit.cId, pid: pid, page: page, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#ProductList").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", oi.pinfo.pName);
				                tempHtml = tempHtml.replace("{2}", oi.pinfo.cName);
				                tempHtml = tempHtml.replace("{3}", oi.pinfo.pItem);
				                tempHtml = tempHtml.replace("{6}", parseFloat(oi.jPrice).toFixed(1));
				                tempHtml = tempHtml.replace("{7}", parseFloat(oi.mPrice).toFixed(1));
				                tempHtml = tempHtml.replace("{8}", (oi.uNum - oi.sNum));
				                tempHtml = tempHtml.replace("{10}", oi.uNum);
				                tempHtml = tempHtml.replace("{9}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{4}", oi.pinfo.enable.toString().replace("0", "<span class=\"tag bg-gray\">停售</span>").replace("1", "<span class=\"tag bg-green\">在售</span>"));
				                tempHtml = tempHtml.replace("{5}", btnTemplate.replace("{text}", oi.uInfo).replace("{img}", oi.uImg));
				                tempHtml = tempHtml.replace(/{id}/g, oi.id);
				                tempHtml = tempHtml.replace(/{pid}/g, oi.pId);
				                tempHtml = tempHtml.replace(/{uInfo}/g, oi.uNum + "@" + oi.pinfo.enable + "@" + oi.uInfo + "@" + oi.uImg + "@" + oi.jPrice + "@" + oi.mPrice + "@" + oi.signs);
				                tempHtml = tempHtml.replace("{unitNo}", oi.unitNo);
				                tempHtml = tempHtml.replace(/{pName}/g, oi.pinfo.pName);
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#ProductList").append(tempHtml);
				            }
				            _Init.ShowPage(page, o.Msg, "_Unit", _Unit.Default_Page_Size);
				        }
				        else {
				            $("#ProductList").html("无记录");
				            //$("#PagePanel").hide();
				        }
				    }
				}
		);
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
				                    _Unit.cId = $(this).attr("value");
				                    //_Unit.initProduct(_Unit.cId);
				                    _Unit.getUnitList(1);
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
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 58, cid:cid, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#product_id").html("<option value=\"0\">全部产品</option>");
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                $("#product_id").append("<option value=\"" + oi.id + "\">" + oi.pName + "</option>");
				            }
				        }
				        else {
				            $("#product_id").html("<option value=\"0\">全部产品</option>");
				        }
				        $("#product_id").change(function () {
				            _Unit.getUnitList(1);
				        });
				    }
				}
		);
    },
    initSign: function () {
        $("#div_sign").html("");
        $("#div_sign_p").html("");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 14,sType:0, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                $("#div_sign").append("<span class=\"button\" value=\"" + oi.id + "\">" + oi.sName + "</span>&nbsp;&nbsp;");
				                $("#div_sign_p").append("<span class=\"button\" value=\"" + oi.id + "\">" + oi.sName + "</span>&nbsp;&nbsp;");
				            }
				            $("#div_sign").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                    $(this).removeClass("icon-check");
				                }
				                else {
				                    $(this).removeClass("icon-check").addClass("icon-check");
				                }
				            });
				            $("#div_sign_p").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                    $(this).removeClass("icon-check");
				                }
				                else {
				                    $(this).removeClass("icon-check").addClass("icon-check");
				                }
				            });
				        }
				        else {
				            $("#div_sign").html("无可用标签");
				            $("#div_sign_p").html("无可用标签");
				        }
				    }
				}
		);
    }
}