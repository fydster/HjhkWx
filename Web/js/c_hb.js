var _Role = {
    imgNum: 0,
    src: "",
    Init: function () {
        _Role.initEvent();
        setTimeout(function () {
            if (_U.contact != null && _U.contact.length > 0) {
                $("#input_name").val(_U.contact);
            }
            if (_U.uid != null) {
                _Role.getFire();
            }
        }, 500);
    },
    initEvent: function () {
        $("#btn_pt").click(function () {
            _Role.AddHbBasic(1);
        });
        $("#btn_code").click(function () {
            _Role.AddHbBasic(2);
        });
        $("#upLoadImg").click(function () {
            _Role.UploadImg();
        });
        _C.initWx();
        $("#btn_ShowPic").click(function () {
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    _Role.src = localIds;
                    $("#input_show").attr("placeholder", "已选择");
                }
            });
        });
    },
    UploadImg: function () {
        if (_Role.src.length > 0) {
            wx.uploadImage({
                localId: _Role.src.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    var serverId = res.serverId; // 返回图片的服务器端ID
                    _Role.AddHb(serverId);
                }
            });
        }
        else {
            $.alert('请选择一张照片');
        }
    },
    AddHb: function (serverId) {
        var Content = $("#Content").val();
        var contact = $("#input_name").val();
        if (contact.length == 0) {
            $.toptip('员工姓名必填', 'warning');
            return;
        }
        $.showLoading();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 203,hType:0,uid: _U.uid, serverId: serverId,contact:contact, Content: Content, t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        if (o.Return == 0) {
				            _U.contact = contact;
				            var date = new Date();
				            date.setTime(date.getTime() + (12 * 60 * 60 * 1000)); //12小时过期  
				            $.cookie("_UserInfo", JSON.stringify(_U), { path: '/', expires: date });
				            window.location = "c_hbShow.html?src=" + o.Msg + "&t=" + new Date();
				        }
				    }
				}
		);
    },
    AddHbBasic: function (hType) {
        var contact = $("#input_name").val();
        if (contact.length == 0) {
            $.toptip('员工姓名必填', 'warning');
            return;
        }
        $.showLoading();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 203, hType: hType, uid: _U.uid, contact: contact, t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        if (o.Return == 0) {
				            _U.contact = contact;
				            var date = new Date();
				            date.setTime(date.getTime() + (12 * 60 * 60 * 1000)); //12小时过期  
				            $.cookie("_UserInfo", JSON.stringify(_U), { path: '/', expires: date });
				            window.location = "c_hbShow.html?src=" + o.Msg + "&t=" + new Date();
				        }
				    }
				}
		);
    },
    getFire: function () {
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 205, uid: _U.uid, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            $("#fireNum").text(o.Info);
				        }
				    }
				}
		);
    }
}


_Role.Init();
