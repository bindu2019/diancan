var t = getApp();

Page({
    data: {
        isopen: 0
    },
    onLoad: function(t) {},
    onReady: function() {},
    onShow: function() {
        var e = this;
        t.util.request({
            url: "entry/wxapp/settings",
            cachetime: "0",
            showLoading: !0,
            success: function(t) {
                "1" == (t = t.data).status && (wx.setNavigationBarColor && wx.setNavigationBarColor({
                    frontColor: t.result.fg_color,
                    backgroundColor: t.result.bg_color
                }), wx.setNavigationBarTitle({
                    title: "充值中心"
                }), e.setData({
                    shareTitle: t.result.share_title,
                    memberBgColor: t.result.bg_color
                }));
            }
        }), t.util.getUserInfo(function() {
            var t = wx.getStorageSync("userInfo");
            "" != t ? (console.log(t.memberInfo), e.setData({
                userInfo: t,
                isShow: 1
            })) : wx.navigateTo({
                url: "/deam_food/pages/auth/auth"
            });
        }), t.util.request({
            url: "entry/wxapp/data",
            cachetime: "0",
            showLoading: !0,
            data: {
                op: "recharge"
            },
            success: function(t) {
                "1" == (t = t.data).status && e.setData({
                    memberInfo: t.result.memberinfo,
                    acts: t.result.acts,
                    actsCount: t.result.acts_count
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    bindKeyRechargeValue: function(t) {
        this.setData({
            rechargeValue: t.detail.value
        });
    },
    payBtn: function() {
        var e = this, a = parseFloat(e.data.rechargeValue);
        a > 0 ? t.util.request({
            url: "entry/wxapp/deampost",
            cachetime: "0",
            showLoading: !0,
            method: "post",
            data: {
                op: "recharge",
                price: a
            },
            success: function(t) {
                "1" == (t = t.data).status ? wx.requestPayment({
                    timeStamp: t.result.timeStamp.toString(),
                    nonceStr: t.result.nonceStr,
                    package: t.result.package,
                    signType: "MD5",
                    paySign: t.result.paySign,
                    success: function(t) {
                        wx.showModal({
                            title: "提示",
                            content: "充值成功！",
                            showCancel: !1,
                            success: function(t) {
                                t.confirm && wx.navigateBack();
                            }
                        });
                    },
                    fail: function(t) {
                        e.setData({
                            isSubmit: 0
                        });
                    }
                }) : wx.showModal({
                    title: "提示",
                    content: t.result.message,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm;
                    }
                });
            }
        }) : wx.showModal({
            title: "提示",
            content: "请输入正确的充值金额！",
            showCancel: !1,
            success: function(t) {}
        });
    },
    tabActive: function() {
        var t = this, e = t.data.isopen;
        e = "0" == e ? "1" : "0", t.setData({
            isopen: e
        });
    }
});