var _Room = {
    id: 0,
    CommunityId: 0,
    nowCommunityId: 0,
    HouseTypeId: 0,
    nowHouseTypeId: 0,
    RoomAreaId: 0,
    init: function () {
        $("#btn_add").unbind().bind("click", function () {
            _Room.AddCommunity();
        });
        $("#btn_showadd").unbind().bind("click", function () {
            $("#btn_CID_S").find("span").removeClass("icon-check");
            $("#panel_select").removeClass("hidden").addClass("hidden");
            $("#panel_add").removeClass("hidden");
            $("#btn_HID_S").html("");
            $(".tab").hide();
        });
        $("#btn_cancel").unbind().bind("click", function () {
            _Room.cancelAdd();
        });
        _Room.InitCommunity();
        _Room.InitRoomArea();
        _Room.getList(_Room.nowCommunityId);
    },
    cancelAdd: function () {
        _Room.CommunityId = 0;
        _Room.id = 0;
        $("#WallpaperArea").val("0");
        $("#btn_HID_S").html("");
        $("#btn_TID_S").find("span").removeClass("icon-check");
        $("#btn_add").text("添加房间");
        $("#btn_cancel").text("取消添加");
        $("#panel_select").removeClass("hidden");
        $("#panel_add").removeClass("hidden").addClass("hidden");
        $(".tab").show();
        _Room.getList();
    },
    InitCommunity: function () {
        $("#btn_CID").html("<span class=\"button icon-check\" value=\"0\">全部</span>&nbsp;&nbsp;");
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
				                $("#btn_CID").append("<span class=\"button\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				                $("#btn_CID_S").append("<span class=\"button\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				            }
				            $("#btn_CID").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_CID").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _Room.nowCommunityId = $(this).attr("value");
				                    _Room.getList();
				                    _Room.InitHouseType();
				                }
				                return;
				            });
				            $("#btn_CID_S").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_CID_S").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _Room.CommunityId = $(this).attr("value");
				                    _Room.nowCommunityId = $(this).attr("value");
				                    _Room.InitHouseType();
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
        $("#btn_HID").html("<span class=\"button icon-check\" value=\"0\">全部</span>&nbsp;&nbsp;");
        $("#btn_HID_S").html("");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 113, CommunityId: _Room.nowCommunityId, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                $("#btn_HID").append("<span class=\"button\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				                if (_Room.HouseTypeId == oi.Id) {
				                    $("#btn_HID_S").append("<span class=\"button icon-check\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				                }
				                else {
				                    $("#btn_HID_S").append("<span class=\"button\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				                }
				                
				            }
				            $("#btn_HID").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_HID").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _Room.nowHouseTypeId = $(this).attr("value");
				                    _Room.getList();
				                }
				                return;
				            });
				            $("#btn_HID_S").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_HID_S").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _Room.HouseTypeId = $(this).attr("value");
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
				                    _Room.RoomAreaId = $(this).attr("value");
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
    showInfo: function (id,CommunityId,HouseType,HaveWindow,NeedWallpaper,WallpaperArea,RoomAreaId) {
        _Room.CommunityId = CommunityId;
        _Room.HouseTypeId = HouseType;
        _Room.RoomAreaId = RoomAreaId;
        _Room.id = id;
        _Room.InitHouseType();
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
        $("#WallpaperArea").val(WallpaperArea);
        $("#NeedWallpaper" + NeedWallpaper).click();
        $("#HaveWindow" + HaveWindow).click();
        $("#btn_add").text("确认修改");
        $("#panel_select").removeClass("hidden").addClass("hidden");
        $("#panel_add").removeClass("hidden");
        $(".tab").hide();
        $("#btn_cancel").text("取消修改");
    },
    AddCommunity: function () {
        var WallpaperArea = $("#WallpaperArea").val();
        var NeedWallpaper = $("input[name='NeedWallpaper']:checked").val();
        var HaveWindow = $("input[name='HaveWindow']:checked").val();
        var HouseTypeId = _Room.HouseTypeId;
        var RoomAreaId = _Room.RoomAreaId;
        if (RoomAreaId == 0 || HouseTypeId == 0) {
            alert("请填写完整后再提交。")
            return;
        }
        if (isNaN(WallpaperArea)) {
            alert("面积必须为数字");
            return;
        }
        $("#btn_add").attr("disabled", "disabled");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 124,RoomAreaId:RoomAreaId, WallpaperArea: WallpaperArea, NeedWallpaper: NeedWallpaper, HaveWindow: HaveWindow, HouseTypeId: HouseTypeId, id: _Room.id, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            if (_Room.id > 0) {
				                _Room.cancelAdd();
				            }
				            else {
				                $("#WallpaperArea").val("0");
				                $("#btn_TID_S").find("span").removeClass("icon-check");
				                _Room.RoomAreaId = 0;
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
				    data: { fn: 123,id:id,Name:escape(Name), t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _Room.getList();
				        }
				    }
				}
		);
    },
    getList: function () {
        var htmlHead = "<tr><th width=\"120\">楼盘名称</th><th width=\"120\">户型名称</th><th width=\"120\">房间功能</th><th width=\"100\">是否需要壁纸</th><th width=\"100\">壁纸面积</th><th width=\"100\">是否有窗户</th><th width=\"150\">添加时间</th><th width=\"150\">操作</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td><td>{8}</td></tr>";
        var btnTemplate = "<button class=\"button button-small border-main\" onclick=\"_Room.showInfo({id},{CommunityId},{HouseType},{HaveWindow},{NeedWallpaper},{WallpaperArea},{RoomAreaId});\">修改</button>&nbsp;<button class=\"button button-small border-dot\" onclick=\"_Room.Del({id},'{Name}');\">删除</button>";
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 122,CommunityId:_Room.nowCommunityId,HouseTypeId:_Room.nowHouseTypeId, t: new Date() },
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
				                tempHtml = tempHtml.replace("{3}", oi.RoomAreaName);
				                tempHtml = tempHtml.replace("{4}", oi.NeedWallpaper.toString().replace("0", "否").replace("1", "是"));
				                tempHtml = tempHtml.replace("{5}", oi.WallpaperArea);
				                tempHtml = tempHtml.replace("{6}", oi.HaveWindow.toString().replace("0", "否").replace("1", "是"));
				                tempHtml = tempHtml.replace("{7}", new Date(oi.AddOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{8}", btnTemplate.replace(/{id}/g, oi.Id).replace(/{CommunityId}/g, oi.CommunityId).replace(/{HouseType}/g, oi.HouseTypeId).replace(/{HaveWindow}/g, oi.HaveWindow).replace(/{NeedWallpaper}/g, oi.NeedWallpaper).replace(/{WallpaperArea}/g, oi.WallpaperArea).replace("{RoomAreaId}", oi.RoomAreaId).replace("{Name}", oi.HouseTypeName + "-" + oi.RoomAreaName));
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#ListPanel").append(tempHtml);
				            }
				            //_Init.ShowPage(page, o.Msg, "_Room", _Room.Default_Page_Size);
				            //_Room.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#ListPanel").html("无记录");
				        }
				    }
				}
		);
    }
}