var t = getApp();

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
    onLoad: function(a) {
        var e = this;
        t.util.request({
            url: "entry/wxapp/settings",
            cachetime: "0",
            showLoading: !1,
            success: function(t) {
                "1" == (t = t.data).status && (wx.setNavigationBarColor && wx.setNavigationBarColor({
                    frontColor: t.result.fg_color,
                    backgroundColor: t.result.bg_color
                }), wx.setNavigationBarTitle({
                    title: "我的订单"
                }), e.setData({
                    shareTitle: t.result.share_title
                }));
            }
        }), e.setData({
            page: 1,
            hasMore: 1,
            list: []
        }), e.getOrderList();
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.getOrderList();
    },
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
        a > 0 ? wx.navigateTo({
            url: "/deam_food/pages/order/detail?id=" + a
        }) : wx.showModal({
            title: "提示",
            content: "订单异常，无法显示详情！",
            showCancel: !1,
            success: function(t) {}
        });
    },
    getOrderList: function() {
        var a = this, e = a.data.page, o = a.data.hasMore, s = a.data.list;
        "1" == o && (a.setData({
            hasMore: 0
        }), t.util.getUserInfo(function() {
            "" != wx.getStorageSync("userInfo") ? t.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "orderlist",
                    page: e
                },
                success: function(t) {
                    var t = t.data;
                    if (a.setData({
                        isShow: 1
                    }), t.result.total > 0) {
                        o = t.result.list.length <= 0 || t.result.list.length < t.result.pagesize ? 0 : 1;
                        var r = [];
                        t.result.list.forEach(function(t, a, e) {
                            e[a].goods_list = JSON.parse(e[a].goods_list), r = e;
                        }), a.setData({
                            total: t.result.total,
                            list: s.concat(r),
                            hasMore: o
                        });
                    } else a.setData({
                        hasMore: 0
                    });
                    e++, a.setData({
                        page: e
                    });
                }
            }) : wx.navigateTo({
                url: "/deam_food/pages/auth/auth"
            });
        }));
    }
});