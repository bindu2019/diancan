var t = getApp();

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
        var a = this;
        t.util.request({
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
        }), a.getlist();
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
        var a = this;
        if (1 == t.touches.length) {
            this.setData({
                startX: t.touches[0].clientX
            });
            var e = a.data.list;
            e.forEach(function(t, a) {
                e[a].txtStyle = "transform:translateX(0px);", e[a].delStyle = "transform:translateX(88px);";
            }), a.setData({
                list: e
            });
        }
    },
    touchM: function(t) {
        var a = this;
        if (1 == t.touches.length) {
            var e = t.touches[0].clientX, s = a.data.startX - e, r = a.data.delBtnWidth, n = "", o = "";
            0 == s || s < 0 ? (n = "transform:translateX(0px);", o = "transform:translateX(88px);") : s > 0 && (n = "transform:translateX(-" + s + "px);", 
            o = "transform:translateX(" + (r - s) + "px);", s >= r && (n = "transform:translateX(-88px);", 
            o = "transform:translateX(0px);"));
            var l = t.currentTarget.dataset.index, i = a.data.list;
            i[l].txtStyle = n, i[l].delStyle = o, a.setData({
                list: i
            });
        }
    },
    touchE: function(t) {
        var a = this;
        if (1 == t.changedTouches.length) {
            var e = t.changedTouches[0].clientX, s = a.data.startX - e, r = a.data.delBtnWidth, n = s > r / 2 ? "transform:translateX(-88px);" : "transform:translateX(0px);", o = s > r / 2 ? "transform:translateX(0px);" : "transform:translateX(88px);", l = t.currentTarget.dataset.index, i = a.data.list;
            i[l].txtStyle = n, i[l].delStyle = o, a.setData({
                list: i
            });
        }
    },
    getlist: function() {
        var a = this;
        a.setData({
            total: 0,
            list: [],
            page: 1,
            hasMore: 1,
            delBtnWidth: 88
        });
        var e = a.data.page, s = a.data.hasMore, r = a.data.list;
        "1" == s && (a.setData({
            hasMore: 0
        }), t.util.getUserInfo(function() {
            "" != wx.getStorageSync("userInfo") ? t.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "address",
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
                            list: r.concat(n),
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
    delAddr: function(a) {
        var e = this;
        wx.showModal({
            title: "删除地址",
            content: "确认删除该收货地址吗？",
            confirmColor: "#ff9c37",
            success: function(s) {
                if (s.confirm) t.util.request({
                    url: "entry/wxapp/deampost",
                    cachetime: "0",
                    showLoading: !0,
                    method: "post",
                    data: {
                        op: "delteaddr",
                        addressid: a.target.dataset.addrid
                    },
                    success: function(t) {
                        "1" == (t = t.data).status ? e.getlist() : wx.showModal({
                            title: "提示",
                            content: t.result.message,
                            showCancel: !1,
                            confirmColor: "#ff9c37",
                            success: function(t) {
                                t.confirm;
                            }
                        });
                    }
                }); else if (s.cancel) {
                    var r = e.data.list;
                    r.forEach(function(t, a) {
                        r[a].txtStyle = "transform:translateX(0px);", r[a].delStyle = "transform:translateX(88px);";
                    }), e.setData({
                        list: r
                    });
                }
            }
        });
    }
});