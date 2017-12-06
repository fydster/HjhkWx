var _Student = {
    Img_one: "",
    Img_one_src: "",
    Init: function () {
        _C.initWx();
        _Student.initEvent();
        wx.ready(function () {
            /*
            wx.onMenuShareTimeline({
                title: '2017 首届龙城太原 “小龙人”评选大赛！', // 分享标题
                link: 'http://hjhk.edmp.cc/active/vote/ad.html', // 分享链接
                imgUrl: 'http://hjhk.edmp.cc/img/logo.jpg', // 分享图标
                success: function () {
                    //alert("2");
                    //$("#div_img").hide();
                    //window.location = "order_one.html";
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    //alert("3");
                    //$("#div_img").hide();
                    //$("#my-alert").modal('open');
                    // 用户取消分享后执行的回调函数
                }
            });

            wx.onMenuShareAppMessage({
                title: '2017 首届龙城太原 “小龙人”评选大赛！', // 分享标题
                desc: '',
                link: 'http://hjhk.edmp.cc/active/vote/ad.html', // 分享链接
                imgUrl: 'http://hjhk.edmp.cc/img/logo.jpg', // 分享图标
                success: function () {
                    //$("#div_img").hide();
                    //window.location = "order_one.html";
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    //$("#div_img").hide();
                    //$("#my-alert").modal('open');
                    // 用户取消分享后执行的回调函数
                }
            });
            */
        });

    },
    initEvent: function () {
        $(".weui-btn_plain-default").click(function () {
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    if (res.localIds.length == 1) {
                        _Student.Img_one_src = localIds;
                        $("#Img_one").html("<img id=\"Img_one_src\" src=\"" + localIds + "\" style=\"height:140px;margin-left:auto;margin-right:auto;margin-top:5px;\">");
                    }
                }
            });
        });

        $(".weui-btn_primary").click(function () {
            if (_Student.Img_one_src.length == 0) {
                $.alert("请上传照片后再提交");
                return;
            }
            _Student.UploadImg();
        });
    },
    UploadImg: function () {
        var one = "";
        wx.uploadImage({
            localId: _Student.Img_one_src + "",// 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                _Student.Img_one = res.serverId; // 返回图片的服务器端ID
                one = res.serverId;
                _Student.AddVoteUser(one);
            }
        });
    },
    AddVoteUser: function (one) {
        $.showLoading();
        $.ajax(
				{
				    url: "/service/openHandler.ashx",
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { Img_one: _Student.Img_one, t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        if (o.ret == 0) {
				            $("#resultImg").html("<img src='" + o.img_url + "' style='width:100%;'/>");
				        }
				        else {
				            $.alert("提交失败，请上传正面清晰照片" + o.ret);
				        }
				    }
				}
		);
    }
}


_Student.Init();
