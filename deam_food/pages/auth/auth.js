var app = getApp();

Page({
    data: {},
    onLoad: function(t) {
        var n = this;
        app.util.request({
            url: "entry/wxapp/data",
            cachetime: "0",
            showLoading: !0,
            data: {
                op: "auth_setting"
            },
            success: function(t) {
                t = t.data;
                n.setData({
                    authSetting: t.result.auth_setting
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    updateUserInfo: function(t) {
        app.util.getUserInfo(function(t) {
            console.log(t), 0 < t.memberInfo.uid && wx.navigateBack({});
        }, t.detail);
    },
    jumpUrl: function(t) {
        var n = t.currentTarget.dataset.url;
        "" != n && wx.reLaunch({
            url: n
        });
    }
});