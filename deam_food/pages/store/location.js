var t = getApp();

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
    onLoad: function(e) {
        var a = this;
        void 0 != e.type && "" != e.type && a.setData({
            storeType: "takeout"
        }), t.util.request({
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
    onReady: function() {},
    onShow: function() {
        var t = this;
        "0" == t.data.isGetlocation && t.getLocation();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.getlist();
    },
    onShareAppMessage: function() {
        return {
            title: this.data.shareTitle,
            path: "",
            success: function(t) {},
            fail: function(t) {}
        };
    },
    chooseLocation: function() {
        var t = this;
        wx.chooseLocation({
            success: function(e) {
                console.log(e);
                var a = e.latitude, o = e.longitude;
                t.setData({
                    locationAddr: e.address,
                    list: [],
                    page: 1,
                    hasMore: 1
                }), t.getStoreList(a, o);
            },
            fail: function(t) {}
        });
    },
    getStoreList: function(e, a) {
        var o = this, s = o.data.page, i = o.data.hasMore, n = o.data.list;
        o.setData({
            latitude: e,
            longitude: a
        }), "1" == i && (o.setData({
            hasMore: 0
        }), t.util.request({
            url: "entry/wxapp/data",
            cachetime: "0",
            showLoading: !0,
            data: {
                op: "storelist",
                latitude: e,
                longitude: a,
                page: s,
                store_type: o.data.storeType
            },
            success: function(t) {
                (t = t.data).result.total > 0 ? (i = t.result.list.length <= 0 || t.result.list.length < t.result.pagesize ? 0 : 1, 
                o.setData({
                    total: t.result.total,
                    list: n.concat(t.result.list),
                    hasMore: i
                })) : o.setData({
                    hasMore: 0
                }), s++, o.setData({
                    page: s
                });
            }
        }));
    },
    getlist: function() {
        var t = this, e = t.data.latitude, a = t.data.longitude;
        t.getStoreList(e, a);
    },
    getLocation: function() {
        var e = this;
        wx.getLocation({
            type: "gcj02",
            success: function(a) {
                var o = a.latitude, s = a.longitude;
                a.speed, a.accuracy;
                t.util.request({
                    url: "entry/wxapp/api",
                    cachetime: "0",
                    showLoading: !1,
                    data: {
                        op: "getaddr",
                        latitude: o,
                        longitude: s
                    },
                    success: function(t) {
                        "1" == (t = t.data).status && e.setData({
                            locationAddr: t.result.address,
                            isGetlocation: 1
                        });
                    }
                }), e.setData({
                    list: [],
                    page: 1,
                    hasMore: 1
                }), e.getStoreList(o, s);
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
        var e = this, a = t.currentTarget.dataset.storeid;
        wx.navigateTo({
            url: "/deam_food/pages/store/detail?store_id=" + a + "&type=" + e.data.storeType
        });
    }
});