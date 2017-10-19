var _Sign = {
    Default_Page_Size: 100,
    Page_Now: 1,
    sType: 0,
    id: 0,
    enable: 0,
    init: function () {
        $("#btn_CID").find("span").unbind().bind("click", function () {
            if ($(this).hasClass("icon-check")) {
            }
            else {
                $("#btn_CID").find("span").removeClass("icon-check");
                $(this).addClass("icon-check");
                _Sign.sType = $(this).attr("value");
            }
            return;
        });
        $("#btn_addSign").unbind().bind("click", _Sign.addSign);
        _Sign.getSignList(1);
    },
    SumPage: function (page) {
        _Sign.getProductList(page);
    },
    addSign: function () {
        var sName = $("#sName").val();
        var sType = _Sign.sType;
        if (sName.length == 0) {
            alert("请填写完整");
            return false;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 11, id: _Sign.id, sName: escape(sName), sType: sType, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            $("#sName").val("");
				            _Sign.getSignList(1);
				            if (_Sign.id > 0) {
				                _Sign.id = 0;
				                $("#btn_addProduct").text("添加标签");
				                $("#CancelShow").addClass("hidden");
				            }
				        }
				    }
				}
		);
    },
    updateSign: function (sName,id,sType) {
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 11, id: id, sName: escape(sName), sType: sType, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            $("#up_div_" + id).remove();
				            _Sign.id = 0;
				            _Sign.getSignList(_Sign.Page_Now);
				        }
				    }
				}
		);
    },
    delSign: function (id) {
        if (!confirm("确定要删除标签！")) {
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 13, id: id, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _Sign.getSignList(_Sign.Page_Now);
				        }
				    }
				}
		);
    },
    showUpdate: function (id, sName,sType) {
        $("#ProductList").find("tr td div").remove();
        var temp = $("#updateDemo").html();
        _Sign.id = id;
        temp = temp.replace("{value}", sName);
        temp = temp.replace("{sType}", sType);
        temp = temp.replace(/{id}/g, id);
        $("#up_" + id).append(temp);
        $("#btn_Cancel").unbind().bind("click", _Sign.cancelUpdate);
        $("#btn_UpdateSign").click(function () {
            var sName = $("#sName_" + id).val();
            var sType = $(this).attr("data-sType");
            if (sName.length == 0) {
                alert("请填写完整");
                return false;
            }
            _Sign.updateSign(sName,id,sType);
        });
    },
    cancelUpdate:function(){
        $("#up_div_" + _Sign.id).remove();
        _Sign.id = 0;
    },
    getSignList: function (page) {
        _Sign.Page_Now = page;
        var htmlHead = "<tr><th>标签名称</th><th width=\"100\">分类</th><th width=\"120\">操作</th></tr>";
        var template = "<tr class=\"{c}\"><td id=\"up_{id}\">{1}</td><td>{2}</td><td>{3}</td></tr>";
        var btnTemplate = "<button class=\"button button-small bg-main\" onclick=\"_Sign.showUpdate({id},'{sName}',{sType});\">修改</button>&nbsp;&nbsp;<button class=\"button button-small bg-dot\" onclick=\"_Sign.delSign('{id}');\">删除</button>";
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 12, t: new Date() },
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
				                tempHtml = template.replace("{1}", oi.sName);
				                tempHtml = tempHtml.replace("{2}", oi.sType.toString().replace("0", "产品标签").replace("1", "美容院标签"));
				                tempHtml = tempHtml.replace("{3}", btnTemplate.replace("{sName}", oi.sName).replace(/{id}/g, oi.id).replace("{sType}", oi.sType));
				                tempHtml = tempHtml.replace(/{id}/g, oi.id);
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#ProductList").append(tempHtml);
				            }
				            //_Init.ShowPage(page, o.Msg, "_UserList", _UserList.Default_Page_Size);
				            //_UserList.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#ProductList").html("无记录");
				            //$("#PagePanel").hide();
				        }
				    }
				}
		);
     }
}