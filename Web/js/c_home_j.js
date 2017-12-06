var _Home = {
    Init: function () {
        _Home.initLayot();
    },
    initLayot: function () {

        var h = window.screen.height;

        var midMenu = $(".midMenu").find("li");
        midMenu.eq(0).click(function () {
            window.location = "c_index_home.html?selectType=1";
        });
        midMenu.eq(1).click(function () {
            window.location = "c_index_gj.html";
        });
        midMenu.eq(2).click(function () {
            window.location = "c_index_home.html?selectType=0";
        });
        midMenu.eq(3).click(function () {
            window.location = "app/hotel/index.aspx";
        });
        midMenu.eq(4).click(function () {
            window.location = "c_set_list.html";
        });
        midMenu.eq(6).click(function () {
            window.location = "travel/c_travel_city.html?name=%u5C71%u897F&id=36";
        });
        midMenu.eq(5).click(function () {
            window.location = "c_travel_home.html";
        });
        midMenu.eq(7).click(function () {
            window.location = "c_nav.html";
        });
        var state = _C.getParam("state");
        _Home.getOpenId(state);
    },
    getOpenId: function (code) {
        alert("getOpenId");
        $.ajax(
                {
                    url: _C.ServerUrl,
                    context: document.body,
                    dataType: "json",
                    cache: false,
                    data: { fn: 1, code: code, source: _B.source, t: new Date() },
                    success: function (o) {
                        alert(o.Return);
                        if (o.Return == 0) {

                        }
                    }
                }
        );
    }
}
