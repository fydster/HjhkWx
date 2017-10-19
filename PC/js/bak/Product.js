var _Product = {
    id: 0,
    CategoryId: 0,
    nowCategoryId: 0,
    CommunityId: 0,
    HouseTypeId: 0,
    init: function () {
        $("#btn_add").unbind().bind("click", function () {
            _Product.AddProduct();
        });
        $("#btn_showadd").unbind().bind("click", function () {
            $("#btn_CID_S").find("span").removeClass("icon-check");
            $("#panel_select").removeClass("hidden").addClass("hidden");
            $("#panel_add").removeClass("hidden");
            $(".tab").hide();
        });
        $("#btn_cancel").unbind().bind("click", function () {
            _Product.cancelAdd();
        });
        $("#CodeS").keyup(function () {
            var CodeS = $("#CodeS").val();
            _Product.getList();
        });
        _Product.InitCategory();
        _Product.getList();
        _Product.InitCommunity();
    },
    cancelAdd: function () {
        _Product.getList();
        _Product.CategoryId = 0;
        _Product.CommunityId = 0;
        _Product.HouseTypeId = 0;
        _Product.id = 0;
        $("#Code").val("");
        $("#imgUrl").val("");
        $("#div_para").html("");
        $("#div_Community").hide();
        $("#btn_add").text("添加产品");
        $("#btn_cancel").text("取消添加");
        $("#panel_select").removeClass("hidden");
        $("#panel_add").removeClass("hidden").addClass("hidden");
        $(".tab").show();
    },
    InitCommunity: function () {
        $("#btn_ID_S").html("");
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
				                if (oi.Id == _Product.CommunityId) {
				                    $("#btn_ID_S").append("<span class=\"button icon-check\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				                }
				                else {
				                    $("#btn_ID_S").append("<span class=\"button\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				                }

				            }
				            if (_Product.CommunityId > 0) {
				                _Product.InitHouseType();
				            }
				            $("#btn_ID_S").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_ID_S").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _Product.CommunityId = $(this).attr("value");
				                    _Product.InitHouseType();
				                }
				                return;
				            });
				        }
				    }
				}
		);
    },
    InitHouseType: function () {
        $("#div_housetype").find(".field").html("");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 113, CommunityId: _Product.CommunityId, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                if (_Product.HouseTypeId == oi.Id) {
				                    $("#div_housetype").find(".field").append("<span class=\"button icon-check\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				                }
				                else {
				                    $("#div_housetype").find(".field").append("<span class=\"button\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				                }
				            }
				            $("#div_housetype").find(".field").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#div_housetype").find(".field").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _Product.HouseTypeId = $(this).attr("value");
				                }
				                return;
				            });
				        }
				    }
				}
		);
    },
    InitCategory: function () {
        $("#btn_CID").html("<span class=\"button icon-check\" value=\"0\">全部</span>&nbsp;&nbsp;");
        $("#btn_CID_S").html("");
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
				                $("#btn_CID").append("<span data-para=\"" + oi.Params + "\" class=\"button\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				                $("#btn_CID_S").append("<span data-para=\"" + oi.Params + "\"  class=\"button\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				            }
				            $("#btn_CID").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_CID").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _Product.nowCategoryId = $(this).attr("value");
				                    _Product.getList();
				                }
				                return;
				            });
				            $("#btn_CID_S").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_CID_S").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _Product.CategoryId = $(this).attr("value");
				                    $("#div_Community").hide();
				                    if (_Product.CategoryId == 1) {
				                        $("#div_Community").show();
				                    }
				                    var para = $(this).attr("data-para");
				                    $("#div_para").html("--");
				                    if (para.length > 0) {
				                        $("#div_para").html("");
				                        var paraA = para.toString().split("|");
				                        for (var j = 0; j < paraA.length; j++) {
				                            if (paraA[j].indexOf("@") > -1) {
				                                var sl = parseInt(paraA[j].split("@")[1]);
				                                var name = paraA[j].split("@")[0];
				                                for (var n = 0; n < sl; n++) {
				                                    $("#div_para").append(name + "&nbsp;:&nbsp;<input type=\"text\" class=\"input\" name=\"paras\" data-text=\"" + name + "\" size=\"40\" placeholder=\"" + name + "\" /><div style=\"width:100%;margin-bottom:10px;\"></div>");
				                                }
				                            }
				                            else {
				                                $("#div_para").append(paraA[j] + "&nbsp;:&nbsp;<input type=\"text\" class=\"input\" name=\"paras\" data-text=\"" + paraA[j] + "\" size=\"40\" placeholder=\"" + paraA[j] + "\" /><div style=\"width:100%;margin-bottom:10px;\"></div>");
				                            }
				                        }
				                    }
				                }
				                return;
				            });
				        }
				    }
				}
		);
    },
    showInfo: function (id, CategoryId, Code, Params,ImgUrl,CommunityId,HouseTypeId) {
        $("#btn_CID_S").find("span").removeClass("icon-check");
        $("#btn_CID_S").find("span").each(function () {
            if ($(this).attr("value") == CategoryId) {
                $(this).addClass("icon-check");
            }
        });
        $("#div_Community").hide();
        if (CommunityId > 0) {
            $("#div_Community").show();
            $("#btn_ID_S").find("span").removeClass("icon-check");
            $("#btn_ID_S").find("span").each(function () {
                if ($(this).attr("value") == CommunityId) {
                    $(this).addClass("icon-check");
                }
            });
        }
        _Product.CategoryId = CategoryId;
        _Product.CommunityId = CommunityId;
        _Product.HouseTypeId = HouseTypeId;
        if (HouseTypeId > 0) {
            _Product.InitHouseType();
        }
        _Product.id = id;
        if (Params.length > 0) {
            $("#div_para").html("");
            var paraA = Params.toString().split(",");
            for (var j = 0; j < paraA.length; j++) {
                var ps = paraA[j];
                if (ps.length > 0 && ps.indexOf("|") > -1) {
                    $("#div_para").append(ps.split("|")[0] + "&nbsp;:&nbsp;<input type=\"text\" class=\"input\" name=\"paras\" data-text=\"" + ps.split("|")[0] + "\" size=\"40\" value=\"" + ps.split("|")[1] + "\" placeholder=\"" + ps.split("|")[0] + "\" /><div style=\"width:100%;margin-bottom:10px;\"></div>");
                }
            }
        }
        $("#Code").val(Code);
        $("#imgUrl").val(ImgUrl);
        $("#btn_add").text("确认修改");
        $("#panel_select").removeClass("hidden").addClass("hidden");
        $("#panel_add").removeClass("hidden");
        $(".tab").hide();
        $("#btn_cancel").text("取消修改");
    },
    AddProduct: function () {
        var Code = $("#Code").val();
        var imgUrl = $("#imgUrl").val();
        var CategoryId = _Product.CategoryId;
        var Params = "";
        $("input[name='paras']").each(function () {
            Params += $(this).attr("data-text") + "|" + $(this).val() + ",";
        });
        if (Code.length == 0 || CategoryId == 0) {
            alert("请填写完整后再提交。")
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 127,HouseTypeId:_Product.HouseTypeId,imgUrl:imgUrl, Code: escape(Code), CategoryId: CategoryId, Params: escape(Params), id: _Product.id, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            $("#imgUrl").val("");
				            $("#imgUrl").val("");
				            $("input[name='paras']").each(function () {
				                $(this).val("");
				            });
				            if (_Product.id > 0) {
				                _Product.cancelAdd();
				            }
				        }
				    }
				}
		);
    },
    Del: function (id, Name) {
        if (!confirm("确定要删除产品“" + Name + "”吗!删除后与产品相关的信息将同步失效！")) {
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 126, id: id, Name: escape(Name), t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _Product.getList();
				        }
				    }
				}
		);
    },
    getList: function () {
        var htmlHead = "<tr><th width=\"60\">产品分类</th><th width=\"100\">所属户型</th><th width=\"100\">产品名称</th><th width=\"180\">相关属性</th><th width=\"80\">图片</th><th width=\"100\">添加时间</th><th width=\"100\">操作</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{7}</td><td>{2}</td><td>{3}</td><td>{6}</td><td>{4}</td><td>{5}</td></tr>";
        var btnTemplate = "<button class=\"button button-small border-main\" onclick=\"_Product.showInfo({id},{CategoryId},'{Code}','{Params}','{imgUrl}',{CommunityId},{HouseTypeId});\">修改</button>&nbsp;<button class=\"button button-small border-dot\" onclick=\"_Product.Del({id},'{Code}');\">删除</button>";
        var CodeS = $("#CodeS").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 125, CodeS: escape(CodeS), CategoryId: _Product.nowCategoryId, t: new Date() },
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
				                tempHtml = template.replace("{1}", oi.CName);
				                tempHtml = tempHtml.replace("{2}", oi.Code);
				                if (oi.HouseTypeId > 0) {
				                    tempHtml = tempHtml.replace("{7}", oi.CommunityName + "-" + oi.HouseTypeName);
				                }
				                else {
				                    tempHtml = tempHtml.replace("{7}", "通用");
				                }
				                tempHtml = tempHtml.replace("{3}", oi.Params.replace(/\,/g, "<br/>").replace(/\|/g, "："));
				                tempHtml = tempHtml.replace("{6}", "<span onclick=\"_Product.ShowImg('" + oi.ImgUrl + "');\" class=\"button button-small border-green\">点击查看</span>");
				                tempHtml = tempHtml.replace("{4}", new Date(oi.AddOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{5}", btnTemplate.replace(/{id}/g, oi.Id).replace(/{CategoryId}/g, oi.CategoryId).replace(/{Code}/g, oi.Code).replace(/{Params}/g, oi.Params).replace(/{imgUrl}/g, oi.ImgUrl).replace("{CommunityId}", oi.CommunityId).replace("{HouseTypeId}", oi.HouseTypeId));
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#ListPanel").append(tempHtml);
				            }
				            //_Init.ShowPage(page, o.Msg, "_Product", _Product.Default_Page_Size);
				            //_Product.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#ListPanel").html("无记录");
				        }
				    }
				}
		);
    },
    ShowImg: function (imgUrl) {
        window.parent.$("#info_img").html("<img src=\"" + imgUrl + "\" width=\"280\"/>");
        window.parent.$("#show_dialog").click();
    }
}