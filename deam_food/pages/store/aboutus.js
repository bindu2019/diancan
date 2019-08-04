var app = getApp(), WxParse = require("../../../wxParse/wxParse.js");

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
        var i = this;
        app.util.request({
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
                    }), i.setData({
                        shareTitle: t.result.share_title,
                        memberBgColor: t.result.bg_color,
                        store_blogo: t.result.store_blogo,
                        copyright: t.result.copyright,
                        isShow: 1
                    });
                    var o = t.result.about_us;
                    WxParse.wxParse("content", "html", o, i, 5);
                    var a = "" == i.data.store_blogo ? 0 : 30, e = "" == i.data.copyright ? 0 : 24, r = "" != i.data.store_blogo || "" == i.data.copyright ? 30 : 0, s = wx.getSystemInfoSync();
                    i.setData({
                        mainBodyHeight: s.windowHeight - a - e - r
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