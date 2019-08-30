var t = getApp();

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
                    title: "我的优惠"
                }), e.setData({
                    shareTitle: t.result.share_title
                }));
            }
        }), t.util.request({
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
        }), e.getlist();
    },
    onReady: function() {},
    onShow: function() {},
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
    getlist: function() {
        var a = this, e = a.data.page, s = a.data.hasMore, o = a.data.list;
        "1" == s && (a.setData({
            hasMore: 0
        }), t.util.getUserInfo(function() {
            "" != wx.getStorageSync("userInfo") ? t.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "couponlist",
                    page: e,
                    status: a.data.tabid
                },
                success: function(t) {
                    var t = t.data;
                    if (a.setData({
                        isShow: 1,
                        noneTips: t.result.tips
                    }), t.result.total > 0) {
                        s = t.result.list.length <= 0 || t.result.list.length < t.result.pagesize ? 0 : 1;
                        var i = t.result.list;
                        a.setData({
                            total: t.result.total,
                            list: o.concat(i),
                            hasMore: s
                        });
                    } else a.setData({
                        hasMore: 0,
                        total: 0
                    });
                    e++, a.setData({
                        page: e
                    });
                }
            }) : wx.navigateTo({
                url: "/deam_food/pages/auth/auth"
            });
        }));
    },
    changeTab: function(t) {
        var a = this;
        a.setData({
            total: -1,
            list: [],
            page: 1,
            hasMore: 1
        }), a.setData({
            tabid: t.currentTarget.dataset.id
        }), a.getlist();
    },
    uploadWechat: function(a) {
        var e = a.currentTarget.dataset.couponid;
        t.util.request({
            url: "entry/wxapp/coupon",
            cachetime: "0",
            showLoading: !0,
            data: {
                couponid: e,
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