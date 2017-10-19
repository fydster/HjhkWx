var _Set = {
    price: 0,
    zhekou: 10,
    disCount: 0,
    allPrice: 0,
    s: 1,
    sCity:"",
    tCity:"",
    sCode: "",
    tCode: "",
    sDate: "",
    eDate: "",
    Init: function () {
        setTimeout(function () {
            var user = $.cookie("_UserInfo");
            if (user != null) {
                _U = JSON.parse(user);
            }
            else {
                _C.RedirectUrl("c_role.html", 1, "snsapi_userinfo");
                return;
            }
        }, 500);
        _Set.price = _C.getParam("price");
        _Set.zhekou = _C.getParam("zhekou");
        _Set.sDate = _C.getParam("date");
        _Set.allPrice = _C.getParam("allPrice");
        _Set.s = _C.getParam("s");
        _Set.initSelect();
        _Set.InitDate();
        $(".BigTitle").click(function () {
            $(".btnList").show();
        });
        $(".btnList").find("div span").eq(0).click(function () {
            $(".btnList").hide();
        });
        $(".btnList").find("div span").eq(2).click(function () {
            $(".btnList").hide();
        });
        $("#btn_submit").click(_Set.AddSet);
    },
    InitDate: function () {
        var NowDate = new Date().pattern("yyyy-MM-dd");
        $("#s-datepicker").attr("data-date", _Set.sDate);
        $("#s-datepicker").text(new Date(_Set.sDate).pattern("MM月dd日"));
        var EndDate = _C.dateAdd(_Set.sDate, "D", 3);
        _Set.eDate = new Date(EndDate).pattern("yyyy-MM-dd");
        $("#e-datepicker").attr("data-date", _Set.eDate);
        $("#e-datepicker").text(new Date(_Set.eDate).pattern("MM月dd日"));


        $('#s-datepicker').datepicker({
            onRender: function (date, viewMode) {
                var nowTemp = new Date();
                var nowDay = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0).valueOf();
                var nowMoth = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), 1, 0, 0, 0, 0).valueOf();
                var nowYear = new Date(nowTemp.getFullYear(), 0, 1, 0, 0, 0, 0).valueOf();
                var viewDate = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0).valueOf();
                return date.valueOf() < viewDate ? 'am-disabled' : '';
            }
        }).
          on('changeDate.datepicker.amui', function (event) {
              var d = new Date(event.date).pattern("MM月dd日")
              $("#s-datepicker").text(d);
              $("#s-datepicker").attr("data-date", event.date);
              _Set.gzDate();
          });

        $('#e-datepicker').datepicker({
            onRender: function (date, viewMode) {
                var nowTemp = new Date();
                var nowDay = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0).valueOf();
                var nowMoth = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), 1, 0, 0, 0, 0).valueOf();
                var nowYear = new Date(nowTemp.getFullYear(), 0, 1, 0, 0, 0, 0).valueOf();
                var viewDate = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0).valueOf();
                return date.valueOf() < viewDate ? 'am-disabled' : '';
            }
        }).
          on('changeDate.datepicker.amui', function (event) {
              var d = new Date(event.date).pattern("MM月dd日");
              $("#e-datepicker").text(d);
              $("#e-datepicker").attr("data-date", event.date);
              _Set.gzDate();
          });
    },
    gzDate: function () {
        var sDate = $("#s-datepicker").attr("data-date");
        var eDate = $("#e-datepicker").attr("data-date");
        sDate = new Date(sDate).pattern("yyyy-MM-dd");
        eDate = new Date(eDate).pattern("yyyy-MM-dd");
        var s = _C.dateDiff("D", sDate, eDate);
        if (s < 0) {
            var mDate = sDate;
            sDate = eDate;
            eDate = mDate;
            $("#s-datepicker").attr("data-date",sDate);
            $("#e-datepicker").attr("data-date", eDate);
            $("#s-datepicker").text(new Date(sDate).pattern("MM月dd日"));
            $("#e-datepicker").text(new Date(eDate).pattern("MM月dd日"));

        }
    },
    initSelect: function () {
        if ($.cookie("Trip_select") != null) {
            var Fbj = $("#div_City").find("span");
            _F = JSON.parse($.cookie("Trip_select"));
            Fbj.eq(0).html(_F.sCity);
            Fbj.eq(2).html(_F.tCity);
            _Set.sCity = _F.sCity;
            _Set.tCity = _F.tCity;
            _Set.sCode = _F.sCode;
            _Set.tCode = _F.tCode;
            //Fbj.eq(1).html("全价  " + _Set.allPrice + "元  " + "<br/>当前最低  " + _Set.zhekou + "折   " + _Set.price + "元");
            if (_Set.s == 2) {
                Fbj.eq(0).html(_F.tCity + " - " + _F.sCity);
                _Set.sCity = _F.tCity;
                _Set.tCity = _F.sCity;
                _Set.sCode = _F.tCode;
                _Set.tCode = _F.sCode;
            }

            var Obj = $(".btnList").find("ul");
            for (var i = 0; i < 7; i++) {
                if (i == 3) {
                    Obj.append("<li data-zhekou=\"" + (8 - i) + "\"> 低于" + (8 - i) + "折<em> " + Math.round(((8 - i) * _Set.allPrice) / 100) * 10 + "元</em><span> <i class=\"am-icon-check\"></i></span></li>");
                }
                else {
                    Obj.append("<li data-zhekou=\"" + (8 - i) + "\"> 低于" + (8 - i) + "折<em> " + Math.round(((8 - i) * _Set.allPrice) / 100) * 10 + "元</em><span>&nbsp;&nbsp;&nbsp;&nbsp;</span></li>");
                }
            }

            $(".BigTitle").find("span").html("低于" + _Set.zhekou + "折(￥<em style='color:#ba3987;font-size:2.4rem;font-weight:500;'>" + _Set.price + "</em>)时通知我");

            Obj.find("li").click(function () {
                Obj.find("li span").remove("i").html("&nbsp;&nbsp;&nbsp;&nbsp;");
                $(this).find("span").html(" <i class=\"am-icon-check\"></i>");
                _Set.disCount = $(this).attr("data-zhekou");
                _Set.price = Math.round(parseInt(_Set.allPrice) * parseInt(_Set.disCount) / 100) * 10;
                $(".BigTitle").find("span").html("低于" + _Set.disCount + "折(￥<em style='color:#ba3987;font-size:2.4rem;font-weight:500;'>" + _Set.price + "</em>)时通知我");
                $(".btnList").hide();
            });
        }
        else {
            window.location = "c_index_home.html";
        }
    },
    AddSet: function () {
        var sDate = $("#s-datepicker").attr("data-date");
        var eDate = $("#e-datepicker").attr("data-date");
        sDate = new Date(sDate).pattern("yyyy-MM-dd");
        eDate = new Date(eDate).pattern("yyyy-MM-dd");
        if (_Set.disCount == 0) {
            _C.C_ToCSS("flash", $(".btnList").find("ul").find("button"));
            return;
        }
        $("#my-modal-loading").modal("open");
        $.ajax(
				{
				    url: _C.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 108, uid: _U.uid, sCode: _Set.sCode, tCode: _Set.tCode, sCity: _Set.sCity, tCity: _Set.tCity,lPrice:_Set.price, disCount: _Set.disCount,sDate:sDate,eDate:eDate, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            window.location = "c_set_List.html";
				        }

				    }
				}
		);
    }
}
