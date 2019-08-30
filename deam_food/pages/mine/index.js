var t = getApp();

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
        var e = this;
        t.util.request({
            url: "entry/wxapp/settings",
            cachetime: "0",
            showLoading: !0,
            success: function(t) {
                if ("1" == (t = t.data).status) {
                    wx.setStorageSync("wx_settings", t.result), wx.setNavigationBarColor && wx.setNavigationBarColor({
                        frontColor: t.result.fg_color,
                        backgroundColor: t.result.bg_color
                    }), wx.setNavigationBarTitle({
                        title: "会员中心"
                    }), e.setData({
                        shareTitle: t.result.share_title,
                        memberBgColor: t.result.bg_color,
                        store_blogo: t.result.store_blogo,
                        copyright: t.result.copyright,
                        openBalance: t.result.sets.open_banlance
                    });
                    var o = "" == e.data.store_blogo ? 0 : 30, a = "" == e.data.copyright ? 0 : 24, n = "" != e.data.store_blogo || "" == e.data.copyright ? 30 : 0, s = wx.getSystemInfoSync();
                    e.setData({
                        mainBodyHeight: s.windowHeight - o - a - n
                    });
                }
            }
        }), t.util.getUserInfo(function() {
            var o = wx.getStorageSync("userInfo");
            "" != o ? (e.setData({
                userInfo: o,
                isShow: 1
            }), t.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "memberinfo"
                },
                success: function(t) {
                    "1" == (t = t.data).status && e.setData({
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
        var e = t.currentTarget.dataset.url;
        console.log(t), "" != e && wx.navigateTo({
            url: e
        });
    },
    getPhoneNumber: function(e) {
        var o = this;
        console.log(e.detail), e.detail.encryptedData && t.util.request({
            url: "entry/wxapp/data",
            cachetime: "0",
            showLoading: !0,
            data: {
                op: "getPhoneNumber",
                encryptedData: encodeURIComponent(e.detail.encryptedData),
                iv: e.detail.iv
            },
            success: function(t) {
                "1" == (t = t.data).status ? o.setData({
                    memberInfo: t.result
                }) : wx.showModal({
                    title: "提示",
                    content: t.result.message,
                    showCancel: !1,
                    confirmColor: "#ff9c37"
                });
            }
        });
    }
});