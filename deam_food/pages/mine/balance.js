var t = getApp();

Page({
    data: {
        total: 0,
        list: [],
        page: 1,
        hasMore: 1,
        isShow: 0
    },
    onLoad: function(t) {
        var a = this, o = wx.getStorageSync("wx_settings");
        o.fg_color && o.bg_color ? wx.setNavigationBarColor && wx.setNavigationBarColor({
            frontColor: o.fg_color,
            backgroundColor: o.bg_color
        }) : wx.setNavigationBarColor({
            frontColor: "#000000",
            backgroundColor: "#FFFFFF"
        }), wx.setNavigationBarTitle({
            title: "我的余额"
        }), o || (o = {
            bg_color: "#FFFFFF"
        }), a.setData({
            wx_settings: o
        });
    },
    onReady: function() {},
    onShow: function() {
        var a = this;
        a.setData({
            page: 1,
            hasMore: 1,
            list: []
        }), t.util.request({
            url: "entry/wxapp/data",
            cachetime: "0",
            showLoading: !0,
            data: {
                op: "memberinfo"
            },
            success: function(t) {
                "1" == (t = t.data).status && a.setData({
                    memberInfo: t.result
                });
            }
        }), a.getRecordList();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.getRecordList();
    },
    getRecordList: function() {
        var a = this, o = a.data.page, e = a.data.hasMore, s = a.data.list;
        "1" == e && (a.setData({
            hasMore: 0
        }), t.util.getUserInfo(function() {
            "" != wx.getStorageSync("userInfo") ? t.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "credits_record",
                    page: o
                },
                success: function(t) {
                    var t = t.data;
                    if (a.setData({
                        isShow: 1
                    }), t.result.total > 0) {
                        e = t.result.list.length <= 0 || t.result.list.length < t.result.pagesize ? 0 : 1;
                        var r = t.result.list;
                        a.setData({
                            total: t.result.total,
                            list: s.concat(r),
                            hasMore: e
                        });
                    } else a.setData({
                        hasMore: 0
                    });
                    o++, a.setData({
                        page: o
                    });
                }
            }) : wx.navigateTo({
                url: "/deam_food/pages/auth/auth"
            });
        }));
    },
    jumpLink: function(t) {
        var a = t.currentTarget.dataset.url;
        console.log(t), "" != a && wx.navigateTo({
            url: a
        });
    }
});