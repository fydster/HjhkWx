var _Student = {
    srcProvice: "山西省",
    srcCity: "",
    toProvice: "",
    toCity: "",
    Init: function () {
        _C.initWx();
        _Student.initEvent();
        wx.ready(function () {
            //alert("1");
            wx.onMenuShareTimeline({
                title: '山西出行，找个老乡，一起上大学，马上报名！', // 分享标题
                link: 'http://hjhk.edmp.cc/active/student/c_init.html', // 分享链接
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
                title: '山西出行，找个老乡，一起上大学，马上报名！', // 分享标题
                desc: '',
                link: 'http://hjhk.edmp.cc/active/student/c_init.html', // 分享链接
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

        $("#btn_save").click(_Student.addStudent);
    },
    initEvent: function () {
        var w = window.screen.width;
        var h = window.screen.height;
        var top = parseInt(w / 2)+5;
        h = h - 65;
        $(".PanelC").css("margin-top", top + "px");
        $("body").css("background-size", w + "px " + h + "px");

        $("#srcCity").picker({
            title: "选择你所在的地区",
            cols: [
              {
                  textAlign: 'center',
                  values: ['太原市', '大同市', '阳泉市', '晋中市', '长治市', '晋城市', '临汾市', '吕梁市', '运城市', '忻州市', '朔州市']
              }
            ]
        });

        $("#toCity").cityPicker({
            title: "选择你要去上大学的城市",
            showDistrict: false,
            onChange: function (picker, values, displayValues) {
                _Student.toProvice = displayValues.toString().split(",")[0];
                _Student.toCity = displayValues.toString().split(",")[1];
            }
        });
        _C.initWx();
    },
    addStudent: function () {
        var srcProvice = _Student.srcProvice;
        var srcCity = $("#srcCity").val();
        var toProvice = _Student.toProvice;
        var toCity = _Student.toCity;
        var contact = $("#contact").val();
        var colage = $("#colage").val();
        var mobile = $("#mobile").val();
        if (srcCity.length == 0) {
            $.toptip('请选择您所在的城市', 'error');
            return;
        }
        if (toProvice.length == 0 || toCity.length == 0) {
            $.toptip('请选择您上学城市', 'error');
            return;
        }
        $.showLoading();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 215, uid: _U.uid, colage:colage,contact: contact, mobile: mobile, srcProvice: srcProvice, srcCity: srcCity, toCity: toCity, toProvice: toProvice, t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        $.alert(o.Msg, function () {
				            if (o.Return == 0) {
				                window.location = "c_pm_all.html";
				            }
				        });
				    }
				}
		);
    }
}


_Student.Init();
