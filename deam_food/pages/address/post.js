var t = getApp();

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
        void 0 != e.addr_id && t.util.getUserInfo(function() {
            "" != wx.getStorageSync("userInfo") ? t.util.request({
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
        t.util.request({
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
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    chooseAddr: function() {
        var t = this;
        wx.chooseLocation({
            success: function(e) {
                var a = e.latitude, o = e.longitude;
                t.setData({
                    latitude: a,
                    longitude: o,
                    name: e.name,
                    address: e.address
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
        var e = this;
        return "" == e.data.realname ? (wx.showModal({
            title: "提示",
            content: "请填写联系人",
            confirmText: "好的",
            confirmColor: "#ff9c37",
            showCancel: !1,
            success: function(t) {}
        }), !1) : "" == e.data.telphone ? (wx.showModal({
            title: "提示",
            content: "请填写联系电话",
            confirmText: "好的",
            confirmColor: "#ff9c37",
            showCancel: !1,
            success: function(t) {}
        }), !1) : /^1[34578]\d{9}$/.test(e.data.telphone) ? "" == e.data.name ? (wx.showModal({
            title: "提示",
            content: "请选择收货地址",
            confirmText: "好的",
            confirmColor: "#ff9c37",
            showCancel: !1,
            success: function(t) {}
        }), !1) : (e.setData({
            isSubmit: 1
        }), void t.util.request({
            url: "entry/wxapp/deampost",
            cachetime: "0",
            showLoading: !0,
            method: "post",
            data: {
                op: "submitaddr",
                addressid: e.data.addressid,
                realname: e.data.realname,
                telphone: e.data.telphone,
                address: e.data.address,
                name: e.data.name,
                latitude: e.data.latitude,
                longitude: e.data.longitude,
                addrnumber: e.data.addrNumber
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