var app = getApp();

Page({
    data: {
        shareTitle: ""
    },
    onLoad: function(t) {
        var a = this, o = t.aid;
        app.util.request({
            url: "entry/wxapp/data",
            cachetime: "0",
            showLoading: !0,
            data: {
                op: "adv_info",
                id: o
            },
            success: function(t) {
                "1" == (t = t.data).status && a.setData({
                    adv: t.result
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/settings",
            cachetime: "0",
            showLoading: !1,
            success: function(t) {
                "1" == (t = t.data).status && (wx.setNavigationBarColor && wx.setNavigationBarColor({
                    frontColor: t.result.fg_color,
                    backgroundColor: t.result.bg_color
                }), wx.setNavigationBarTitle({
                    title: t.result.name
                }), a.setData({
                    shareTitle: t.result.share_title
                }));
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