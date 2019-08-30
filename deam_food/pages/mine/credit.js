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
        var a = this, e = wx.getSystemInfoSync().windowHeight;
        a.setData({
            scrollHeight: e
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
        var a = this, e = a.data.page, s = a.data.hasMore, o = a.data.list;
        "1" == s && (a.setData({
            hasMore: 0
        }), t.util.getUserInfo(function() {
            "" != wx.getStorageSync("userInfo") ? t.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "credits_record",
                    type: "credit1",
                    page: e
                },
                success: function(t) {
                    var t = t.data;
                    if (a.setData({
                        isShow: 1
                    }), t.result.total > 0) {
                        s = t.result.list.length <= 0 || t.result.list.length < t.result.pagesize ? 0 : 1;
                        var n = t.result.list;
                        a.setData({
                            total: t.result.total,
                            list: o.concat(n),
                            hasMore: s
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