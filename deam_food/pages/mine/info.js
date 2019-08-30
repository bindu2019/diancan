var e = getApp();

Page({
    data: {
        memberInfo: {}
    },
    onLoad: function(t) {
        var o = this, a = wx.getStorageSync("wx_settings");
        a.fg_color && a.bg_color ? wx.setNavigationBarColor && wx.setNavigationBarColor({
            frontColor: a.fg_color,
            backgroundColor: a.bg_color
        }) : wx.setNavigationBarColor({
            frontColor: "#000000",
            backgroundColor: "#FFFFFF"
        }), wx.setNavigationBarTitle({
            title: "个人资料"
        }), a && o.setData({
            wx_settings: a
        }), e.util.getUserInfo(function() {
            var t = wx.getStorageSync("userInfo");
            "" != t ? (o.setData({
                userInfo: t,
                isShow: 1
            }), e.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "memberinfo"
                },
                success: function(e) {
                    "1" == (e = e.data).status && o.setData({
                        memberInfo: e.result,
                        realname: e.result.realname
                    });
                }
            })) : wx.navigateTo({
                url: "/deam_food/pages/auth/auth"
            });
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    getPhoneNumber: function(t) {
        var o = this;
        console.log(t.detail), t.detail.encryptedData && e.util.request({
            url: "entry/wxapp/data",
            cachetime: "0",
            showLoading: !0,
            data: {
                op: "getPhoneNumber",
                encryptedData: encodeURIComponent(t.detail.encryptedData),
                iv: t.detail.iv
            },
            success: function(e) {
                "1" == (e = e.data).status ? o.setData({
                    memberInfo: e.result
                }) : wx.showModal({
                    title: "提示",
                    content: e.result.message,
                    showCancel: !1,
                    confirmColor: "#ff9c37"
                });
            }
        });
    },
    bindKeyRealname: function(e) {
        var t = this, o = e.detail.value;
        t.setData({
            realname: o
        });
    },
    formSubmit: function(t) {
        console.log(t.detail.formId), "" != t.detail.value.realname && void 0 != t.detail.value.realname || wx.showModal({
            title: "提示",
            content: "请先输入姓名",
            showCancel: !1,
            confirmColor: "#ff9c37"
        }), e.util.request({
            url: "entry/wxapp/deampost",
            cachetime: "0",
            showLoading: !0,
            method: "post",
            data: {
                op: "set_memberinfo",
                realname: t.detail.value.realname,
                formid: t.detail.formId
            },
            success: function(e) {
                "1" == (e = e.data).status ? wx.showModal({
                    title: "提示",
                    content: "保存成功！",
                    showCancel: !1,
                    confirmColor: "#ff9c37"
                }) : wx.showModal({
                    title: "提示",
                    content: e.result.message,
                    showCancel: !1,
                    confirmColor: "#ff9c37"
                });
            }
        });
    }
});