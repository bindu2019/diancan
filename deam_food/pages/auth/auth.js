var t = getApp();

Page({
    data: {},
    onLoad: function(n) {
        var a = this;
        t.util.request({
            url: "entry/wxapp/data",
            cachetime: "0",
            showLoading: !0,
            data: {
                op: "auth_setting"
            },
            success: function(t) {
                var t = t.data;
                a.setData({
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
    updateUserInfo: function(n) {
        t.util.getUserInfo(function(t) {
            console.log(t), t.memberInfo.uid > 0 && wx.navigateBack({});
        }, n.detail);
    },
    jumpUrl: function(t) {
        var n = t.currentTarget.dataset.url;
        "" != n && wx.reLaunch({
            url: n
        });
    }
});