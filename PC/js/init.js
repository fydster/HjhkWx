var _Init = {
    Title: "山西出行-微信后台",
    COOKIE_NAME: "_Mobile",
    BaseUrl: "http://weixin.sxccol.com/wx",
    ServerUrl: "Handler.ashx?mobile_cookie=" + $.cookie("_Mobile"),
    init: function (id) {
        $("#btn_Logout").click(_Init.logout);
        $(".icon-arrow-left").click(_Init.hideMenu);
        try {
            _Init.initNew();
            $("#Login_workNo").after("&nbsp;" + $.cookie("_Name") + "&nbsp;&nbsp;");
        }
        catch (e) { }
    },
    hideMenu: function () {
        $(".x2").hide();
        $(".x10").removeClass().addClass("x12");
        $("#menuControl").html("<span class=\"icon-arrow-right\"></span>&nbsp;显示菜单&nbsp;&nbsp;");
        $("#menuControl").click(_Init.showMenu);
    },
    showMenu: function () {
        $(".x12").removeClass().addClass("x10");
        $(".x2").show();
        $("#menuControl").html("<span class=\"icon-arrow-left\"></span>&nbsp;隐藏菜单&nbsp;&nbsp;");
        $("#menuControl").click(_Init.hideMenu);
    },
    initNew: function () {
        $(".collapse").html("");
        var template_menu = "<li data-name=\"{title}\" data-id=\"{id}\" data-src=\"{limitUrl}\" data-icon=\"icon-{icon}\"><span class=\"icon-{icon}\"></span>&nbsp;{title}</li>";
        var template_more = $("#template_menu").html();
        $.ajax(
				{
				    url: _Init.ServerUrl,
				    context: document.body,
				    dataType: "json",
				    cache: false,
				    data: { fn: 18, t: new Date() },
				    success: function (o) {
				        if (o.Return == 0) {
				            var tempHtml = "";
				            var moreHtml = "";
				            var subMenu = 0;
				            var active = "";
				            var isFirst = 0;
				            for (var i = 0; i < o.List.length; i++) {
				                oi = o.List[i];
				                active = "";
				                if (i == 0) {
				                    active = "active";
				                }
				                if (oi.limitType == 1) {
				                    tempHtml = template_more.replace("{Title}", oi.limitName).replace("{icon}", oi.icon).replace("{active}", active);
				                    subMenu = 0;
				                    moreHtml = "";
				                    for (var j = 0; j < o.List.length; j++) {
				                        oj = o.List[j];
				                        if (oj.limitType == 0) {
				                            if (isFirst == 0) {
				                                $(".tab-nav").html("<li id=\"menuControl\" style=\"cursor:pointer;\" ><span class=\"icon-arrow-left\"></span>&nbsp;隐藏菜单&nbsp;&nbsp;</li>");
				                                $(".tab-nav").append("<li style=\"margin-right:5px;\" id=\"nav_li_" + oj.id + "\" class=\"active now\"><a href=\"#tab-start" + oj.id + "\">" + oj.limitName + "&nbsp;&nbsp;<span class=\"icon-times\"></span></a></li>");
				                                $(".tab-body").html("<div class=\"tab-panel active\" id=\"tab-start" + oj.id + "\"><iframe style=\"width:99%;height:100%;\" src=\"" + oj.limitUrl + "\"></iframe></div>");
				                                $("#menuControl").click(_Init.hideMenu);
				                                isFirst = 1;
				                            }
				                            if (oj.pId == oi.id) {
				                                moreHtml += template_menu.replace(/{title}/g, oj.limitName).replace(/{icon}/, oj.icon).replace("{limitUrl}", oj.limitUrl).replace("{id}", oj.id);
				                                subMenu++;
				                            }
				                        }
				                    }
				                    tempHtml = tempHtml.replace("{menu}", moreHtml);
				                    i = i + subMenu;
				                }
				                $(".collapse").append(tempHtml);
				            }
				            _Init.initEvent();
				        }
				        else {
				            window.location.href = "login.html";
				        }
				    }
				}
		);
    },
    initEvent: function () {
        $('.collapse .panel-head').each(function () {
            var e = $(this);
            e.click(function () {
                e.closest('.collapse').find(".panel").removeClass("active");
                e.closest('.panel').addClass("active");
            });
        });

        var h = window.screen.height;
        //alert(h);
        h = $(window).height();
        //alert(h);
        $("iframe").css("height", h-120 + "px");

        $(".icon-times").click(function () {
            var id = $(this).parent().attr("href");
            $(id).remove();
            $(this).parent().parent().remove();
            $(".tab-nav").find("li").eq(0).addClass("active");
            $(".tab-body").find(".tab-panel").eq(0).addClass("active");
        });

        $(".panel-body").find("ul li").click(function () {
            var id = $(this).attr("data-id");
            var src = $(this).attr("data-src");
            var icon = $(this).attr("data-icon");
            var name = $(this).attr("data-name");
            if (typeof ($("#nav_li_" + id).html()) == "undefined") {
                $(".tab-nav").find("li").removeClass("active").removeClass("now");
                $(".tab-nav").append("<li style=\"margin-right:5px;\" id=\"nav_li_" + id + "\" class=\"active now\"><a href=\"#tab-start" + id + "\">" + name + "&nbsp;&nbsp;&nbsp;<span class=\"icon-times\"></span></a></li>");
                $(".tab-body").find("tab-panel").removeClass("active");
                $(".tab-body").append("<div class=\"tab-panel active\" id=\"tab-start" + id + "\">\<iframe style=\"width:99%;height:100%;\" src=\"" + src + "\"></iframe>\</div>");
                $("iframe").css("height", h - 120 + "px");
                $('.tab .tab-nav li').each(function () {
                    var e = $(this);
                    if (e.attr("id") == "menuControl") {
                        return;
                    }
                    var trigger = e.closest('.tab').attr("data-toggle");
                    if (trigger == "hover") {
                        e.mouseover(function () {
                            $showtabs(e);
                        });
                        e.click(function () {
                            return false;
                        });
                    } else {
                        e.click(function () {
                            $(".tab-nav").find("li").removeClass("active").removeClass("now");
                            $(this).addClass("now");
                            $showtabs(e);
                            return false;
                        });
                    }
                });
            }
            $showtabs($("#nav_li_" + id));
            $(".icon-times").click(function () {
                var id = $(this).parent().attr("href");
                if ($(id).hasClass("active")) {
                    $(".tab-nav").find("li").eq(0).addClass("active").addClass("now");
                    $(".tab-body").find(".tab-panel").eq(0).addClass("active");
                }
                $(id).remove();
                $(this).parent().parent().remove();
            });
        });
    },
    C_ToCSS: function (x, obj) {
        obj.addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass(x + ' animated');
        });
    },
    getParam: function (pname) {
        var aQuery = window.location.href.split("?");
        var avar = "";
        if (aQuery.length > 1) {
            var aBuf = aQuery[1].split("&");
            for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
                var aTmp = aBuf[i].split("="); //分离key与Value
                if (aTmp[0] == pname) {
                    avar = aTmp[1];
                    break;
                }
            }
        }
        return avar;
    },
    login: function () {
        var user = $("#username").val();
        var pass = $("#password").val();
        if (user.length == 0 || pass.length == 0) {
            alert("请填写完整后再提交");
            return false;
        }
        $.ajax(
			        { url: "Handler.ashx",
			            context: document.body,
			            dataType: "json",
			            cache: false,
			            data: { fn: 0, uName: user, uPass: pass, t: new Date() },
			            success: function (o) {
			                if (o.Return == 0) {
			                    var date = new Date();
			                    date.setTime(date.getTime() + (3 * 24 * 60 * 60 * 1000)); //三天后的这个时候过期  
			                    $.cookie("_SourceId", o.Info.sourceId, { path: '/', expires: date });
			                    $.cookie("_Mobile", user, { path: '/', expires: date });
			                    $.cookie("_WorkNo", o.Info.workNo, { path: '/', expires: date });
			                    $.cookie("_Name", o.Info.name, { path: '/', expires: date });
                                //初始化合作SourceID
			                    var partArr = new Array();
			                    var sources = "";
			                    if (o.adminSource != null) {
			                        for (var i = 0; i < o.adminSource.length; i++) {
			                            partArr[i] = o.adminSource[i].sName + "|" + o.adminSource[i].id;
			                        }
			                        if (partArr.length > 0) {
			                            sources = partArr.join(",");
			                        }
			                    }
			                    $.cookie("_Source", sources, { path: '/', expires: date });

			                    window.location.href = "index.html";
			                }
			                else {
			                    alert(o.Msg);
			                }
			            }
			        }
		         );
    },
    logout: function () {
        var mobile = $.cookie("_Mobile");
        $.ajax(
			        { url: "Handler.ashx?mobile=" + mobile,
			            context: document.body,
			            dataType: "json",
			            cache: false,
			            data: { fn: 19, t: new Date() },
			            success: function (o) {
			                $.cookie("_Mobile", null, { path: '/' }); //删除cookie
			                $.cookie("_SourceId", null, { path: '/' }); //删除cookie
			                window.location.href = "login.html";
			            }
			        }
		         );
    },
    //分页
    ShowPage: function (page, total,obj,pageSize) {
        $("#PagePanel").show();
        var pageNum = parseInt(page);
        var allPage = parseInt(parseInt(total) / parseInt(pageSize));
        if (parseInt(total) % parseInt(pageSize) > 0) {
            allPage++;
        }
        $("#allPage").html(allPage);
        $("#allNum").html(total);
        $("#Page_Info").html("");
        $("#Page_Info").append("<li><a href=\"javascript:" + obj + ".SumPage(1);\">首</a></li>");
        if (pageNum > 1) {
            $("#Page_Info").append("<li><a href=\"javascript:" + obj + ".SumPage(" + (pageNum - 1) + ");\">«</a></li>");
        }
        if (pageNum > 2) {
            $("#Page_Info").append("<li><a href=\"javascript:" + obj + ".SumPage(" + (pageNum - 2) + ");\">" + (pageNum - 2) + "</a></li>");
        }
        if (pageNum > 1) {
            $("#Page_Info").append("<li><a href=\"javascript:" + obj + ".SumPage(" + (pageNum - 1) + ");\">" + (pageNum - 1) + "</a></li>");
        }
        $("#Page_Info").append("<li class=\"active\"><a href=\"javascript:" + obj + ".SumPage(" + (pageNum) + ");\">" + pageNum + "</a></li>");
        if (pageNum <= allPage - 1) {
            $("#Page_Info").append("<li><a href=\"javascript:" + obj + ".SumPage(" + (pageNum + 1) + ");\">" + (pageNum + 1) + "</a></li>");
        }
        if (pageNum <= allPage - 2) {
            $("#Page_Info").append("<li><a href=\"javascript:" + obj + ".SumPage(" + (pageNum + 2) + ");\">" + (pageNum + 2) + "</a></li>");
        }
        if (pageNum < allPage) {
            $("#Page_Info").append("<li><a href=\"javascript:" + obj + ".SumPage(" + (pageNum + 1) + ");\">»</a></li>");
        }
        $("#Page_Info").append("<li><a href=\"javascript:" + obj + ".SumPage(" + allPage + ");\">尾</a></li>");
    }
}

Date.prototype.pattern = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份           
        "d+": this.getDate(), //日           
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时           
        "H+": this.getHours(), //小时           
        "m+": this.getMinutes(), //分           
        "s+": this.getSeconds(), //秒           
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度           
        "S": this.getMilliseconds() //毫秒           
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

window.onresize = function () {
    var h = $(window).height();
    $("iframe").css("height", h - 120 + "px");
}