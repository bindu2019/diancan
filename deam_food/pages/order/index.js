var app = getApp();

Page({
    data: {
        total: 0,
        list: [],
        page: 1,
        hasMore: 1,
        userId: 0,
        isShow: 0,
        shareTitle: ""
    },
    onLoad: function(t) {
        var a = wx.getSystemInfoSync().windowHeight;
        this.setData({
            scrollHeight: a
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
                    title: "我的订单"
                }), a.setData({
                    shareTitle: t.result.share_title
                }));
            }
        }), a.setData({
            page: 1,
            hasMore: 1,
            list: []
        }), a.getOrderList();
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
    jumpDetail: function(t) {
        var a = t.currentTarget.dataset.orderid;
        0 < a ? wx.navigateTo({
            url: "/deam_food/pages/order/detail?id=" + a
        }) : wx.showModal({
            title: "提示",
            content: "订单异常，无法显示详情！",
            showCancel: !1,
            success: function(t) {}
        });
    },
    getOrderList: function() {
        var e = this, s = e.data.page, i = e.data.hasMore, n = e.data.list;
        "1" == i && (e.setData({
            hasMore: 0
        }), app.util.getUserInfo(function() {
            "" != wx.getStorageSync("userInfo") ? app.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "orderlist",
                    page: s
                },
                success: function(t) {
                    t = t.data;
                    if (e.setData({
                        isShow: 1
                    }), 0 < t.result.total) {
                        i = t.result.list.length <= 0 || t.result.list.length < t.result.pagesize ? 0 : 1;
                        var a = t.result.list, o = [];
                        a.forEach(function(t, a, e) {
                            e[a].goods_list = JSON.parse(e[a].goods_list), o = e;
                        }), e.setData({
                            total: t.result.total,
                            list: n.concat(o),
                            hasMore: i
                        });
                    } else e.setData({
                        hasMore: 0
                    });
                    s++, e.setData({
                        page: s
                    });
                }
            }) : wx.navigateTo({
                url: "/deam_food/pages/auth/auth"
            });
        }));
    }
});