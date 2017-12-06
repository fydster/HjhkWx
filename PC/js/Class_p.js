var _Class = {
    id: 0,
    ids: "",
    bType: 1,
    sType: 0,
    cType: 1,
    srcName: "分类",
    init: function () {
        var cType = _Init.getParam("cType");
        var srcName = _Init.getParam("srcName");
        if (cType.length > 0) {
            _Class.cType = cType;
        }
        if (srcName.length > 0) {
            _Class.srcName = unescape(srcName);
        }
        $("#btn_add").unbind().bind("click", function () {
            _Class.AddClass();
        });
        $("#btn_add_s").unbind().bind("click", function () {
            _Class.AddClass_s();
        });
        $("#btn_cancel").unbind().bind("click", function () {
            $(".tab").show();
            _Class.id = 0;
            $("#pName").val("");
            $("#isShow").val("0");
            $("#sType").val("0");
            $("#btn_cancel").removeClass("hidden").addClass("hidden");
            $("#btn_add").text("添加一级" + _Class.srcName);
        });
        $("#btn_cancel_s").unbind().bind("click", function () {
            $(".tab").show();
            _Class.id = 0;
            $("#fName").val("");
            $("#fId").val("");
            $("#btn_cancel_s").removeClass("hidden").addClass("hidden");
            $("#btn_add_s").text("添加二级" + _Class.srcName);
        });
        //_Class.initTitle();
        _Class.getList();
    },
    initTitle: function () {
        /*
        $(".panel-head").text(_Class.srcName + "管理");
        $(".form-group").eq(0).find("label").html("一级" + _Class.srcName + "名称&nbsp;");
        $(".form-group").eq(4).find("label").html("所属上级" + _Class.srcName + "&nbsp;");
        $(".form-group").eq(5).find("label").html("二级" + _Class.srcName + "名称&nbsp;");
        $("button").eq(0).text(" 添加一级" + _Class.srcName);
        $("button").eq(2).text(" 添加二级" + _Class.srcName);
        $("#pName").attr("placeholder", "一级" + _Class.srcName + "名称");
        $("#fName").attr("placeholder", "二级" + _Class.srcName + "名称");
        $("#tab-Li-List").find("a").text(_Class.srcName + "列表");
        */
    },
    showInfo: function (id, pName, fId, isShow, sType, logoUrl) {
        $(".tab").hide();
        if (fId > 0) {
            $("#fName").val(pName);
            $("#fId").val(fId);
            $("#btn_cancel_s").removeClass("hidden");
            $("#btn_add_s").text("确认修改");
        }
        else {
            $("#pName").val(pName);
            $("#isShow").val(isShow);
            $("#sType").val(sType);
            $("#logoUrl").val(logoUrl);
            if (isShow == 1) {
                $(".form-group").eq(2).show();
                $(".form-group").eq(3).show();
            }
            $("#btn_cancel").removeClass("hidden");
            $("#btn_add").text("确认修改");
        }
        _Class.id = id;
    },
    AddClass: function () {
        var pName = $("#pName").val();
        var isShow = $("#isShow").val();
        var sType = $("#sType").val();
        var logoUrl = $("#logoUrl").val();
        if (pName.length == 0) {
            alert("请填写完整后再提交。")
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 9, logoUrl:logoUrl,isShow: isShow, sType: sType, Name: escape(pName), cType: _Class.cType, id: _Class.id, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            $("#pName").val("");
				            $("#isShow").val("0");
				            $("#sType").val("0");
				            $("#logoUrl").val("");
				            $(".form-group").eq(2).hide();
				            $(".form-group").eq(3).hide();
				            _Class.id = 0;
				            $("#btn_cancel").removeClass("hidden").addClass("hidden");
				            $("#btn_add").text("添加一级" + _Class.srcName)
				            _Class.getList();
				        }
				    }
				}
		);
    },
    AddClass_s: function () {
        var fId = $("#fId").val();
        var pName = $("#fName").val();
        var logoUrl = $("#logoUrl_f").val();
        if (pName.length == 0 || fId.length == 0) {
            alert("请填写完整后再提交。")
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 9,logoUrl:logoUrl, pId: fId, Name: escape(pName),cType:_Class.cType, id: _Class.id, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            $("#fName").val("");
				            $("#logoUrl_f").val("");
				            $("#fId").val("");
				            _Class.id = 0;
				            $("#btn_cancel_s").removeClass("hidden").addClass("hidden");
				            $("#btn_add_s").text("添加二级" + _Class.srcName);
				            _Class.getList();
				        }
				    }
				}
		);
    },
    Del: function (id, Name) {
        if (!confirm("确定要删除" + _Class.srcName + "“" + Name + "”吗!删除后与" + _Class.srcName + "相关的信息将同步失效！")) {
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 11, id: id, Name: escape(Name), t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _Class.getList();
				        }
				    }
				}
		);
    },
    getList: function () {
        $(".tab").show();
        var htmlHead = "<tr><th width=\"40\">序号</th><th width=\"100\">一级" + _Class.srcName + "名称</th><th width=\"100\">二级" + _Class.srcName + "名称</th><th width=\"150\">操作</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td></tr>";
        var htmlHead_0 = "<tr><th width=\"40\">序号</th><th width=\"100\">一级" + _Class.srcName + "名称</th><th width=\"100\">二级" + _Class.srcName + "名称</th><th width=\"100\">LOGO</th><th width=\"150\">操作</th></tr>";
        var template_0 = "<tr class=\"{c}\"><td title=\"{id}\">{1}</td><td>{2}</td><td>{3}</td><td>{5}</td><td>{6}</td></tr>";
        var btnTemplate = "<button class=\"button button-small border-main\" onclick=\"_Class.showInfo({id},'{pName}',{fId},{isShow},{sType},'{logoUrl}');\">修改</button>&nbsp;<button class=\"button button-small border-dot\" onclick=\"_Class.Del({id},'{pName}');\">删除</button>";
        $("#fId").html("<option value=\"\">选择一级" + _Class.srcName + "</option>");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 10,cType:_Class.cType, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            if (_Class.cType == 0) {
				                $("#ListPanel").html(htmlHead_0);
				            }
				            else {
				                $("#ListPanel").html(htmlHead);
				            }
				            
				            var tempHtml = "";
				            var cName = "current";
				            var n = 1;
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (n % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                if (oi.pId == 0) {
				                    tempHtml = template.replace("{1}", n.toString());
				                    tempHtml = tempHtml.replace("{5}", "<img src=\"" + oi.logoUrl + "\" width=\"60\"\"/>");
				                    tempHtml = tempHtml.replace("{4}", btnTemplate.replace(/{id}/g, oi.id).replace(/{pName}/g, oi.name).replace(/{fId}/g, oi.pId).replace(/{sType}/g, oi.sType).replace(/{isShow}/g, oi.isShow).replace("{logoUrl}", oi.logoUrl));
				                    tempHtml = tempHtml.replace(/{id}/g, oi.id);
				                    tempHtml = tempHtml.replace("{2}", oi.name);
				                    tempHtml = tempHtml.replace("{3}", "--");
				                    
				                    tempHtml = tempHtml.replace("{c}", cName);
				                    $("#ListPanel").append(tempHtml);
				                    n++;
				                    $("#fId").append("<option value=\"" + oi.id + "\">" + oi.name + "</option>");

				                    for (var j = 0; j < o.List.length; j++) {
				                        cName = "current";
				                        if (n % 2 == 1) {
				                            cName = "blue";
				                        }
				                        var oj = o.List[j];
				                        if (oj.pId == oi.id) {
				                            tempHtml = template.replace("{1}", n.toString());
				                            tempHtml = tempHtml.replace("{5}", "<img src=\"" + oj.logoUrl + "\" width=\"60\"\"/>");
				                            tempHtml = tempHtml.replace("{4}", btnTemplate.replace(/{id}/g, oj.id).replace(/{pName}/g, oj.name).replace(/{fId}/g, oj.pId).replace(/{sType}/g, oi.sType).replace(/{isShow}/g, oi.isShow));
				                            tempHtml = tempHtml.replace("{2}", "<span class=\"icon-angle-up\"></span>");
				                            tempHtml = tempHtml.replace("{3}", oj.name);			                            
				                            tempHtml = tempHtml.replace("{c}", cName);
				                            $("#ListPanel").append(tempHtml);
				                            n++;
				                        }
				                    }
				                }

				            }
				        }
				        else {
				            $("#ListPanel").html("无记录");
				        }
				    }
				}
		);
    }
}

_Class.init();