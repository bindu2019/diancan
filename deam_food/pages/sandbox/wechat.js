var app = getApp();

Page({
    data: {},
    onLoad: function(t) {
        wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: "#000000"
        }), wx.setNavigationBarTitle({
            title: "点沐-开通免充值代金券"
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    topay: function(t) {
        app.util.request({
            url: "entry/wxapp/sandbox",
            cachetime: "0",
            showLoading: !0,
            method: "post",
            data: {
                op: "topay"
            },
            success: function(t) {
                "1" == (t = t.data).status ? wx.requestPayment({
                    timeStamp: t.result.timeStamp.toString(),
                    nonceStr: t.result.nonceStr,
                    package: t.result.package,
                    signType: "MD5",
                    paySign: t.result.paySign,
                    success: function(t) {
                        wx.showToast({
                            title: "支付成功",
                            icon: "success",
                            duration: 2e3
                        });
                    },
                    fail: function(t) {}
                }) : wx.showModal({
                    title: "提示",
                    content: t.result.message,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm;
                    }
                });
            }
        });
    }
});