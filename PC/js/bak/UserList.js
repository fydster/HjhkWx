var _UserList = {
    Default_Page_Size: 100,
    Page_Now: 1,
    uid: 0,
    init: function () {
        var NowDate = new Date().pattern("yyyy-MM-dd");
        $('#DateS').val(NowDate);
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
        $("#btn_SendVoucher").unbind().bind("click", function () {
            _UserList.SendVoucher();
        });
        _UserList.getUserList(1);
    },
    SendVoucher: function () {
        var uid = _UserList.uid;
        if (confirm("确认要发送代金券吗")) {
            if (uid > 0) {
                $.ajax(
                        {
                            url: _Init.ServerUrl,
                            context: document.body,
                            dataType: "json",
                            cache: false,
                            data: { fn: 45, uid: uid, t: new Date() },
                            success: function (o) {
                                alert(o.Msg);
                            }
                        }
                );
            }
        }
    },
    SumPage: function (page) {
        _UserList.getUserList(page);
    },
    getUserList: function (page) {
        _UserInfo.hideUserInfo();
        _UserList.Page_Now = page;
        var htmlHead = "<tr><th>头像</th><th>注册日期</th><th>昵称</th><th>姓名</th><th>联系电话</th><th>地区</th><th>详情</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td></tr>";
        var btnTemplate = "<button class=\"button button-small bg-main\" onclick=\"_UserList.uid={uid};_Init.showUserInfo({uid});\">详情</button>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        var Mobile = $("#Mobile").val();
        var Contact = $("#Contact").val();
        var State = $("#S_State").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 4, State:State,page: page, Contact: escape(Contact), Mobile: Mobile, DateE: DateE, DateS: DateS, page: page, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#UserList").html(htmlHead);
				            var tempHtml = "";
				            var cName = "current";
				            for (var i = 0; i < o.List.length; i++) {
				                cName = "current";
				                if (i % 2 == 1) {
				                    cName = "blue";
				                }
				                var oi = o.List[i];
				                tempHtml = template.replace("{1}", "<img class=\"tips\" src=\"" + oi.photoUrl + "\" width=40 height=40 />");
				                tempHtml = tempHtml.replace("{2}", new Date(oi.addOn).pattern("yyyy-MM-dd HH:mm"));
				                tempHtml = tempHtml.replace("{3}", oi.nickName);
				                tempHtml = tempHtml.replace("{4}", oi.contact);
				                tempHtml = tempHtml.replace("{5}", oi.mobile);
				                tempHtml = tempHtml.replace("{6}", oi.area);
				                tempHtml = tempHtml.replace("{7}", btnTemplate.replace(/{uid}/g,oi.id));
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