var _Student = {
    srcProvice: "山西省",
    srcCity: "",
    Init: function () {
        _Student.initEvent();
        $("#btn_save").click(_Student.addStudent);
    },
    initEvent: function () {
        var w = window.screen.width;
        var h = window.screen.height;
        var top = parseInt(w / 2)+5;
        h = h - 65;
        //$(".PanelC").css("margin-top", top + "px");
        //$("body").css("background-size", w + "px " + h + "px");

        $("#srcCity").picker({
            title: "选择你所在的地区",
            cols: [
              {
                  textAlign: 'center',
                  values: ['太原市', '大同市', '阳泉市', '晋中市', '长治市', '晋城市', '临汾市', '吕梁市', '运城市', '忻州市', '朔州市']
              }
            ]
        });
        _C.initWx();
    },
    addStudent: function () {
        var srcProvice = _Student.srcProvice;
        var srcCity = $("#srcCity").val();
        var contact = $("#contact").val();
        var memo = $("#memo").val();
        var mobile = $("#mobile").val();
        if (srcCity.length == 0) {
            $.toptip('请选择您所在的城市', 'error');
            return;
        }
        if (contact.length == 0 || mobile.length == 0) {
            $.toptip('请填写完整学生信息，方便后续取得联系', 'error');
            return;
        }
        $.showLoading();
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 215,sType:1,uid: _U.uid, memo: memo, contact: contact, mobile: mobile, srcProvice: srcProvice, srcCity: srcCity,t: new Date() },
				    success: function (o) {
				        $.hideLoading();
				        $.alert(o.Msg, function () {
				            if (o.Return == 0) {
				                //window.location = "c_pm_all.html";
				                $("#srcCity").val("");
				                $("#contact").val("");
				                $("#memo").val("");
				                $("#mobile").val("");
				            }
				        });
				    }
				}
		);
    }
}


_Student.Init();
