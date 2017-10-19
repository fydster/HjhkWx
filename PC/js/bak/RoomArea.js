var _RoomArea = {
    id: 0,
    init: function () {
        $("#btn_add").unbind().bind("click", function () {
            _RoomArea.AddBrand();
        });
        $("#btn_cancel").unbind().bind("click", function () {
            _RoomArea.id = 0;
            $("#Name").val("");
            $("#imgUrl").val("");
            $("#btn_cancel").removeClass("hidden").addClass("hidden");
            $("#btn_add").text("添加房间功能");
            $(".tab").show();
        });
        _RoomArea.getList();
    },
    showInfo: function (id,Name,Logo) {
        $("#Name").val(Name);
        $("#imgUrl").val(Logo);
        _RoomArea.id = id;
        $("#btn_cancel").removeClass("hidden");
        $("#btn_add").text("确认修改");
        $(".tab").hide();
    },
    AddBrand: function () {
        var Name = $("#Name").val();
        var LogoUrl = $("#imgUrl").val();
        if (Name.length == 0) {
            alert("请填写完整后再提交。")
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 109,Name:escape(Name),LogoUrl:LogoUrl,id:_RoomArea.id, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            $("#Name").val("");
				            $("#imgUrl").val("");
				            _RoomArea.id = 0;
				            $("#btn_cancel").removeClass("hidden").addClass("hidden");
				            $("#btn_add").text("添加房间功能")
				            _RoomArea.getList();
				            $(".tab").show();
				        }
				    }
				}
		);
    },
    Del: function (id, Name) {
        if (!confirm("确定要删除房间功能“" + Name + "”吗!删除后与房间功能相关的信息将同步失效！")) {
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 108,id:id,Name:escape(Name), t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _RoomArea.getList();
				        }
				    }
				}
		);
    },
    getList: function () {
        var htmlHead = "<tr><th width=\"150\">房间功能简图</th><th width=\"150\">房间功能名称</th><th width=\"150\">操作</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{4}</td></tr>";
        var btnTemplate = "<button class=\"button button-small border-main\" onclick=\"_RoomArea.showInfo({id},'{Name}','{Logo}');\">修改</button>&nbsp;<button class=\"button button-small border-dot\" onclick=\"_RoomArea.Del({id},'{Name}');\">删除</button>";
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 107, t: new Date() },
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
				                tempHtml = template.replace("{1}", "<img src='"+oi.LogoUrl+"' width='100' />");
				                tempHtml = tempHtml.replace("{2}", oi.Name);
				                tempHtml = tempHtml.replace("{4}", btnTemplate.replace(/{id}/g, oi.Id).replace("{Logo}", oi.LogoUrl).replace(/{Name}/g, oi.Name));
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#ListPanel").append(tempHtml);
				            }
				            //_Init.ShowPage(page, o.Msg, "_RoomArea", _RoomArea.Default_Page_Size);
				            //_RoomArea.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#ListPanel").html("无记录");
				        }
				    }
				}
		);
    }
}