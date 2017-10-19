var _Student = {
    Img_one: "",
    Img_home: "",
    Img_one_src: "",
    Img_home_src: "",
    Init: function () {
        _C.initWx();
        _Student.initEvent();
        wx.ready(function () {
            //alert("1");
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
        });

    },
    initEvent: function () {
        $(".weui-btn_plain-default").eq(0).click(function () {
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    if (res.localIds.length == 1) {
                        _Student.Img_one_src = localIds;
                        $("#Img_one").html("<img id=\"Img_one_src\" src=\"" + localIds + "\" style=\"height:140px;margin-left:auto;margin-right:auto;margin-top:5px;\">");
                        /*
                        $("#imgList").html("<img id=\"Img_" + _Role.imgNum + "\" src=\"" + localIds + "\" style=\"height:6.5rem;width:6.5rem;margin-left:0.2rem;\" class=\"am-img-thumbnail\">");
                        $("#Img_" + _Role.imgNum).click(function () {
                            if (confirm("确定要删除吗！")) {
                                $(this).remove();
                            }
                        });
                        _C.imgNum++;
                        */
                    }
                }
            });
        });

        $(".weui-btn_plain-default").eq(1).click(function () {
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    if (res.localIds.length == 1) {
                        _Student.Img_home_src = localIds;
                        $("#Img_Home").html("<img id=\"Img_Home_src\" src=\"" + localIds + "\" style=\"height:140px;margin-left:auto;margin-right:auto;margin-top:5px;\">");
                        /*
                        $("#imgList").html("<img id=\"Img_" + _Role.imgNum + "\" src=\"" + localIds + "\" style=\"height:6.5rem;width:6.5rem;margin-left:0.2rem;\" class=\"am-img-thumbnail\">");
                        $("#Img_" + _Role.imgNum).click(function () {
                            if (confirm("确定要删除吗！")) {
                                $(this).remove();
                            }
                        });
                        _C.imgNum++;
                        */
                    }
                }
            });
        });

        $(".weui-btn_primary").click(function () {
            var bNo = $("#bNo").val();
            var Contact = $("#Contact").val();
            var Mobile = $("#Mobile").val();
            if (bNo.length == 0 || Contact.length == 0 || Mobile.length == 0) {
                $.alert("请填写完成后再提交");
                return;
            }
            if (Contact.length < 2) {
                $.alert("请填写正确的姓名");
                return;
            }
            if (!_Student.IsValidMobile(Mobile)) {
                $.alert("请填写正确的手机号码");
                return;
            }
            if (_Student.Img_one_src.length == 0 || _Student.Img_home_src.length == 0) {
                $.alert("请上传照片后再提交");
                return;
            }
            $.alert("确定已填好资料提交报名！", function () {
                _Student.UploadImg();
            })
        });

        $("#bottomMenu").find(".weui-flex__item").eq(0).click(function () {
            window.location = "sign.html";
        });
        $("#bottomMenu").find(".weui-flex__item").eq(1).click(function () {
            window.location = "list.html";
        });
        $("#bottomMenu").find(".weui-flex__item").eq(2).click(function () {
            window.location = "rule.html";
        });
    },
    //判断手机号码是否合法
    IsValidMobile: function (mobile) {
        var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!myreg.test(mobile)) {
            return false;
        }
        else {
            return true;
        }
    },
    UploadImg: function () {
        var one = "";
        var home = "";
        wx.uploadImage({
            localId: _Student.Img_one_src + "",// 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                _Student.Img_one = res.serverId; // 返回图片的服务器端ID
                one = res.serverId;

                wx.uploadImage({
                    localId: _Student.Img_home_src + "",// 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        _Student.Img_home = res.serverId; // 返回图片的服务器端ID
                        home = res.serverId;
                        _Student.AddVoteUser(one,home);
                    }
                });
            }
        });
    },
    AddVoteUser: function (one,home) {
        var bNo = $("#bNo").val();
        var Contact = $("#Contact").val();
        var Mobile = $("#Mobile").val();
        $.showLoading();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 222, uid: _U.uid,openId:_U.openId, bNo: bNo, Contact: Contact, Mobile: Mobile, Img_one: _Student.Img_one, Img_home: _Student.Img_home, t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        $.alert(o.Msg);
				        $("#div_all").hide();
				        $("#div_ok").show();
				    }
				}
		);
    }
}


_Student.Init();
