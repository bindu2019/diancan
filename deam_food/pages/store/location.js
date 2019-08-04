var app = getApp();

Page({
    data: {
        locationAddr: "",
        total: 0,
        list: [],
        page: 1,
        scrollHeight: 0,
        latitude: 0,
        longitude: 0,
        hasMore: 1,
        isGetlocation: 0,
        storeType: "",
        shareTitle: ""
    },
    onLoad: function(t) {
        var e = this;
        null != t.type && "" != t.type && e.setData({
            storeType: "takeout"
        });
        var a = wx.getSystemInfoSync().windowHeight;
        e.setData({
            scrollHeight: a - 67 - 51 - 11
        }), app.util.request({
            url: "entry/wxapp/settings",
            cachetime: "0",
            showLoading: !1,
            success: function(t) {
                "1" == (t = t.data).status && (wx.setNavigationBarColor && wx.setNavigationBarColor({
                    frontColor: t.result.fg_color,
                    backgroundColor: t.result.bg_color
                }), wx.setNavigationBarTitle({
                    title: t.result.name
                }), e.setData({
                    shareTitle: t.result.share_title
                }));
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        "0" == this.data.isGetlocation && this.getLocation();
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
    chooseLocation: function() {
        var o = this;
        wx.chooseLocation({
            success: function(t) {
                console.log(t);
                var e = t.latitude, a = t.longitude;
                o.setData({
                    locationAddr: t.address,
                    list: [],
                    page: 1,
                    hasMore: 1
                }), o.getStoreList(e, a);
            },
            fail: function(t) {}
        });
    },
    getStoreList: function(t, e) {
        var a = this, o = a.data.page, s = a.data.hasMore, i = a.data.list;
        a.setData({
            latitude: t,
            longitude: e
        }), "1" == s && (a.setData({
            hasMore: 0
        }), app.util.request({
            url: "entry/wxapp/data",
            cachetime: "0",
            showLoading: !0,
            data: {
                op: "storelist",
                latitude: t,
                longitude: e,
                page: o,
                store_type: a.data.storeType
            },
            success: function(t) {
                0 < (t = t.data).result.total ? (s = t.result.list.length <= 0 || t.result.list.length < t.result.pagesize ? 0 : 1, 
                a.setData({
                    total: t.result.total,
                    list: i.concat(t.result.list),
                    hasMore: s
                })) : a.setData({
                    hasMore: 0
                }), o++, a.setData({
                    page: o
                });
            }
        }));
    },
    getlist: function() {
        var t = this, e = t.data.latitude, a = t.data.longitude;
        t.getStoreList(e, a);
    },
    getLocation: function() {
        var o = this;
        wx.getLocation({
            type: "wgs84",
            success: function(t) {
                var e = t.latitude, a = t.longitude;
                t.speed, t.accuracy;
                app.util.request({
                    url: "entry/wxapp/api",
                    cachetime: "0",
                    showLoading: !1,
                    data: {
                        op: "getaddr",
                        latitude: e,
                        longitude: a
                    },
                    success: function(t) {
                        "1" == (t = t.data).status && o.setData({
                            locationAddr: t.result.address,
                            isGetlocation: 1
                        });
                    }
                }), o.setData({
                    list: [],
                    page: 1,
                    hasMore: 1
                }), o.getStoreList(e, a);
            },
            fail: function(t) {
                console.log(t), wx.showModal({
                    title: "提示",
                    content: "请先允许获取当前位置",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.openSetting();
                    }
                });
            }
        });
    },
    toStore: function(t) {
        var e = t.currentTarget.dataset.storeid;
        wx.redirectTo({
            url: "/deam_food/pages/store/detail?store_id=" + e + "&type=" + this.data.storeType
        });
    }
});