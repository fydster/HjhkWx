var classO;
var _List = {
    id: 0,
    CID: 0,
    Default_Page_Size: 15,
    Page_Now: 1,
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
        //$("#btn_save").click(_AddProduct.addContent);
        $("#btn_cancel").click(_List.hideUserInfo);
        $("#btn_select").click(function () { _List.getList(1); });
        _List.initClass();
    },
    hideUserInfo: function () {
        $("#tab-UserInfo").removeClass("active").addClass("hidden");
        $("#tab-Li-UserInfo").removeClass("active").addClass("hidden");
        $("#tab-Li-List").removeClass("hidden").addClass("active");
        $("#tab-OrderList").removeClass("hidden").addClass("active");
        $("#panel_select").show();
    },
    getCName: function (id) {
        var name = "";
        if (classO != null) {
            for (var i = 0; i < classO.length; i++) {
                var oi = classO[i];
                if (id == oi.id || id == oi.pId) {
                    name = oi.name;
                }
            }
        }
        return name;
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
				    data: { fn: 10, cType: 1, cId: 0, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            classO = o.List;
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                if (oi.pId == 0) {
				                    $("#cId_select").append("<option value=\"" + oi.id + "\">" + oi.name + "</option>");
				                    $("#cId").append("<option value=\"" + oi.id + "\">" + oi.name + "</option>");
				                }
				            }
				            $("#cId_select").change(function () {
				                _List.CID = $(this).val();
				                $("#sId_select").html("<option value=\"\">选择下级分类</option>");
				                $("#select_sid_select").removeClass("hidden").addClass("hidden");
				                if (_List.CID.length > 0) {
				                    _List.getListFS(0);
				                    return;
				                }
				            });

				            $("#cId").change(function () {
				                _List.CID = $(this).val();
				                $("#sId").html("<option value=\"\">选择下级分类</option>");
				                $("#select_sid").removeClass("hidden").addClass("hidden");
				                if (_List.CID.length > 0) {
				                    _AddProduct.SID = 0;
				                    _AddProduct.CID = _List.CID;
				                    _List.getListFS(1);
				                    return;
				                }
				            });
				            _List.getList(1);
				        }
				        else {
				        }
				    }
				}
		);
    },
    getListFS: function (type) {
        if (type == 0) {
            $("#select_sid_select").removeClass("hidden");
            $("#sId_select").html("<option value=\"\">选择下级分类</option>");
        }
        else {
            $("#sId").html("<option value=\"\">选择下级分类</option>");
            $("#select_sid").removeClass("hidden");
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 12, cType: 1, cId: _List.CID, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                if (type == 0) {
				                    $("#sId_select").append("<option value=\"" + oi.id + "\">" + oi.name + "</option>");
				                }
				                else {
				                    $("#sId").append("<option value=\"" + oi.id + "\">" + oi.name + "</option>");
				                }
				            }

				            if (_AddProduct.SID > 0) {
				                $("#sId").val(_AddProduct.SID);
				            }

				            $("#sId").change(function () {
				                var id = $(this).val();
				                if (id > 0) {
				                    _AddProduct.SID = id;
				                }
				            });
				        }
				        else {
				        }
				    }
				}
		);
    },
    Del: function (id, title) {
        if (!confirm("确定要删除产品“" + title + "”吗!")) {
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 51, id: id, title: escape(title), t: new Date() },
				    success: function (o) {
				        //alert(o.Msg);
				        if (o.Return == 0) {
				            _List.getList(_List.Page_Now);
				        }
				    }
				}
		);
    },
    Hot: function (id, isHot) {
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 52, id: id, isHot: isHot, t: new Date() },
				    success: function (o) {
				        //alert(o.Msg);
				        if (o.Return == 0) {
				            _List.getList(_List.Page_Now);
				        }
				    }
				}
		);
    },
    updateC: function (id) {
        _AddProduct.ID = id;
        _AddProduct.getContent(id);
        $("#tab-UserInfo").removeClass("hidden").addClass("active");
        $("#tab-Li-UserInfo").removeClass("hidden").addClass("active");
        $("#tab-Li-List").removeClass("active");
        $("#tab-OrderList").removeClass("active");
        $("#panel_select").hide();
    },
    SumPage: function (page) {
        _List.getList(page);
    },
    getList: function (page) {
        _List.Page_Now = page;
        var htmlHead = "<tr><th width=\"100\">分类</th><th>名称</th><th>描述</th><th width=\"80\">是否推荐</th><th width=\"100\">发布时间</th><th width=\"80\">预览</th><th width=\"210\">操作</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{4}</td><td>{3}</td><td>{5}</td><td>{8}</td><td>{7}</td></tr>";
        var btnTemplate = "<button class=\"button button-small border-main\" onclick=\"_List.updateC({id});\">修改</button>&nbsp;<button class=\"button button-small border-dot\" onclick=\"_List.Del({id},'{title}');\">删除</button>";
        var cId = $("#cId_select").val();
        var sId = $("#sId_select").val();
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        var key = $("#title_select").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 54,page:page, cId: cId, sId: sId, DateS: DateS, DateE: DateE, key: escape(key), t: new Date() },
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
				                var buttonHot = "&nbsp;<button class=\"button button-small border-sub\" onclick=\"_List.Hot(" + oi.id + ",1);\">推荐</button>";
				                if (oi.isHot == 1) {
				                    buttonHot = "&nbsp;<button class=\"button button-small border-sub\" onclick=\"_List.Hot(" + oi.id + ",0);\">取消推荐</button>";
				                }

				                tempHtml = template.replace("{1}", _List.getCName(oi.cId));
				                tempHtml = tempHtml.replace("{2}", oi.title);
				                tempHtml = tempHtml.replace("{3}", oi.isHot.toString().replace("0", "<span class=\"tag\">否</span>").replace("1", "<span class=\"tag bg-main\">是</span>"));
				                tempHtml = tempHtml.replace("{4}", oi.desp);
				                tempHtml = tempHtml.replace("{8}", "<img src=\""+oi.hrefUrl+"\" width=\"80\" />");
				                tempHtml = tempHtml.replace("{5}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
    		                    tempHtml = tempHtml.replace("{7}", btnTemplate.replace(/{id}/g, oi.id).replace(/{title}/g, oi.title) + buttonHot);
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#ListPanel").append(tempHtml);
				            }
				            _Init.ShowPage(page, o.Msg, "_List", _List.Default_Page_Size);
				        }
				        else {
				            $("#ListPanel").html("无记录");
				        }
				    }
				}
		);
    }
}

_List.init();