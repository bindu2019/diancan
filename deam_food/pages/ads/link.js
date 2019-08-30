var t = getApp();

Page({
    data: {
        shareTitle: ""
    },
    onLoad: function(a) {
        var o = this, e = a.aid;
        t.util.request({
            url: "entry/wxapp/data",
            cachetime: "0",
            showLoading: !0,
            data: {
                op: "adv_info",
                id: e
            },
            success: function(t) {
                "1" == (t = t.data).status && o.setData({
                    adv: t.result
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        var a = this;
        t.util.request({
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