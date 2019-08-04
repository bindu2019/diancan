var app = getApp();

Page({
    data: {
        addressid: 0,
        realname: "",
        telphone: "",
        address: "",
        name: "",
        latitude: "",
        longitude: "",
        addrNumber: "",
        userInfo: {},
        isShow: 0,
        isSubmit: 0,
        userId: 0
    },
    onLoad: function(e) {
        var a = this;
        null != e.addr_id && app.util.getUserInfo(function() {
            "" != wx.getStorageSync("userInfo") ? app.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "addr_detail",
                    addressid: e.addr_id
                },
                success: function(t) {
                    "1" == (t = t.data).status ? a.setData({
                        addressid: e.addr_id,
                        realname: t.result.realname,
                        telphone: t.result.telphone,
                        address: t.result.address_road,
                        name: t.result.address,
                        latitude: t.result.latitude,
                        longitude: t.result.longitude,
                        addrNumber: t.result.number
                    }) : wx.showModal({
                        title: "提示",
                        content: t.result.message,
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && wx.navigateBack();
                        }
                    });
                }
            }) : wx.navigateTo({
                url: "/deam_food/pages/auth/auth"
            });
        });
    },
    onReady: function() {},
    onShow: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/settings",
            cachetime: "0",
            showLoading: !1,
            success: function(t) {
                "1" == (t = t.data).status && (wx.setNavigationBarColor && wx.setNavigationBarColor({
                    frontColor: t.result.fg_color,
                    backgroundColor: t.result.bg_color
                }), 0 != e.data.addressid ? wx.setNavigationBarTitle({
                    title: "修改地址"
                }) : wx.setNavigationBarTitle({
                    title: "添加地址"
                }));
            }
        }), app.util.getUserInfo(function() {
            wx.getStorageSync("userInfo");
            e.setData({
                isShow: 1
            });
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    chooseAddr: function() {
        var o = this;
        wx.chooseLocation({
            success: function(t) {
                var e = t.latitude, a = t.longitude;
                o.setData({
                    latitude: e,
                    longitude: a,
                    name: t.name,
                    address: t.address
                });
            },
            fail: function(t) {
                "chooseLocation:fail 用户拒绝授权" == t.errMsg && wx.showModal({
                    title: "提示",
                    content: "请先允许获取位置",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.openSetting();
                    }
                });
            }
        });
    },
    bindKeyRealname: function(t) {
        this.setData({
            realname: t.detail.value
        });
    },
    bindKeyTelphone: function(t) {
        this.setData({
            telphone: t.detail.value
        });
    },
    bindKeyAddrNumber: function(t) {
        this.setData({
            addrNumber: t.detail.value
        });
    },
    submitAddr: function() {
        var t = this;
        return "" == t.data.realname ? (wx.showModal({
            title: "提示",
            content: "请填写联系人",
            confirmText: "好的",
            confirmColor: "#ff9c37",
            showCancel: !1,
            success: function(t) {}
        }), !1) : "" == t.data.telphone ? (wx.showModal({
            title: "提示",
            content: "请填写联系电话",
            confirmText: "好的",
            confirmColor: "#ff9c37",
            showCancel: !1,
            success: function(t) {}
        }), !1) : /^1[34578]\d{9}$/.test(t.data.telphone) ? "" == t.data.name ? (wx.showModal({
            title: "提示",
            content: "请选择收货地址",
            confirmText: "好的",
            confirmColor: "#ff9c37",
            showCancel: !1,
            success: function(t) {}
        }), !1) : (t.setData({
            isSubmit: 1
        }), void app.util.request({
            url: "entry/wxapp/deampost",
            cachetime: "0",
            showLoading: !0,
            method: "post",
            data: {
                op: "submitaddr",
                addressid: t.data.addressid,
                realname: t.data.realname,
                telphone: t.data.telphone,
                address: t.data.address,
                name: t.data.name,
                latitude: t.data.latitude,
                longitude: t.data.longitude,
                addrnumber: t.data.addrNumber
            },
            success: function(t) {
                "1" == (t = t.data).status ? (wx.showToast({
                    title: t.result.message,
                    icon: "success",
                    duration: 2e3
                }), setTimeout(function() {
                    wx.navigateBack();
                }, 1e3)) : wx.showModal({
                    title: "提示",
                    content: t.result.message,
                    showCancel: !1,
                    confirmColor: "#ff9c37",
                    success: function(t) {
                        t.confirm;
                    }
                });
            }
        })) : (wx.showModal({
            title: "提示",
            content: "请填写合法的手机号",
            confirmText: "好的",
            confirmColor: "#ff9c37",
            showCancel: !1,
            success: function(t) {}
        }), !1);
    }
});