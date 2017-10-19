var _UserList = {
    Default_Page_Size: 15,
    Page_Now: 1,
    uid: 0,
    CID: 0,
    update_CID: 0,
    ids: "",
    init: function () {
        var NowDate = new Date().pattern("yyyy-MM-dd");
        $('#DateE').val(NowDate);
        $('#DateS').datetimepicker({
            lang: 'ch',
            timepicker: false,
            format: 'Y-m-d',
            formatDate: 'Y-m-d'
        });
        $('#DateE').datetimepicker({
            lang: 'ch',
            timepicker: false,
            format: 'Y-m-d',
            formatDate: 'Y-m-d'
        });

        $("#btn_updateGroup").click(function () {
            $("#btn_updateGroup").hide();
            $("#div_updateGroup").show();
        });

        $("#btn_updateGroup_cancel").click(function () {
            $("#div_updateGroup").hide();
            $("#btn_updateGroup").show();
        });

        $("#btn_updateGroup_save").click(function () {
            _UserList.updateGroup();
        });

        _UserList.initClass();
        _UserList.getUserList(1);
    },
    initClass: function () {
        $("#cId_select").html("<option value=\"\">选择分类</option>");
        $("#cId").html("<option value=\"\">选择分类</option>");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 12, cType: 1, cId: 0, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                $("#cId_select").append("<option value=\"" + oi.id + "\">" + oi.name + "</option>");
				                $("#cId").append("<option value=\"" + oi.id + "\">" + oi.name + "</option>");
				            }
				            $("#cId_select").change(function () {
				                _UserList.CID = $(this).val();
				                $("#sId_select").html("<option value=\"\">选择下级分组</option>");
				                $("#select_sid_select").removeClass("hidden").addClass("hidden");
				                if (_UserList.CID.length > 0) {
				                    _UserList.getListFS(0);
				                    return;
				                }
				            });
				            $("#cId").change(function () {
				                _UserList.CID = $(this).val();
				                _UserList.update_CID = $(this).val();
				                $("#sId").html("<option value=\"\">选择下级分组</option>");
				                $("#select_sid").removeClass("hidden").addClass("hidden");
				                if (_UserList.CID.length > 0) {
				                    _UserList.getListFS(1);
				                    return;
				                }
				            });
				        }
				        else {
				        }
				    }
				}
		);
    },
    getListFS: function (n) {
        if (n == 0) {
            $("#sId_select").html("<option value=\"\">选择下级分组</option>");
        }
        else {
            $("#sId").html("<option value=\"\">选择下级分组</option>");
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 12, cType: 1, cId: _UserList.CID, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            if (n == 0) {
				                $("#select_sid_select").removeClass("hidden");
				            }
				            else {
				                $("#select_sid").removeClass("hidden");
				            }
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                if (n == 0) {
				                    $("#sId_select").append("<option value=\"" + oi.id + "\">" + oi.name + "</option>");
				                }
				                else {
				                    $("#sId").append("<option value=\"" + oi.id + "\">" + oi.name + "</option>");
				                }
				                
				            }
				            $("#sId").change(function () {
				                _UserList.update_CID = $(this).val();
				            });
				        }
				        else {
				        }
				    }
				}
		);
    },
    updateGroup: function () {
        var idsNum = 0;
        var arr = new Array();
        $("span[name='checkItem']").each(function () {
            if ($(this).hasClass("icon-check-square-o")) {
                arr[idsNum] = $(this).attr("title");
                idsNum++;
            }
        });
        if (idsNum == 0) {
            alert("请先选择要修改分组的用户！");
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 22, ids: arr.join(","), cId: _UserList.update_CID, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            $("#div_updateGroup").hide();
				            $("#btn_updateGroup").show();
				            _UserList.getUserList(_UserList.Page_Now);
				        }
				        else {
				        }
				    }
				}
		);
    },
    SumPage: function (page) {
        _UserList.getUserList(page);
    },
    getUserList: function (page) {
        _UserList.Page_Now = page;
        var htmlHead = "<tr><th>头像</th><th>注册日期</th><th>昵称</th><th>区域</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td></tr>";
        var btnTemplate = "<button class=\"button button-small bg-main\" onclick=\"_UserList.uid={uid};_Init.showUserInfo({uid});\">详情</button>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        var Contact = $("#Contact").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 4,page: page, Contact: escape(Contact), DateE: DateE, DateS: DateS,t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#UserList").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            var area = "";
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", "<img class=\"tips\" src=\"" + oi.photoUrl + "\" width=40 height=40 />");
				                tempHtml = tempHtml.replace("{2}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{3}", oi.nickName);
				                tempHtml = tempHtml.replace("{4}", oi.area);
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#UserList").append(tempHtml);
				            }
				            _Init.ShowPage(page, o.Msg, "_UserList", _UserList.Default_Page_Size);
				            //_UserList.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#UserList").html("无记录");
				            $("#PagePanel").hide();
				        }
				    }
				}
		);
    }
}