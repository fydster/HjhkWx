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

        //_VoteUser.initClass();
        _VoteUser.getUserList(1);
    },
    SumPage: function (page) {
        _VoteUser.getUserList(page);
    },
    getUserList: function (page) {
        _VoteUser.Page_Now = page;
        var htmlHead = "<tr><th>编号</th><th>投票人昵称</th><th>投票人头像</th><th>投票时间</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{4}</td><td>{5}</td></tr>";
        var DateS = $("#DateS").val();
        var DateE = $("#DateE").val();
        var bNo = $("#bNo").val();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 92, page: page,bNo:bNo, DateE: DateE, DateS: DateS, t: new Date() },
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
				                tempHtml = tempHtml.replace("{2}", oi.nickName);
				                tempHtml = tempHtml.replace("{4}", "<img class=\"tips\" src=\"" + oi.photoUrl + "\" width=40 height=40 />");
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