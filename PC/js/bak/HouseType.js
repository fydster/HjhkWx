var _HouseType = {
    id: 0,
    CommunityId: 0,
    nowCommunityId: 0,
    init: function () {
        $("#btn_add").unbind().bind("click", function () {
            _HouseType.AddHouseType();
        });
        $("#btn_showadd").unbind().bind("click", function () {
            $("#btn_CID_S").find("span").removeClass("icon-check");
            $("#panel_select").removeClass("hidden").addClass("hidden");
            $("#panel_add").removeClass("hidden");
            $(".tab").hide();
        });
        $("#btn_cancel").unbind().bind("click", function () {
            _HouseType.CommunityId = 0;
            _HouseType.id = 0;
            $("#Name").val("");
            $("#Area").val("");
            $("#imgUrl").val("");
            $("#btn_add").text("添加户型");
            $("#btn_cancel").text("取消添加");
            $("#panel_select").removeClass("hidden");
            $("#panel_add").removeClass("hidden").addClass("hidden");
            $(".tab").show();
        });
        _HouseType.InitCommunity();
        _HouseType.getList(_HouseType.nowCommunityId);
    },
    InitCommunity: function () {
        $("#btn_CID").html("<span class=\"button border-sub icon-check\" value=\"0\">全部</span>&nbsp;&nbsp;");
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
				                $("#btn_CID").append("<span class=\"button border-sub\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				                $("#btn_CID_S").append("<span class=\"button border-sub\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				            }
				            $("#btn_CID").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_CID").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _HouseType.nowCommunityId = $(this).attr("value");
				                    _HouseType.getList(_HouseType.nowCommunityId);
				                }
				                return;
				            });
				            $("#btn_CID_S").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_CID_S").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _HouseType.CommunityId = $(this).attr("value");
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
    showInfo: function (id, CommunityId, Name, Area, ImgUrl) {
        $("#btn_CID_S").find("span").removeClass("icon-check");
        $("#btn_CID_S").find("span").each(function () {
            if ($(this).attr("value") == CommunityId) {
                $(this).addClass("icon-check");
            }
        });
        _HouseType.CommunityId = CommunityId;
        _HouseType.id = id;
        $("#Name").val(Name);
        $("#imgUrl").val(ImgUrl);
        $("#Area").val(Area);
        $("#btn_add").text("确认修改");
        $("#panel_select").removeClass("hidden").addClass("hidden");
        $("#panel_add").removeClass("hidden");
        $(".tab").hide();
        $("#btn_cancel").text("取消修改");
    },
    AddHouseType: function () {
        var Name = $("#Name").val();
        var Area = $("#Area").val();
        var ImgUrl = $("#imgUrl").val();
        var CommunityId = _HouseType.CommunityId;
        if (Name.length == 0 || Area.length == 0 || CommunityId == 0) {
            alert("请填写完整后再提交。")
            return;
        }
        if (isNaN(Area)) {
            alert("层数必须为数字");
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 115, Name: escape(Name), Area: Area, CommunityId: CommunityId, ImgUrl: ImgUrl, id: _HouseType.id, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _HouseType.CommunityId = 0;
				            _HouseType.id = 0;
				            $("#Name").val("");
				            $("#Area").val("");
				            $("#imgUrl").val("");
				            $("#btn_add").text("添加户型");
				            $("#btn_cancel").text("取消添加");
				            $("#panel_select").removeClass("hidden");
				            $("#panel_add").removeClass("hidden").addClass("hidden");
				            $(".tab").show();
				            _HouseType.getList(_HouseType.nowCommunityId);
				        }
				    }
				}
		);
    },
    Del: function (id, Name) {
        if (!confirm("确定要删除楼栋“" + Name + "”吗!删除后与楼栋相关的信息将同步失效！")) {
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 114,id:id,Name:escape(Name), t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _HouseType.getList();
				        }
				    }
				}
		);
    },
    getList: function (CommunityId) {
        var htmlHead = "<tr><th width=\"150\">楼盘名称</th><th width=\"150\">户型名称</th><th width=\"100\">户型面积</th><th width=\"100\">户型图</th><th width=\"150\">添加时间</th><th width=\"150\">操作</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td></tr>";
        var btnTemplate = "<button class=\"button button-small border-main\" onclick=\"_HouseType.showInfo({id},{CommunityId},'{Name}',{Area},'{ImgUrl}');\">修改</button>&nbsp;<button class=\"button button-small border-dot\" onclick=\"_HouseType.Del({id},'{Name}');\">删除</button>";
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 113,CommunityId:CommunityId, t: new Date() },
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
				                tempHtml = tempHtml.replace("{2}", oi.Name);
				                tempHtml = tempHtml.replace("{3}", oi.Area);
				                tempHtml = tempHtml.replace("{4}", "<span onclick=\"_HouseType.ShowImg('" + oi.ImgUrl + "');\" class=\"button button-small border-green\">点击查看</span>");
				                tempHtml = tempHtml.replace("{5}", new Date(oi.AddOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{6}", btnTemplate.replace(/{id}/g, oi.Id).replace(/{CommunityId}/g, oi.CommunityId).replace(/{Name}/g, oi.Name).replace(/{Area}/g, oi.Area).replace(/{ImgUrl}/g, oi.ImgUrl));
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#ListPanel").append(tempHtml);
				            }
				            //_Init.ShowPage(page, o.Msg, "_HouseType", _HouseType.Default_Page_Size);
				            //_HouseType.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#ListPanel").html("无记录");
				        }
				    }
				}
		);
    },
    ShowImg: function (imgUrl) {
        window.parent.$("#info_img").html("<img src=\"" + imgUrl + "\"/>");
        window.parent.$("#show_dialog").click();
    }
}