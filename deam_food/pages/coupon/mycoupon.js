var app = getApp();

Page({
    data: {
        bgColor: "#ffffff",
        textColor: "#ff9c37",
        total: -1,
        list: [],
        page: 1,
        hasMore: 1,
        userId: 0,
        isShow: 0,
        tabid: 0,
        noneTips: "",
        shareTitle: ""
    },
    onLoad: function(t) {},
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
                    title: "我的优惠"
                }), a.setData({
                    shareTitle: t.result.share_title
                }));
            }
        }), app.util.request({
            url: "entry/wxapp/coupon",
            cachetime: "0",
            showLoading: !1,
            data: {
                op: "test"
            },
            success: function(t) {
                "1" == (t = t.data).status && wx.addCard({
                    cardList: [ {
                        cardId: t.result.cardid,
                        cardExt: '{"timestamp": "' + t.result.timestamp + '", "signature":"' + t.result.signature + '"}'
                    } ],
                    success: function(t) {
                        console.log(t.cardList);
                    }
                });
            }
        }), a.getlist();
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
    getlist: function() {
        var e = this;
        e.setData({
            total: -1,
            list: [],
            page: 1,
            hasMore: 1
        });
        var s = e.data.page, o = e.data.hasMore, i = e.data.list;
        "1" == o && (e.setData({
            hasMore: 0
        }), app.util.getUserInfo(function() {
            "" != wx.getStorageSync("userInfo") ? app.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "couponlist",
                    page: s,
                    status: e.data.tabid
                },
                success: function(t) {
                    t = t.data;
                    if (e.setData({
                        isShow: 1,
                        noneTips: t.result.tips
                    }), 0 < t.result.total) {
                        o = t.result.list.length <= 0 || t.result.list.length < t.result.pagesize ? 0 : 1;
                        var a = t.result.list;
                        e.setData({
                            total: t.result.total,
                            list: i.concat(a),
                            hasMore: o
                        });
                    } else e.setData({
                        hasMore: 0,
                        total: 0
                    });
                    s++, e.setData({
                        page: s
                    });
                }
            }) : wx.navigateTo({
                url: "/deam_food/pages/auth/auth"
            });
        }));
    },
    changeTab: function(t) {
        this.setData({
            tabid: t.currentTarget.dataset.id
        }), this.getlist();
    },
    uploadWechat: function(t) {
        var a = t.currentTarget.dataset.couponid;
        app.util.request({
            url: "entry/wxapp/coupon",
            cachetime: "0",
            showLoading: !0,
            data: {
                couponid: a,
                op: "upload_wechat"
            },
            success: function(t) {
                "1" == (t = t.data).status && wx.addCard({
                    cardList: [ {
                        cardId: t.result.cardid,
                        cardExt: '{"timestamp": "' + t.result.timestamp + '", "outer_str":"' + t.result.outer_str + '", "signature":"' + t.result.signature + '"}'
                    } ],
                    success: function(t) {
                        console.log(t.cardList);
                    }
                });
            }
        });
    }
});