var app = getApp();

Page({
    data: {
        advShow: 0,
        adv: [],
        storeType: 0,
        single_storeid: 0,
        swiperHeight: 0,
        swiperWidth: 0,
        isShow: 0,
        mainBodyHeight: 0,
        store_blogo: "",
        copyright: "",
        wxappScan: 0,
        wxappTakeout: 0,
        wxappGetself: 0,
        shareTitle: "",
        adHeight: 0,
        advertisement: {}
    },
    onLoad: function(t) {},
    onReady: function() {},
    onShow: function() {
        var s = this;
        app.util.request({
            url: "entry/wxapp/settings",
            cachetime: "0",
            showLoading: !1,
            success: function(t) {
                if ("1" == (t = t.data).status) {
                    wx.setNavigationBarColor && wx.setNavigationBarColor({
                        frontColor: t.result.fg_color,
                        backgroundColor: t.result.bg_color
                    }), wx.setNavigationBarTitle({
                        title: t.result.name
                    }), s.setData({
                        shareTitle: t.result.share_title,
                        storeType: t.result.type,
                        single_storeid: t.result.single_storeid,
                        store_blogo: t.result.store_blogo,
                        copyright: t.result.copyright,
                        wxappScan: t.result.wxapp_scan,
                        wxappTakeout: t.result.wxapp_takeout,
                        wxappGetself: t.result.wxapp_getself,
                        wxappSettings: t.result
                    });
                    var e = "" == s.data.store_blogo ? 0 : 30, a = "" == s.data.copyright ? 0 : 24, o = "" != s.data.store_blogo || "" == s.data.copyright ? 30 : 0, i = wx.getSystemInfoSync();
                    s.setData({
                        mainBodyHeight: i.windowHeight - e - a - o
                    });
                }
            }
        }), app.util.request({
            url: "entry/wxapp/data",
            cachetime: "0",
            showLoading: !0,
            data: {
                op: "index"
            },
            success: function(t) {
                t = t.data;
                var e = wx.getSystemInfoSync(), a = t.result.adv_width / t.result.adv_height, o = e.windowWidth / a;
                "1" == t.status && s.setData({
                    swiperHeight: o,
                    advShow: 1,
                    adv: t.result.adv,
                    isShow: 1,
                    advertisement: t.result.advertisement
                });
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
            path: "/deam_food/pages/index/index",
            success: function(t) {},
            fail: function(t) {}
        };
    },
    imageLoad: function(t) {
        var e = wx.getSystemInfoSync();
        if (0 == t.target.dataset.index) {
            var a = t.detail.width / t.detail.height, o = e.windowWidth / a;
            this.setData({
                swiperHeight: o,
                swiperWidth: e.windowWidth
            });
        }
    },
    jumpStore: function(t) {
        "2" == this.data.storeType ? wx.navigateTo({
            url: "/deam_food/pages/store/location"
        }) : wx.navigateTo({
            url: "/deam_food/pages/store/detail?store_id=" + this.data.single_storeid
        });
    },
    jumpTakeout: function(t) {
        "2" == this.data.storeType ? wx.navigateTo({
            url: "/deam_food/pages/store/location?type=takeout"
        }) : wx.navigateTo({
            url: "/deam_food/pages/store/detail?type=takeout&store_id=" + this.data.single_storeid
        });
    },
    scanWxacode: function(t) {
        wx.scanCode({
            onlyFromCamera: !0,
            success: function(t) {
                "" != t.path ? wx.navigateTo({
                    url: t.path
                }) : wx.showModal({
                    title: "提示",
                    content: "不合法的小程序码！",
                    showCancel: !1,
                    success: function(t) {}
                });
            }
        });
    },
    jumpToAdvUrl: function(t) {
        var e = wx.canIUse("web-view"), a = t.currentTarget.dataset.url;
        e && a && wx.navigateTo({
            url: "/deam_food/pages/ads/link?aid=" + t.currentTarget.dataset.id
        });
    },
    adLoad: function(t) {
        var a = this, e = wx.createSelectorQuery();
        console.log(111), e.select(".ad").boundingClientRect(), e.exec(function(t) {
            var e = t[0].height;
            console.log(e), a.setData({
                adHeight: e
            });
        });
    },
    adError: function(t) {
        console.log(t.detail);
    }
});