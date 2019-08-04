var app = getApp();

Page({
    data: {
        total: 0,
        list: [],
        page: 1,
        hasMore: 1,
        userId: 0,
        isShow: 0
    },
    onLoad: function(t) {},
    onReady: function() {},
    onShow: function() {
        app.util.request({
            url: "entry/wxapp/settings",
            cachetime: "0",
            showLoading: !1,
            success: function(t) {
                "1" == (t = t.data).status && (wx.setNavigationBarColor && wx.setNavigationBarColor({
                    frontColor: t.result.fg_color,
                    backgroundColor: t.result.bg_color
                }), wx.setNavigationBarTitle({
                    title: "我的地址"
                }));
            }
        }), this.getlist();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    jumpLink: function(t) {
        var a = t.currentTarget.dataset.url;
        "" != a && wx.navigateTo({
            url: a
        });
    },
    touchS: function(t) {
        if (1 == t.touches.length) {
            this.setData({
                startX: t.touches[0].clientX
            });
            var e = this.data.list;
            e.forEach(function(t, a) {
                e[a].txtStyle = "transform:translateX(0px);", e[a].delStyle = "transform:translateX(88px);";
            }), this.setData({
                list: e
            });
        }
    },
    touchM: function(t) {
        var a = this;
        if (1 == t.touches.length) {
            var e = t.touches[0].clientX, s = a.data.startX - e, n = a.data.delBtnWidth, r = "", o = "";
            if (0 == s || s < 0) r = "transform:translateX(0px);", o = "transform:translateX(88px);"; else if (0 < s) {
                r = "transform:translateX(-" + s + "px);", o = "transform:translateX(" + (n - s) + "px);", 
                n <= s && (r = "transform:translateX(-88px);", o = "transform:translateX(0px);");
            }
            var l = t.currentTarget.dataset.index, i = a.data.list;
            i[l].txtStyle = r, i[l].delStyle = o, a.setData({
                list: i
            });
        }
    },
    touchE: function(t) {
        var a = this;
        if (1 == t.changedTouches.length) {
            var e = t.changedTouches[0].clientX, s = a.data.startX - e, n = a.data.delBtnWidth, r = n / 2 < s ? "transform:translateX(-88px);" : "transform:translateX(0px);", o = n / 2 < s ? "transform:translateX(0px);" : "transform:translateX(88px);", l = t.currentTarget.dataset.index, i = a.data.list;
            i[l].txtStyle = r, i[l].delStyle = o, a.setData({
                list: i
            });
        }
    },
    getlist: function() {
        var e = this;
        e.setData({
            total: 0,
            list: [],
            page: 1,
            hasMore: 1,
            delBtnWidth: 88
        });
        var s = e.data.page, n = e.data.hasMore, r = e.data.list;
        "1" == n && (e.setData({
            hasMore: 0
        }), app.util.getUserInfo(function() {
            "" != wx.getStorageSync("userInfo") ? app.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "address",
                    page: s
                },
                success: function(t) {
                    t = t.data;
                    if (e.setData({
                        isShow: 1
                    }), 0 < t.result.total) {
                        n = t.result.list.length <= 0 || t.result.list.length < t.result.pagesize ? 0 : 1;
                        var a = t.result.list;
                        e.setData({
                            total: t.result.total,
                            list: r.concat(a),
                            hasMore: n
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
    delAddr: function(a) {
        var s = this;
        wx.showModal({
            title: "删除地址",
            content: "确认删除该收货地址吗？",
            confirmColor: "#ff9c37",
            success: function(t) {
                if (t.confirm) app.util.request({
                    url: "entry/wxapp/deampost",
                    cachetime: "0",
                    showLoading: !0,
                    method: "post",
                    data: {
                        op: "delteaddr",
                        addressid: a.target.dataset.addrid
                    },
                    success: function(t) {
                        "1" == (t = t.data).status ? s.getlist() : wx.showModal({
                            title: "提示",
                            content: t.result.message,
                            showCancel: !1,
                            confirmColor: "#ff9c37",
                            success: function(t) {
                                t.confirm;
                            }
                        });
                    }
                }); else if (t.cancel) {
                    var e = s.data.list;
                    e.forEach(function(t, a) {
                        e[a].txtStyle = "transform:translateX(0px);", e[a].delStyle = "transform:translateX(88px);";
                    }), s.setData({
                        list: e
                    });
                }
            }
        });
    }
});