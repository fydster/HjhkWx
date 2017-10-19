var _Student = {
    isSubscribe: 0,
    isOpenInfo: 0,
    Init: function () {
        _C.initWx();
        _Student.initEvent();
        wx.ready(function () {
            wx.onMenuShareTimeline({
                title: '我参与了2017 首届龙城太原 “小龙人”评选大赛，快来支持我吧！', // 分享标题
                link: 'http://hjhk.edmp.cc/active/vote/toGz.html', // 分享链接
                imgUrl: 'http://hjhk.edmp.cc/active/vote/img/bottom.jpg', // 分享图标
                success: function () {
                },
                cancel: function () {
                }
            });

            wx.onMenuShareAppMessage({
                title: '我参与了2017 首届龙城太原 “小龙人”评选大赛，快来支持我吧！', // 分享标题
                desc: '',
                link: 'http://hjhk.edmp.cc/active/vote/toGz.html', // 分享链接
                imgUrl: 'http://hjhk.edmp.cc/active/vote/img/bottom.jpg', // 分享图标
                success: function () {

                },
                cancel: function () {
                }
            });
        });
    },
    initEvent: function () {
        _Student.GetVoteUser();
    },
    GetVoteUser: function () {
        var template = $("#template").html();
        $.showLoading();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 226, t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        if (o.Return == 0) {
				            var tempHtml = "";
				            var n = 0;
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                n = i % 2;
				                if (i > 99) {
				                    break;
				                }
				                tempHtml = template.replace("{i}", (i+1));
				                tempHtml = tempHtml.replace(/{bNo}/g, oi.bNo);
				                tempHtml = tempHtml.replace("{contact}", oi.contact);
				                tempHtml = tempHtml.replace("{voteNum}", oi.num);
				                $("#Main").append(tempHtml);
				            }
				        }
				    }
				}
		);
    }
}


_Student.Init();
