var app = getApp();

Page({
    data: {
        memberBgColor: "",
        userInfo: {},
        isShow: 0,
        mainBodyHeight: 0,
        store_blogo: "",
        copyright: "",
        shareTitle: "",
        openBalance: 0
    },
    onLoad: function(t) {},
    onReady: function() {},
    onShow: function() {
        var r = this;
        app.util.request({
            url: "entry/wxapp/settings",
            cachetime: "0",
            showLoading: !0,
            success: function(t) {
                if ("1" == (t = t.data).status) {
                    wx.setNavigationBarColor && wx.setNavigationBarColor({
                        frontColor: t.result.fg_color,
                        backgroundColor: t.result.bg_color
                    }), wx.setNavigationBarTitle({
                        title: "我的"
                    }), r.setData({
                        shareTitle: t.result.share_title,
                        memberBgColor: t.result.bg_color,
                        store_blogo: t.result.store_blogo,
                        copyright: t.result.copyright,
                        openBalance: t.result.sets.open_banlance
                    });
                    var o = "" == r.data.store_blogo ? 0 : 30, e = "" == r.data.copyright ? 0 : 24, a = "" != r.data.store_blogo || "" == r.data.copyright ? 30 : 0, n = wx.getSystemInfoSync();
                    r.setData({
                        mainBodyHeight: n.windowHeight - o - e - a
                    });
                }
            }
        }), app.util.getUserInfo(function() {
            var t = wx.getStorageSync("userInfo");
            "" != t ? (r.setData({
                userInfo: t,
                isShow: 1
            }), app.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "memberinfo"
                },
                success: function(t) {
                    "1" == (t = t.data).status && r.setData({
                        memberInfo: t.result
                    });
                }
            })) : wx.navigateTo({
                url: "/deam_food/pages/auth/auth"
            });
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
    },
    aboutUs: function() {
        wx.navigateTo({
            url: "/deam_food/pages/store/aboutus"
        });
    },
    jumpLink: function(t) {
        var o = t.currentTarget.dataset.url;
        "" != o && wx.navigateTo({
            url: o
        });
    }
});