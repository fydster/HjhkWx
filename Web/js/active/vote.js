var _Student = {
    isSubscribe: 1,
    isOpenInfo: 0,
    Init: function () {
        var user = $.cookie("_UserInfo");
        if (user != null && _U.openId.length > 1) {
            _U = JSON.parse(user);
        }
        else {
            var openId = $.cookie("_OpenId");
            if (openId != null && openId.length > 1) {
                _C.setUser(openId);
            }
            else {
                var code = _C.getParam("code");
                if (code.length > 0) {
                    _C.getOpenId(code);
                }
            }
        }

        window.onpopstate = function () {
            if (_Student.isOpenInfo == 1) {
                $('.weui-msg').fadeOut();
            }
        }
        if (_U.openId == null || _U.openId.length == 0) {
            window.location = "http://hjhk.edmp.cc/active/vote/toGz.html";
            return;
        }
        else {
            $("img.lazy").lazyload({ effect: "fadeIn", threshold: 180 });
            $(".box").find(".info").find("span").eq(3).text("--票");
            if (_U.openId.length > 1) {
                _Student.GetUser(_U.openId);
            }
            else {
                var code = _C.getParam("code");
                if (code.length > 0) {
                    _C.getOpenId(code);
                }
                setTimeout(function () {
                    _Student.GetUser(_U.openId);
                }, 2000);
            }
        }
        _Student.initEvent();
    },
    GetUser: function (openId) {
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 7, openId: openId, source: "0000", t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var oi = o.Info;
				            _Student.isSubscribe = oi.isSubscribe;
				            //_U.uid = oi.id;
				            _U.openId = openId;
				            _U.exOpenID = oi.exOpenID;
				            _U.mobile = oi.mobile;
				            _U.contact = oi.contact;
				            _U.uName = oi.nickName;
				            _U.photoUrl = oi.photoUrl;
				            var date = new Date();
				            date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
				            $.cookie("_UserInfo", JSON.stringify(_U), { path: '/', expires: date });
				        }
				    }
				}
		);
    },
    initEvent: function () {
        $(".weui-btn_plain-primary").click(function () {
            _Student.ToVote();
        });
        
        _C.initWx();
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


        $("#toSelect").click(function () {
            var bNo = $("#bNo").val();
            if (bNo.length > 0 && !isNaN(bNo)) {
                $("#Main").find(".box").hide();
                if (bNo.length == 6) {
                    bNo = "0" + bNo;
                }
                if (bNo.length == 5) {
                    bNo = "00" + bNo;
                }
                if (bNo.length == 4) {
                    bNo = "000" + bNo;
                }
                if (bNo.length == 3) {
                    bNo = "0000" + bNo;
                }
                if (bNo.length == 2) {
                    bNo = "00000" + bNo;
                }
                $("#s_" + bNo).show();
            }
            else {
                $("#Main").find(".box").show();
            }
        });
        _Student.GetVoteUser();
    },
    ToVote: function () {
        if (_Student.isSubscribe == 0) {
            $.alert("投票前请先关注山西出行", function () {
                window.location = "http://hjhk.edmp.cc/active/vote/toGz.html";
            });
            return;
        }
        var obj = document.getElementsByName("voteAgree");
        var arr = new Array();
        var n = 0;
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].checked) {
                arr[n] = obj[i].value;
                n++;
            }
        }
        var bNo = arr.join(",");
        if (n == 0) {
            $.toast("至少选择1个候选人", "text");
            return;
        }
        if (n > 3) {
            $.toast("最多选择3个候选人", "text");
            return;
        }
        $.showLoading();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 224, uid: _U.uid, openId: _U.openId, bNo: bNo, t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        if (o.Return < 2) {
				            $.alert(o.Msg);
				        }
				        if (o.Return == 2) {
				            $.alert(o.Msg, function () {
				                window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9d23334360aa6af4&redirect_uri=http%3a%2f%2fhjhk.edmp.cc%2factive%2fvote%2fvote.html&response_type=code&scope=snsapi_base&state=00001wx9d23334360aa6af4#wechat_redirect";
				            });
				        }
				        
				    }
				}
		);
    },
    GetVoteUser: function () {
        var template = $("#template").html();
        //$.showLoading();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 227, uid: _U.uid, openId: _U.openId, t: new Date() },
				    success: function (o) {
				        //$.hideLoading();
				        if (o.Return == 0) {
				            var tempHtml = "";
				            var n = 0;
				            for (var i = 0; i < o.List.length; i++) {
				                var oi = o.List[i];
				                $("#s_" + oi.bNo).find(".info").find("span").eq(3).text(oi.num + "票");
				            }
				        }
				    }
				}
		);
    }
}


_Student.Init();
