var t = getApp();

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
        var e = this;
        t.util.request({
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
                    }), e.setData({
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
                    var a = "" == e.data.store_blogo ? 0 : 30, o = "" == e.data.copyright ? 0 : 24, i = "" != e.data.store_blogo || "" == e.data.copyright ? 30 : 0, s = wx.getSystemInfoSync();
                    e.setData({
                        mainBodyHeight: s.windowHeight - a - o - i
                    });
                }
            }
        }), t.util.request({
            url: "entry/wxapp/data",
            cachetime: "0",
            showLoading: !0,
            data: {
                op: "index"
            },
            success: function(t) {
                var t = t.data, a = wx.getSystemInfoSync(), o = t.result.adv_width / t.result.adv_height, i = a.windowWidth / o;
                "1" == t.status && e.setData({
                    swiperHeight: i,
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
        var e = this, a = wx.getSystemInfoSync();
        if (0 == t.target.dataset.index) {
            var o = t.detail.width / t.detail.height, i = a.windowWidth / o;
            e.setData({
                swiperHeight: i,
                swiperWidth: a.windowWidth
            });
        }
    },
    jumpStore: function(t) {
        var e = this;
        "2" == e.data.storeType ? wx.navigateTo({
            url: "/deam_food/pages/store/location"
        }) : wx.navigateTo({
            url: "/deam_food/pages/store/detail?store_id=" + e.data.single_storeid
        });
    },
    jumpTakeout: function(t) {
        var e = this;
        "2" == e.data.storeType ? wx.navigateTo({
            url: "/deam_food/pages/store/location?type=takeout"
        }) : wx.navigateTo({
            url: "/deam_food/pages/store/detail?type=takeout&store_id=" + e.data.single_storeid
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
        var e = this, a = wx.createSelectorQuery();
        console.log(111), a.select(".ad").boundingClientRect(), a.exec(function(t) {
            var a = t[0].height;
            console.log(a), e.setData({
                adHeight: a
            });
        });
    },
    adError: function(t) {
        console.log(t.detail);
    }
});