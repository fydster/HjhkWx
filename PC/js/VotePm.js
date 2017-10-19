var _VoteUser = {
    init: function () {
        _VoteUser.getUserList();
    },
    getUserList: function () {
        $("#PagePanel").hide();
        var htmlHead = "<tr><th>排名</th><th>编号</th><th>票数</th></tr>";
        var template = "<tr class=\"{c}\"><td>{1}</td><td>{2}</td><td>{3}</td></tr>";
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 93, t: new Date() },
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
				                tempHtml = template.replace("{1}", (i + 1));
				                tempHtml = tempHtml.replace("{2}", oi.bNo);
				                tempHtml = tempHtml.replace("{3}", oi.num);
				                tempHtml = tempHtml.replace("{c}", cName);
				                $("#UserList").append(tempHtml);
				            }
				            //_Init.ShowPage(page, o.Msg, "_VoteUser", _VoteUser.Default_Page_Size);
				            //_VoteUser.ShowPage(page, o.Msg);
				        }
				        else {
				            $("#UserList").html("无记录");
				            //
				        }
				    }
				}
		);
    }
}