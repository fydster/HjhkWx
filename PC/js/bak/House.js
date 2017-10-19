var _House = {
    id: 0,
    CommunityId: 0,
    BuildingId: 0,
    Unit: 0,
    nowCommunityId: 0,
    nowBuildingId: 0,
    nowUnit: 0,
    HouseTypeId: 0,
    init: function () {
        $("#btn_add").unbind().bind("click", function () {
            _House.AddHouse();
        });
        $("#btn_showadd").unbind().bind("click", function () {
            $("#btn_CID_S").find("span").removeClass("icon-check");
            $("#panel_select").removeClass("hidden").addClass("hidden");
            $("#panel_add").removeClass("hidden");
            $(".tab").hide();
        });
        $("#btn_cancel").unbind().bind("click", function () {
            _House.cancelAdd();
        });
        _House.InitCommunity();
        _House.getList(_House.nowCommunityId);
    },
    cancelAdd: function () {
        _House.CommunityId = 0;
        _House.id = 0;
        $("#Name").val("");
        $("#TotalFloor").val("");
        $("#Unit").val("");
        $("#btn_add").text("添加单元");
        $("#btn_cancel").text("取消添加");
        $("#panel_select").removeClass("hidden");
        $("#panel_add").removeClass("hidden").addClass("hidden");
        $(".tab").show();
        _House.getList();
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
				                if (oi.Id == _House.CommunityId) {
				                    $("#btn_CID_S").append("<span class=\"button icon-check\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				                }
				                else {
				                    $("#btn_CID_S").append("<span class=\"button\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				                }
				                
				            }
				            if (_House.CommunityId > 0) {
				                _House.InitBuilding(1,_House.CommunityId);
				                _House.InitHouseType();
				            }
				            $("#btn_CID").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_CID").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _House.nowCommunityId = $(this).attr("value");
				                    if (_House.nowCommunityId == 0) {
				                        $("#div_building").removeClass("hidden").addClass("hidden");
				                    }
				                    else {
				                        _House.InitBuilding(0, _House.nowCommunityId);
				                    }
				                    _House.getList(_House.nowCommunityId);
				                }
				                return;
				            });
				            $("#btn_CID_S").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_CID_S").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _House.CommunityId = $(this).attr("value");
				                    _House.InitBuilding(1, _House.CommunityId);
				                    $("#btn_Unit_S").html("待选择...");
				                    _House.Unit = 0;
				                    _House.BuildingId = 0;
				                    _House.InitHouseType();
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
    InitBuilding: function (type, CommunityId) {
        if (type == 0) {
            $("#btn_BID").html("");
        }
        else {
            $("#btn_BID_S").html("");
        }
        $("#div_building").removeClass("hidden");
        $("#div_Unit").removeClass("hidden").addClass("hidden");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 110, CommunityId: CommunityId, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                if (type == 0) {
				                    $("#btn_BID").append("<span data-unit=\"" + oi.Unit + "\" class=\"button\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				                }
				                else {
				                    if (_House.BuildingId == oi.Id) {
				                        $("#btn_BID_S").append("<span data-unit=\"" + oi.Unit + "\" class=\"button icon-check\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				                    }
				                    else
				                    {
				                        $("#btn_BID_S").append("<span data-unit=\"" + oi.Unit + "\" class=\"button\" value=\"" + oi.Id + "\">" + oi.Name + "</span>&nbsp;&nbsp;");
				                    }
				                }
				            }
				            $("#btn_BID").find("span").unbind().bind("click", function () {
				                $("#div_Unit").removeClass("hidden");
				                if ($(this).hasClass("icon-check")) {
				                }
				                else {
				                    $("#btn_BID").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _House.nowCommunityId = $(this).attr("value");
				                    _House.getList(_House.nowCommunityId);
				                    var Unit = $(this).attr("data-unit");
				                    if (Unit.length > 0) {
				                        $("#btn_Unit").html("");
				                        for (var j = 1; j <= parseInt(Unit) ; j++) {
				                            $("#btn_Unit").append("<span class=\"button\" value=\"" + j + "\">" + j + "单元</span>&nbsp;&nbsp;");
				                        }
				                        $("#btn_Unit").find("span").unbind().bind("click", function () {
				                            if ($(this).hasClass("icon-check")) {
				                            }
				                            else {
				                                $("#btn_Unit").find("span").removeClass("icon-check");
				                                $(this).addClass("icon-check");
				                                _House.nowUnit = $(this).attr("value");
				                                _House.getList();
				                                //btn_Unit
				                            }
				                            return;
				                        });
				                    }
				                }
				                return;
				            });
				            $("#btn_BID_S").find("span").unbind().bind("click", function () {
				                if ($(this).hasClass("icon-check")) {
				                    var Unit = $(this).attr("data-unit");
				                    if (Unit.length > 0) {
				                        $("#btn_Unit_S").html("");
				                        for (var j = 1; j <= parseInt(Unit) ; j++) {
				                            if (_House.Unit == j) {
				                                $("#btn_Unit_S").append("<span class=\"button icon-check\" value=\"" + j + "\">" + j + "单元</span>&nbsp;&nbsp;");
				                            }
				                            else {
				                                $("#btn_Unit_S").append("<span class=\"button\" value=\"" + j + "\">" + j + "单元</span>&nbsp;&nbsp;");
				                            }
				                        }
				                        $("#btn_Unit_S").find("span").unbind().bind("click", function () {
				                            if ($(this).hasClass("icon-check")) {
				                            }
				                            else {
				                                $("#btn_Unit_S").find("span").removeClass("icon-check");
				                                $(this).addClass("icon-check");
				                                _House.Unit = $(this).attr("value");
				                                //btn_Unit
				                            }
				                            return;
				                        });
				                    }
				                }
				                else {
				                    $("#btn_BID_S").find("span").removeClass("icon-check");
				                    $(this).addClass("icon-check");
				                    _House.BuildingId = $(this).attr("value");
				                    var Unit = $(this).attr("data-unit");
				                    if (Unit.length > 0) {
				                        $("#btn_Unit_S").html("");
				                        for (var j = 1; j <= parseInt(Unit) ; j++) {
				                            $("#btn_Unit_S").append("<span class=\"button\" value=\"" + j + "\">" + j + "单元</span>&nbsp;&nbsp;");
				                        }
				                        $("#btn_Unit_S").find("span").unbind().bind("click", function () {
				                            if ($(this).hasClass("icon-check")) {
				                            }
				                            else {
				                                $("#btn_Unit_S").find("span").removeClass("icon-check");
				                                $(this).addClass("icon-check");
				                                _House.Unit = $(this).attr("value");
				                                //btn_Unit
				                            }
				                            return;
				                        });
				                    }
				                    //btn_Unit
				                }
				                return;
				            });
				            if (_House.BuildingId > 0) {
				                $("#btn_BID_S").find(".icon-check").click();
				            }
				        }
				        else {

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
				    data: { fn: 113,CommunityId:_House.CommunityId, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                if (_House.HouseTypeId == oi.Id) {
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
				                    _House.HouseTypeId = $(this).attr("value");
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
    showInfo: function (id, BuildingId, Unit, HouseTypeId, House, CommunityId) {
        _House.CommunityId = CommunityId;
        _House.BuildingId = BuildingId;
        _House.Unit = Unit;
        _House.id = id;
        _House.HouseTypeId = HouseTypeId;
        _House.InitCommunity();
        $("#House").val(House);
        $("#btn_add").text("确认修改");
        $("#panel_select").removeClass("hidden").addClass("hidden");
        $("#panel_add").removeClass("hidden");
        $(".tab").hide();
        $("#btn_cancel").text("取消修改");
    },
    AddHouse: function () {
        var House = $("#House").val();
        if (_House.BuildingId == 0 || _House.Unit == 0 || _House.HouseTypeId == 0 || House.length == 0) {
            alert("请填写完整后再提交。")
            return;
        }
        if (isNaN(House)) {
            alert("几号必须为数字");
            return;
        }
        $("#btn_add").attr("disabled", "disabled");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 118,BuildingId:_House.BuildingId,Unit:_House.Unit,HouseTypeId:_House.HouseTypeId,House:House , id: _House.id, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            if (_House.id > 0) {
				                _House.cancelAdd();
				            }
				            else {
				                $("#House").val("");
				                $("#div_housetype").find(".field").find("span").removeClass("icon-check");
				                _House.HouseTypeId = 0;
				            }
				        }
				        $("#btn_add").removeAttr("disabled");
				    }
				}
		);
    },
    Del: function (id, Name) {
        if (!confirm("确定要删除吗!删除后与该单元相关的信息将同步失效！")) {
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 117,id:id,Name:escape(Name), t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _House.getList();
				        }
				    }
				}
		);
    },
    getList: function () {
        var htmlHead = "<tr><th width=\"150\">楼盘名称</th><th width=\"150\">楼栋名称</th><th width=\"100\">几单元</th><th width=\"100\">几号</th><th width=\"100\">户型名称</th><th width=\"150\">添加时间</th><th width=\"150\">操作</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td></tr>";
        var btnTemplate = "<button class=\"button button-small border-main\" onclick=\"_House.showInfo({id},{BuildingId},'{Unit}',{HouseTypeId},{House},{CommunityId});\">修改</button>&nbsp;<button class=\"button button-small border-dot\" onclick=\"_House.Del({id},'{Name}');\">删除</button>";
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 116,Unit:_House.nowUnit,CommunityId:_House.nowCommunityId,BuildingId:_House.nowBuildingId, t: new Date() },
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
				                tempHtml = tempHtml.replace("{2}", oi.BuildingName);
				                tempHtml = tempHtml.replace("{3}", oi.Unit);
				                tempHtml = tempHtml.replace("{4}", oi.House);
				                tempHtml = tempHtml.replace("{5}", oi.HouseTypeName);
				                tempHtml = tempHtml.replace("{6}", new Date(oi.AddOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{7}", btnTemplate.replace(/{id}/g, oi.Id).replace(/{BuildingId}/g, oi.BuildingId).replace(/{Unit}/g, oi.Unit).replace(/{HouseTypeId}/g, oi.HouseTypeId).replace(/{House}/g, oi.House).replace(/{CommunityId}/g, oi.CommunityId));
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#ListPanel").append(tempHtml);
				            }
				            //_Init.ShowPage(page, o.Msg, "_House", _House.Default_Page_Size);
				            //_House.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#ListPanel").html("无记录");
				        }
				    }
				}
		);
    }
}