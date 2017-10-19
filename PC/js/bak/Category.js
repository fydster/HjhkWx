var _Category = {
    id: 0,
    init: function () {
        $("#btn_add").unbind().bind("click", function () {
            _Category.AddCategory();
        });
        $("#btn_cancel").unbind().bind("click", function () {
            _Category.id = 0;
            $("#Name").val("");
            $("#Params").val("");
            $("#Discount").val("1");
            $("#ChooseMode").val("");
            $("#btn_cancel").removeClass("hidden").addClass("hidden");
            $("#btn_add").text("添加分类");
            $(".tab").show();
        });
        _Category.getList();
    },
    showInfo: function (id,Name,ChooseMode,Discount,Params) {
        $("#Name").val(Name);
        $("#Discount").val(Discount);
        $("#ChooseMode").val(ChooseMode);
        $("#Params").val(Params);
        _Category.id = id;
        $("#btn_cancel").removeClass("hidden");
        $("#btn_add").text("确认修改");
        $(".tab").hide();
    },
    AddCategory: function () {
        var Params = $("#Params").val();
        var Name = $("#Name").val();
        var ChooseMode = $("#ChooseMode").val();
        var Discount = $("#Discount").val();
        if (Name.length == 0 || ChooseMode.length == 0 || Discount.length == 0) {
            alert("请填写完整后再提交。")
            return;
        }
        if (isNaN(Discount)) {
            alert("折扣必须为数字");
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 121, Params:escape(Params), Name: escape(Name), Discount: Discount, ChooseMode: ChooseMode, id: _Category.id, t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _Category.id = 0;
				            $("#Name").val("");
				            $("#Params").val("");
				            $("#Discount").val("1");
				            $("#ChooseMode").val("");
				            $("#btn_cancel").removeClass("hidden").addClass("hidden");
				            $("#btn_add").text("添加分类");
				            _Category.getList();
				            $(".tab").show();
				        }
				    }
				}
		);
    },
    Del: function (id, Name) {
        if (!confirm("确定要删除分类“" + Name + "”吗!删除后与分类相关的信息将同步失效！")) {
            return;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 120,id:id,Name:escape(Name), t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            _Category.getList();
				        }
				    }
				}
		);
    },
    getList: function () {
        var htmlHead = "<tr><th width=\"100\">分类名称</th><th width=\"100\">选择类型</th><th width=\"100\">折扣</th><th width=\"200\">产品参数(不同参数间用竖杠隔开)</th><th width=\"100\">操作</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{5}</td><td>{4}</td></tr>";
        var btnTemplate = "<button class=\"button button-small border-main\" onclick=\"_Category.showInfo({id},'{Name}',{ChooseMode},{Discount},'{Params}');\">修改</button>&nbsp;<button class=\"button button-small border-dot\" onclick=\"_Category.Del({id},'{Name}');\">删除</button>";
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 119, t: new Date() },
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
				                tempHtml = template.replace("{1}", oi.Name);
				                tempHtml = tempHtml.replace("{2}", oi.ChooseMode.toString().replace("1", "多选").replace("2", "单选").replace("3", "套餐"));
				                tempHtml = tempHtml.replace("{3}", oi.Discount.toString().replace("1","全价"));
				                tempHtml = tempHtml.replace("{4}", btnTemplate.replace(/{id}/g, oi.Id).replace(/{Name}/g, oi.Name).replace(/{ChooseMode}/g, oi.ChooseMode).replace(/{Discount}/g, oi.Discount).replace(/{Params}/g, oi.Params));
				                tempHtml = tempHtml.replace("{5}", oi.Params);
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#ListPanel").append(tempHtml);
				            }
				            //_Init.ShowPage(page, o.Msg, "_Category", _Category.Default_Page_Size);
				            //_Category.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#ListPanel").html("无记录");
				        }
				    }
				}
		);
    }
}