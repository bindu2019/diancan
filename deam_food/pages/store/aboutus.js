var t = getApp(), o = require("../../../wxParse/wxParse.js");

Page({
    data: {
        isShow: 0,
        mainBodyHeight: 0,
        store_blogo: "",
        copyright: "",
        aboutus: "",
        shareTitle: ""
    },
    onLoad: function(t) {},
    onReady: function() {},
    onShow: function() {
        var e = this;
        t.util.request({
            url: "entry/wxapp/settings",
            cachetime: "0",
            showLoading: !0,
            data: {
                op: "all"
            },
            success: function(t) {
                if ("1" == (t = t.data).status) {
                    wx.setNavigationBarColor && wx.setNavigationBarColor({
                        frontColor: t.result.fg_color,
                        backgroundColor: t.result.bg_color
                    }), wx.setNavigationBarTitle({
                        title: "关于我们"
                    }), e.setData({
                        shareTitle: t.result.share_title,
                        memberBgColor: t.result.bg_color,
                        store_blogo: t.result.store_blogo,
                        copyright: t.result.copyright,
                        isShow: 1
                    });
                    var a = t.result.about_us;
                    o.wxParse("content", "html", a, e, 5);
                    var r = "" == e.data.store_blogo ? 0 : 30, s = "" == e.data.copyright ? 0 : 24, i = "" != e.data.store_blogo || "" == e.data.copyright ? 30 : 0, n = wx.getSystemInfoSync();
                    e.setData({
                        mainBodyHeight: n.windowHeight - r - s - i
                    });
                }
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return {
            title: this.data.shareTitle,
            path: "",
            success: function(t) {},
            fail: function(t) {}
        };
    }
});