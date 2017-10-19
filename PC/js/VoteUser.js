var _VoteUser = {
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
            _VoteUser.updateGroup();
        });

        //_VoteUser.initClass();
        _VoteUser.getUserList(1);
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
				                _VoteUser.CID = $(this).val();
				                $("#sId_select").html("<option value=\"\">选择下级分组</option>");
				                $("#select_sid_select").removeClass("hidden").addClass("hidden");
				                if (_VoteUser.CID.length > 0) {
				                    _VoteUser.getListFS(0);
				                    return;
				                }
				            });
				            $("#cId").change(function () {
				                _VoteUser.CID = $(this).val();
				                _VoteUser.update_CID = $(this).val();
				                $("#sId").html("<option value=\"\">选择下级分组</option>");
				                $("#select_sid").removeClass("hidden").addClass("hidden");
				                if (_VoteUser.CID.length > 0) {
				                    _VoteUser.getListFS(1);
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
				    data: { fn: 12, cType: 1, cId: _VoteUser.CID, t: new Date() },
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
				                _VoteUser.update_CID = $(this).val();
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
				    data: { fn: 22, ids: arr.join(","), cId: _VoteUser.update_CID, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            $("#div_updateGroup").hide();
				            $("#btn_updateGroup").show();
				            _VoteUser.getUserList(_VoteUser.Page_Now);
				        }
				        else {
				        }
				    }
				}
		);
    },
    SumPage: function (page) {
        _VoteUser.getUserList(page);
    },
    getUserList: function (page) {
        _VoteUser.Page_Now = page;
        var htmlHead = "<tr><th>编号</th><th>姓名</th><th>手机</th><th>照片</th><th>报名时间</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td></tr>";
        var btnTemplate = "<button class=\"button button-small bg-main\" onclick=\"_VoteUser.uid={uid};_Init.showUserInfo({uid});\">详情</button>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        var mobile = $("#mobile").val();
        var bNo = $("#bNo").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 91, page: page,bNo:bNo, mobile: mobile, DateE: DateE, DateS: DateS, t: new Date() },
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
				                tempHtml = template.replace("{1}", oi.bNo);
				                tempHtml = tempHtml.replace("{2}", oi.Contact);
				                tempHtml = tempHtml.replace("{3}", oi.Mobile);
				                tempHtml = tempHtml.replace("{4}", "<img class=\"tips\" src=\"" + oi.Img_one + "\" width=40 height=40 />" + "&nbsp;<img class=\"tips\" src=\"" + oi.Img_home + "\" width=40 height=40 />");
				                //new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm")
				                tempHtml = tempHtml.replace("{5}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#UserList").append(tempHtml);
				            }
				            _Init.ShowPage(page, o.Msg, "_VoteUser", _VoteUser.Default_Page_Size);
				            //_VoteUser.ShowPage(page, o.Msg);
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