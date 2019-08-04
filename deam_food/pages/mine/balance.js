var app = getApp();

Page({
    data: {
        total: 0,
        list: [],
        page: 1,
        hasMore: 1,
        isShow: 0
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
        a.setData({
            page: 1,
            hasMore: 1,
            list: []
        }), app.util.request({
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
    onReachBottom: function() {},
    getRecordList: function() {
        var e = this, s = e.data.page, o = e.data.hasMore, n = e.data.list;
        "1" == o && (e.setData({
            hasMore: 0
        }), app.util.getUserInfo(function() {
            "" != wx.getStorageSync("userInfo") ? app.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "credits_record",
                    page: s
                },
                success: function(t) {
                    t = t.data;
                    if (e.setData({
                        isShow: 1
                    }), 0 < t.result.total) {
                        o = t.result.list.length <= 0 || t.result.list.length < t.result.pagesize ? 0 : 1;
                        var a = t.result.list;
                        e.setData({
                            total: t.result.total,
                            list: n.concat(a),
                            hasMore: o
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