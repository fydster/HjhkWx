var _AddProduct = {
    ID: 0,
    CID: 0,
    SID: 0,
    CType: 0,
    isHref: 0,
    init: function () {
        _AddProduct.ID = _Init.getParam("id");

        if (_AddProduct.ID > 0) {
            _AddProduct.getContent(_AddProduct.ID);
        }
        else {
            _AddProduct.getList(0);
        }
        _AddProduct.initEvent();

        $("#isHref").click(function () {
            if (document.getElementById("isHref").checked) {
                _AddProduct.isHref = 1;
                $(".tab-nav").find("li").eq(1).addClass("hidden");
                $(".tab-nav").find("li").eq(2).find("a").text("详情");
                $(".tab-nav").find("li").eq(3).addClass("hidden");
                $(".tab-nav").find("li").eq(4).addClass("hidden");
            }
            else {
                _AddProduct.isHref = 0;
                $(".tab-nav").find("li").eq(1).removeClass("hidden");
                $(".tab-nav").find("li").eq(3).removeClass("hidden");
                $(".tab-nav").find("li").eq(2).find("a").text("产品特色");
                $(".tab-nav").find("li").eq(4).removeClass("hidden");
            }
        })
        
    },
    initEvent: function () {
        $("#btn_save").click(_AddProduct.addContent);
    },
    getList: function () {
        $("#cId").html("<option value=\"\">选择分类</option>");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 12, cType: 1,cId:0, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                if (_AddProduct.CID == oi.id) {
				                    $("#cId").append("<option value=\"" + oi.id + "\" selected=\"selected\">" + oi.name + "</option>");
				                }
				                else {
				                    $("#cId").append("<option value=\"" + oi.id + "\">" + oi.name + "</option>");
				                }
				            }
				            $("#cId").change(function () {
				                _AddProduct.CID = $(this).val();
				                $("#sId").html("<option value=\"\">选择下级分类</option>");
				                $("#select_sid").removeClass("hidden").addClass("hidden");
				                _AddProduct.SID = 0;
				                if (_AddProduct.CID.length > 0) {
				                    if (_AddProduct.CID == 20) {
				                        //_AddProduct.changeWp(0);
				                    }
				                    else {
				                        //_AddProduct.changeWp(1);
				                    }
				                    _AddProduct.getListFS();
				                    return;
				                }
				            });
				            if (_AddProduct.SID > 0) {
				                _AddProduct.getListFS();
				            }
				        }
				        else {
				        }
				    }
				}
		);
    },
    getListFS: function () {
        $("#sId").html("<option value=\"\">选择下级分类</option>");
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 12, cType: 1, cId: _AddProduct.CID, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#select_sid").removeClass("hidden");
				            $("#sId").html("<option value=\"\">选择下级分类</option>");
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                if (_AddProduct.SID == oi.id) {
				                    $("#sId").append("<option value=\"" + oi.id + "\" selected=\"selected\">" + oi.name + "</option>");
				                }
				                else {
				                    $("#sId").append("<option value=\"" + oi.id + "\">" + oi.name + "</option>");
				                }
				            }
				            $("#sId").change(function () {
				                _AddProduct.CID = $(this).val();
				            });
				        }
				        else {
				        }
				    }
				}
		);
    },
    addContent: function () {
        var cId = _AddProduct.CID;
        if (_AddProduct.SID > 0) {
            cId = _AddProduct.SID;
        }
        var title = $("#title").val();
        var desp = $("#desp").val();
        var imgUrl = $("#imgUrl").val();
        var price = $("#price").val();
        var contents = editor.html();
        var content_xc = editor_xc.html();
        var content_fy = editor_fy.html();
        var content_xz = editor_xz.html();
        var isTj = 0;
        if (document.getElementById("isTj").checked) {
            isTj = 1;
        }
        if (price.length == 0 || isNaN(price)) {
            alert("请正确填写价格！");
            return false;
        }
        if (cId == 0 || cId.length == 0) {
            alert("分类必须选择！");
            return false;
        }
        if (title.length == 0) {
            alert("标题不能为空！");
            return false;
        }
        if (imgUrl.length == 0) {
            alert("图片不能为空！");
            return false;
        }
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    type: "POST",
				    data: { fn: 50, price: price,isHref:_AddProduct.isHref, id: _AddProduct.ID, cId: cId,isTj:isTj,content_xz: escape(content_xz), content_fy: escape(content_fy), content_xc: escape(content_xc), contents: escape(contents), imgUrl: imgUrl, desp: escape(desp), title: escape(title), t: new Date() },
				    success: function (o) {
				        alert(o.Msg);
				        if (o.Return == 0) {
				            $("#cId").val("");
				            $("#select_sid").removeClass("hidden").addClass("hidden");
				            $("#sId").val("");
				            $("#title").val("");
				            $("#desp").val("");
				            $("#imgUrl").val("");
				            $("#price").val("");
				            editor.html("");
				            editor_xc.html("");
				            editor_xz.html("");
				            editor_fy.html("");
				            _AddProduct.isHref = 0;
				            document.getElementById("isHref").checked = false;
				            document.getElementById("isTj").checked = false;
				            try {
				                _List.getList(_List.Page_Now);
				                _List.hideUserInfo();
				            }
				            catch(e){

				            }
				        }
				    }
				}
		);
    },
    getContent: function (id) {
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    type: "POST",
				    data: { fn: 53, id:id, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var oi = o.Info;
				            _AddProduct.CID = oi.cId;
				            if (oi.pId > 0) {
				                _List.CID = oi.pId;
				                $("#cId").val(oi.pId);
				                _AddProduct.SID = oi.cId;
				                _List.getListFS(1);
				            }
				            else {
				                $("#cId").val(oi.cId);
				                _AddProduct.SID = 0;
				                $("#sId").html("<option value=\"\">选择下级分类</option>");
				                $("#select_sid").removeClass("hidden").addClass("hidden");
				            }
				            if (oi.isHref == 1) {
				                _AddProduct.isHref = 1;
				                document.getElementById("isHref").checked = true;
				            }
				            else {
				                _AddProduct.isHref = 0;
				                document.getElementById("isHref").checked = false;
				            }
				            $("#title").val(oi.title);
				            $("#desp").val(oi.desp);
				            $("#price").val(oi.price);
				            $("#imgUrl").val(oi.imgUrl);
				            editor.html(unescape(oi.contents));
				            editor_xc.html(unescape(oi.content_xc));
				            editor_fy.html(unescape(oi.content_fy));
				            editor_xz.html(unescape(oi.content_xz));
				            if (oi.isTj == 1) {
				                document.getElementById("isTj").checked = true;
				            }
				            else {
				                document.getElementById("isTj").checked = false;
				            }
				        }
				    }
				}
		);
    }
}