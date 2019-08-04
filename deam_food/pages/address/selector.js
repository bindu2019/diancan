var app = getApp();

Page({
    data: {
        trueList: [],
        falseList: [],
        total: 0
    },
    onLoad: function(t) {
        this.setData({
            store_id: t.store_id,
            address_id: t.address_id
        });
    },
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
                    title: "选择收货地址"
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
        console.log(a), "" != a && wx.navigateTo({
            url: a
        });
    },
    touchS: function(t) {
        var a = this;
        if (1 == t.touches.length) {
            this.setData({
                startX: t.touches[0].clientX
            });
            var e = a.data.trueList;
            null != e && (e.forEach(function(t, a) {
                e[a].txtStyle = "transform:translateX(0px);", e[a].delStyle = "transform:translateX(88px);";
            }), a.setData({
                trueList: e
            }));
            var s = a.data.falseList;
            null != s && (s.forEach(function(t, a) {
                s[a].txtStyle = "transform:translateX(0px);", s[a].delStyle = "transform:translateX(88px);";
            }), a.setData({
                falseList: s
            }));
        }
    },
    touchM: function(t) {
        var a = this;
        if (1 == t.touches.length) {
            var e = t.touches[0].clientX, s = a.data.startX - e, r = a.data.delBtnWidth, n = "", o = "";
            if (0 == s || s < 0) n = "transform:translateX(0px);", o = "transform:translateX(88px);"; else if (0 < s) {
                n = "transform:translateX(-" + s + "px);", o = "transform:translateX(" + (r - s) + "px);", 
                r <= s && (n = "transform:translateX(-88px);", o = "transform:translateX(0px);");
            }
            var l = t.currentTarget.dataset.index, i = t.currentTarget.dataset.type;
            if (console.log(i), "0" == i) {
                var u = a.data.falseList;
                u[l].txtStyle = n, u[l].delStyle = o, a.setData({
                    falseList: u
                });
            } else {
                var d = a.data.trueList;
                d[l].txtStyle = n, d[l].delStyle = o, a.setData({
                    trueList: d
                });
            }
        }
    },
    touchE: function(t) {
        var a = this;
        if (1 == t.changedTouches.length) {
            var e = t.changedTouches[0].clientX, s = a.data.startX - e, r = a.data.delBtnWidth, n = r / 2 < s ? "transform:translateX(-88px);" : "transform:translateX(0px);", o = r / 2 < s ? "transform:translateX(0px);" : "transform:translateX(88px);", l = t.currentTarget.dataset.index;
            if ("0" == t.currentTarget.dataset.type) {
                var i = a.data.falseList;
                i[l].txtStyle = n, i[l].delStyle = o, a.setData({
                    falseList: i
                });
            } else {
                var u = a.data.trueList;
                u[l].txtStyle = n, u[l].delStyle = o, a.setData({
                    trueList: u
                });
            }
        }
    },
    getlist: function() {
        var a = this;
        a.setData({
            total: 0,
            delBtnWidth: 88
        });
        a.data.page, a.data.hasMore, a.data.list;
        app.util.getUserInfo(function() {
            "" != wx.getStorageSync("userInfo") ? app.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "select_addr",
                    store_id: a.data.store_id
                },
                success: function(t) {
                    t = t.data;
                    a.setData({
                        isShow: 1
                    }), 0 < t.result.total ? a.setData({
                        total: t.result.total,
                        trueList: t.result.truelist,
                        truecount: t.result.truecount,
                        falsecount: t.result.falsecount,
                        falseList: t.result.falselist
                    }) : a.setData({
                        total: 0
                    });
                }
            }) : wx.navigateTo({
                url: "/deam_food/pages/auth/auth"
            });
        });
    },
    delAddr: function(a) {
        var r = this;
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
                        "1" == (t = t.data).status ? r.getlist() : wx.showModal({
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
                    var e = r.data.trueList;
                    null != e && (e.forEach(function(t, a) {
                        e[a].txtStyle = "transform:translateX(0px);", e[a].delStyle = "transform:translateX(88px);";
                    }), r.setData({
                        trueList: e
                    }));
                    var s = r.data.falseList;
                    null != s && (s.forEach(function(t, a) {
                        s[a].txtStyle = "transform:translateX(0px);", s[a].delStyle = "transform:translateX(88px);";
                    }), r.setData({
                        falseList: s
                    }));
                }
            }
        });
    },
    chooseAddr: function(t) {
        console.log(t.currentTarget.dataset);
        var a = getCurrentPages();
        a[a.length - 1];
        a[a.length - 2].setData({
            myAddrInfo: t.currentTarget.dataset,
            isAddr: 1
        }), wx.navigateBack();
    }
});