var _Package = {
    id: 0,
    CommunityId: 0,
    nowCommunityId: 0,
    nowCategoryId: 0,
    CategoryId: 0,
    HouseTypeId: 0,
    nowHouseTypeId: 0,
    RoomAreaId: 0,
    BrandId: 0,
    RoomAreaId: 0,
    Pids: 0,
    init: function () {
        $("#btn_add").unbind().bind("click", function () {
            _Package.AddPackage();
        });
        $("#btn_showadd").unbind().bind("click", function () {
            $("#btn_CID_S").find("span").removeClass("icon-check");
            $("#panel_select").removeClass("hidden").addClass("hidden");
            $("#panel_add").removeClass("hidden");
            $("#btn_HID_S").html("");
            $(".tab").hide();
        });
        $("#btn_cancel").unbind().bind("click", function () {
            _Package.cancelAdd();
        });
        $("#btn_showProduct").click(function () {
            _Package.getProductList();
        });
        _Package.InitCommunity();
        _Package.InitCategory();
        _Package.getList();
        _Package.InitRoomArea();
        _Package.InitBrand();
    },
    cancelAdd: function () {
        _Package.CommunityId = 0;
        _Package.HouseTypeId = 0;
        _Package.RoomAreaId = 0;
        _Package.BrandId = 0;
        _Package.CategoryId = 0;
        _Package.id = 0;
        _Package.Pids = "";
        $("#pName").val("");
        $("#Price").val("");
        $("#btn_HID_S").html("");
        $("#btn_CID_S").find("span").removeClass("icon-check");
        $("#btn_CateID_S").find("span").removeClass("icon-check");
        $("#btn_TID_S").find("span").removeClass("icon-check");
        $("#btn_BrandID_S").find("span").removeClass("icon-check");
        $("#btn_Product_S").html("");
        $("#btn_add").text("添加套餐");
        $("#btn_cancel").text("取消添加");
        $("#panel_select").removeClass("hidden");
        $("#panel_add").removeClass("hidden").addClass("hidden");
        $(".tab").show();
        _Package.getList();
    },
    InitCommunity: function () {
        $("#btn_CID").html("<option value=\"0\">全部楼盘</option>");
        $("#btn_CID_S").html("");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 101, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                $("#btn_CID").append("<option value=\"" + oi.Id + "\">" + oi.Name + "</option>");
				                $("#btn_CID_S").append("<span class=\"button\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				            }
				            $("#btn_CID").change(function () {
				                _Package.nowCommunityId = $(this).val();
				                _Package.getList();
				                _Package.InitHouseType();
				            });
				            $("#btn_CID_S").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_CID_S").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _Package.CommunityId = $(this).attr("value");
				                    _Package.nowCommunityId = $(this).attr("value");
				                    _Package.InitHouseType();
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
    InitHouseType: function () {
        $("#div_housetype").removeClass("hidden");
        $("#btn_HID").html("<option value=\"0\">全部户型</option>");
        $("#btn_HID_S").html("");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 113, CommunityId: _Package.nowCommunityId, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                $("#btn_HID").append("<option value=\"" + oi.Id + "\">" + oi.Name + "</option>");
				                if (_Package.HouseTypeId == oi.Id) {
				                    $("#btn_HID_S").append("<span class=\"button icon-check\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				                }
				                else {
				                    $("#btn_HID_S").append("<span class=\"button\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				                }
				                
				            }
				            $("#btn_HID").find("span").unbind().bind("click", function () {
				                _Package.nowHouseTypeId = $(this).val();
				                _Package.getList();
				            });
				            $("#btn_HID_S").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_HID_S").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _Package.HouseTypeId = $(this).attr("value");
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
    InitCategory: function () {
        $("#btn_CateID").html("<option value=\"0\">全部分类</option>");
        $("#btn_CateID_S").html("");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 119, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                $("#btn_CateID").append("<option value=\"" + oi.Id + "\">" + oi.Name + "</option>");
				                $("#btn_CateID_S").append("<span data-para=\"" + oi.Params + "\"  class=\"button\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				            }
				            $("#btn_CateID").change(function () {
				                _Package.nowCategoryId = $(this).val();
				                _Package.getList();
				            });
				            $("#btn_CateID_S").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_CateID_S").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _Package.CategoryId = $(this).attr("value");
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
    InitBrand: function () {
        $("#btn_BrandID_S").html("");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 104, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                $("#btn_BrandID_S").append("<span  class=\"button\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				            }
				            $("#btn_BrandID_S").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_BrandID_S").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _Package.BrandId = $(this).attr("value");
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
    InitRoomArea: function () {
        $("#btn_TID_S").html("");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 107, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
                                $("#btn_TID_S").append("<span class=\"button\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				            }
				            $("#btn_TID_S").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_TID_S").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _Package.RoomAreaId = $(this).attr("value");
				                }
				                return;
				            });
				        }
				        else {
				            $("#btn_TID_S").html("无记录");
				        }
				    }
				}
		);
    },
    showInfo: function (id,CommunityId,HouseType,CategoryId,RoomAreaId,BrandId,Price,Pids,Name,PInfo) {
        _Package.CommunityId = CommunityId;
        _Package.HouseTypeId = HouseType;
        _Package.RoomAreaId = RoomAreaId;
        _Package.BrandId = BrandId;
        _Package.CategoryId = CategoryId;
        _Package.id = id;
        _Package.Pids = Pids;
        $("#pName").val(Name);
        $("#Price").val(Price);
        _Package.InitHouseType();
        $("#btn_CID_S").find("span").removeClass("icon-check");
        $("#btn_CID_S").find("span").each(function () {
            if ($(this).attr("value") == CommunityId) {
                $(this).addClass("icon-check");
            }
        });
        $("#btn_TID_S").find("span").each(function () {
            if ($(this).attr("value") == RoomAreaId) {
                $(this).addClass("icon-check");
            }
        });
        $("#btn_CateID_S").find("span").each(function () {
            if ($(this).attr("value") == CategoryId) {
                $(this).addClass("icon-check");
            }
        });
        $("#btn_BrandID_S").find("span").each(function () {
            if ($(this).attr("value") == BrandId) {
                $(this).addClass("icon-check");
            }
        });
        if (Pids.length > 0) {
            var ids = Pids.split(",");
            var names = (","+PInfo).split(",");
            for (var i = 0; i < ids.length; i++) {
                if (ids[i].length > 0) {
                    $("#btn_Product_S").append("&nbsp;&nbsp;<button id=\"btn_" + ids[i] + "\" data-id=\"" + ids[i] + "\" class=\"button border-blue button-small\" type=\"button\">" + names[i] + "&nbsp;&nbsp;<span data-id=\"" + ids[i] + "\" class=\"icon-times\"></span></button>");
                }
            }
            $("#btn_Product_S").find(".icon-times").click(function () {
                if (!confirm("确定要删除吗！")) {
                    return;
                }
                var did = $(this).attr("data-id");
                $("#btn_" + did).remove();
                _Package.initPids();
            });
        }
        $("#btn_add").text("确认修改");
        $("#panel_select").removeClass("hidden").addClass("hidden");
        $("#panel_add").removeClass("hidden");
        $(".tab").hide();
        $("#btn_cancel").text("取消修改");
    },
    AddPackage: function () {
        var CommunityId = _Package.CommunityId;
        var CategoryId = _Package.CategoryId;
        var BrandId = _Package.BrandId;
        var HouseTypeId = _Package.HouseTypeId;
        var RoomAreaId = _Package.RoomAreaId;
        var Name = $("#pName").val();
        var Price = $("#Price").val();
        if (CategoryId == 2) {
            if (Price.length == 0 || _Package.Pids.toString().length == 0) {
                alert("请填写完整后再提交。")
                return;
            }
        }
        else {
            if (CategoryId == 0 || HouseTypeId == 0 || Price.length == 0 || _Package.Pids.toString().length == 0) {
                alert("请填写完整后再提交。")
                return;
            }
        }
        if (isNaN(Price)) {
            alert("价格必须为数字");
            return;
        }
        $("#btn_add").attr("disabled", "disabled");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 130,Pids:_Package.Pids, RoomAreaId: RoomAreaId, CategoryId: CategoryId, HouseTypeId: HouseTypeId, BrandId: BrandId, Name: escape(Name),Price:Price,id: _Package.id, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            $("#pName").val("");
				            $("#btn_Product_S").html("");
				            _Package.Pids = "";
				            $("#Price").val("");
				            if (_Package.id > 0) {
				                _Package.cancelAdd();
				            }
				        }
				        $("#btn_add").removeAttr("disabled");
				    }
				}
		);
    },
    Del: function (id, Name) {
        if (!confirm("确定要删除“" + Name + "”吗!删除后与此相关的信息将同步失效！")) {
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 129,id:id,Name:escape(Name), t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _Package.getList();
				        }
				    }
				}
		);
    },
    getList: function () {
        var htmlHead = "<tr><th width=\"80\">楼盘名称</th><th width=\"100\">户型名称</th><th width=\"80\">分类</th><th width=\"80\">位置</th><th width=\"80\">品牌</th><th width=\"140\">产品</th><th width=\"180\">产品列表</th><th width=\"60\">价格</th><th width=\"90\">添加时间</th><th width=\"120\">操作</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td><td>{10}</td><td>{8}</td><td>{9}</td></tr>";
        var btnTemplate = "<button class=\"button button-small border-main\" onclick=\"_Package.showInfo({id},{CommunityId},{HouseType},{CategoryId},{RoomAreaId},{BrandId},{Price},'{Pids}','{Name}','{PInfo}');\">修改</button>&nbsp;<button class=\"button button-small border-dot\" onclick=\"_Package.Del({id},'{Name}');\">删除</button>";
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 128,CommunityId:_Package.nowCommunityId,HouseTypeId:_Package.nowHouseTypeId,CategoryId:_Package.nowCategoryId, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#ListPanel").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", oi.CommunityName);
				                tempHtml = tempHtml.replace("{2}", oi.HouseTypeName);
				                tempHtml = tempHtml.replace("{3}", oi.CategoryName);
				                tempHtml = tempHtml.replace("{4}", oi.RoomAreaName);
				                tempHtml = tempHtml.replace("{5}", oi.BrandName);
				                tempHtml = tempHtml.replace("{6}", oi.Name);
				                tempHtml = tempHtml.replace("{7}", oi.PidInfo.toString().replace(/,/g,"<br/>"));
				                tempHtml = tempHtml.replace("{10}", oi.Price);
				                tempHtml = tempHtml.replace("{8}", new Date(oi.AddOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{9}", btnTemplate.replace(/{id}/g, oi.Id).replace(/{CommunityId}/g, oi.CommunityId).replace(/{HouseType}/g, oi.HouseTypeId).replace(/{RoomAreaId}/g, oi.RoomAreaId).replace(/{CategoryId}/g, oi.CategoryId).replace(/{BrandId}/g, oi.BrandId).replace("{Price}", oi.Price).replace(/{Name}/g, oi.Name).replace(/{Pids}/g, oi.Pids).replace("{PInfo}",oi.PidInfo));
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#ListPanel").append(tempHtml);
				            }
				            //_Init.ShowPage(page, o.Msg, "_Package", _Package.Default_Page_Size);
				            //_Package.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#ListPanel").html("无记录");
				        }
				    }
				}
		);
    },
    selectProduct: function () {
        var ids = document.getElementsByName("s_pid");
        $("#btn_Product_S").html("");
        var Pids = ",";
        for (var i = 0; i < ids.length; i++){
            if (ids[i].checked) {
                if (Pids.indexOf("," + ids[i].value + ",") == -1) {
                    $("#btn_Product_S").append("&nbsp;&nbsp;<button id=\"btn_" + ids[i].value + "\" data-id=\"" + ids[i].value + "\" class=\"button border-blue button-small\" type=\"button\">" + $("#P_" + ids[i].value).attr("data-code") + "&nbsp;&nbsp;<span data-id=\"" + ids[i].value + "\" class=\"icon-times\"></span></button>");
                    Pids += ids[i].value + ",";
                }
            }
        }
        _Package.Pids = Pids;
        $("#btn_Product_S").find(".icon-times").click(function () {
            if (!confirm("确定要删除吗！")) {
                return;
            }
            var did = $(this).attr("data-id");
            $("#btn_" + did).remove();
            _Package.initPids();
        });
        $('.dialog-close').click();
    },
    initPids: function () {
        Pids = ",";
        $("#btn_Product_S").find("button").each(function () {
            Pids += $(this).attr("data-id") + ",";
        });
        _Package.Pids = Pids;
    },
    getProductList: function () {
        $("#ListProduct").html("");
        var htmlHead = "<tr><th width=\"30\">选择</th><th width=\"160\">型号</th><th width=\"80\">分类</th></tr>";
        var template = "<tr class=\"{c}\"><td><input name=\"s_pid\" id=\"P_{a}\" data-code=\"{code}\" type=\"checkbox\" value=\"{a}\"/></td><td>{2}</td><td>{3}</td></tr>";
        var template_c = "<tr class=\"{c}\"><td><input checked=\"checked\" name=\"s_pid\" id=\"P_{a}\" data-code=\"{code}\" type=\"checkbox\" value=\"{a}\"/></td><td>{2}</td><td>{3}</td></tr>";
        var NameS = $("#NameS").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 125,HouseTypeId:_Package.HouseTypeId, CodeS: escape(NameS), CategoryId: _Package.CategoryId, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#ListProduct").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace(/{a}/g, oi.Id);
				                if (_Package.Pids.toString().indexOf("," + oi.Id + ",") > -1) {
				                    tempHtml = template_c.replace(/{a}/g, oi.Id);
				                }
				                tempHtml = tempHtml.replace("{2}", oi.Code);
				                tempHtml = tempHtml.replace("{code}", oi.Code);
				                tempHtml = tempHtml.replace("{3}", oi.CName);
				                $("#ListProduct").append(tempHtml);
				            }
				            $("#panel_product").click();
				        }
				        else {
				            $("#ListProduct").html("无记录");
				            $("#panel_product").click();
				        }
				    }
				}
		);
    }
}