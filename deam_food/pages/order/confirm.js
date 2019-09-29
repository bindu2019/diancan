var t = getApp();

Page({
    data: {
        isShow: 0,
        userId: 0,
        cart: [],
        cartCount: 0,
        cartPrice: 0,
        payPrice: 0,
        remarkLength: 20,
        placeholder: "",
        remarkValue: "",
        store_id: 0,
        desk_id: 0,
        isSubmit: 0,
        storeType: "",
        pboxPrice: 0,
        sendFee: 0,
        myAddrInfo: {},
        isAddr: 0,
        useCoupon: 0,
        couponPrice: 0,
        enoughdeduct: 0,
        getFoodTime: "",
        openBalance: 0,
        balance: "0.00",
        choosePayType: 0
    },
    onLoad: function(e) {
        var a = this, o = wx.getStorageSync("cart"), r = wx.getStorageSync("cartCount"), s = wx.getStorageSync("cartPrice"), n = s, i = wx.getStorageSync("remarkValue"), d = wx.getStorageSync("remarkValue"), c = wx.getStorageSync("pboxPrice"), u = wx.getStorageSync("sendFee"), l = 0;
        u = parseFloat(u) >= 0 ? parseFloat(u) : 0, void 0 != e.type && "" != e.type && (a.setData({
            storeType: "takeout"
        }), s = a.changeTwoDecimal_f(u + parseFloat(s)), n = s, u = a.changeTwoDecimal_f(u)), 
        t.util.request({
            url: "entry/wxapp/settings",
            cachetime: "0",
            showLoading: !1,
            data: {
                op: "storeInfo",
                store_id: e.store_id
            },
            success: function(t) {
                if ("1" == (t = t.data).status) {
                    var e = parseFloat(n);
                    t.result.storeinfo.enoughmoney > 0 && t.result.storeinfo.enoughdeduct > 0 && e >= t.result.storeinfo.enoughmoney ? (l = t.result.storeinfo.enoughdeduct, 
                    n = a.changeTwoDecimal_f(e - l), a.setData({
                        payPrice: n,
                        enoughdeduct: l,
                        cartPrice: n
                    }), console.log("有满减")) : (console.log("无满减"), a.setData({
                        payPrice: n,
                        cartPrice: s
                    }));
                }
            }
        }), a.setData({
            cart: o,
            cartCount: r,
            placeholder: i,
            texareaCon: d,
            store_id: e.store_id,
            desk_id: e.desk_id,
            pboxPrice: c,
            sendFee: u >= 0 ? u : 0,
            enoughdeduct: l
        }), "takeout" == a.data.storeType && wx.getLocation({
            type: "wgs84",
            success: function(e) {
                var o = e.latitude, r = e.longitude;
                e.speed, e.accuracy;
                t.util.getUserInfo(function() {
                    "" != wx.getStorageSync("userInfo") ? t.util.request({
                        url: "entry/wxapp/data",
                        cachetime: "0",
                        showLoading: !0,
                        data: {
                            op: "first_addr",
                            latitude: o,
                            longitude: r,
                            store_id: a.data.store_id
                        },
                        success: function(t) {
                            "1" == (t = t.data).status && a.setData({
                                myAddrInfo: t.result,
                                isAddr: 1
                            });
                        }
                    }) : wx.navigateTo({
                        url: "/deam_food/pages/auth/auth"
                    });
                });
            },
            fail: function(t) {
                wx.showModal({
                    title: "提示",
                    content: "请先允许获取当前位置",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.openSetting();
                    }
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        var e = this;
        t.util.request({
            url: "entry/wxapp/settings",
            cachetime: "0",
            showLoading: !0,
            data: {
                op: "storeInfo",
                store_id: e.data.store_id
            },
            success: function(t) {
                if ("1" == (t = t.data).status) {
                    wx.setNavigationBarColor && wx.setNavigationBarColor({
                        frontColor: t.result.fg_color,
                        backgroundColor: t.result.bg_color
                    }), "takeout" == e.data.storeType ? wx.setNavigationBarTitle({
                        title: "订单配送至"
                    }) : wx.setNavigationBarTitle({
                        title: "确认订单"
                    });
                    var a = "";
                    a = "0" == t.result.storeinfo.deliver_type ? "商家配送" : "1" == t.result.storeinfo.deliver_type && "1" == t.result.deliver_dada_status ? "达达配送" : "商家配送", 
                    e.setData({
                        isShow: 1,
                        deliverText: a,
                        storeinfo: t.result.storeinfo,
                        openBalance: t.result.sets.open_banlance
                    });
                }
            }
        }), "1" == e.data.isAddr && t.util.getUserInfo(function() {
            wx.getStorageSync("userInfo");
            t.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "check_addr",
                    address_id: e.data.myAddrInfo.id
                },
                success: function(t) {
                    "0" == (t = t.data).status && e.setData({
                        myAddrInfo: {},
                        isAddr: 0
                    });
                }
            });
        });
        var a = e.data.useCoupon;
        a > 0 ? t.util.request({
            url: "entry/wxapp/coupon",
            cachetime: "0",
            showLoading: !0,
            data: {
                store_id: e.data.store_id,
                price: e.data.cartPrice,
                store_type: e.data.storeType,
                op: "choose"
            },
            success: function(t) {
                (t = t.data).status >= 0 && t.result.list.forEach(function(t, o) {
                    console.log(t), t.id == a && e.setData({
                        couponTitle: t.title,
                        couponUse: t.max_use,
                        couponPrice: e.changeTwoDecimal_f(t.total_reduce_cost),
                        payPrice: e.changeTwoDecimal_f(parseFloat(e.data.cartPrice) - parseFloat(t.total_reduce_cost))
                    });
                });
            }
        }) : e.setData({
            couponUse: 0,
            couponPrice: 0,
            payPrice: e.data.cartPrice
        }), e.getUserInfo(), "takeout" != e.data.storeType && t.util.request({
            url: "entry/wxapp/data",
            cachetime: "0",
            showLoading: !0,
            data: {
                store_id: e.data.store_id,
                op: "getfood_time"
            },
            success: function(t) {
                1 == (t = t.data).status && e.setData({
                    getFoodTimeArr: t.result.getfood_time,
                    getFoodTime: "立即取餐"
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    getUserInfo: function() {
        var e = this;
        t.util.getUserInfo(function() {
            var t = wx.getStorageSync("userInfo");
            "" != t ? e.setData({
                userInfo: t
            }) : wx.navigateTo({
                url: "/deam_food/pages/auth/auth"
            });
        }), t.util.request({
            url: "entry/wxapp/data",
            cachetime: "0",
            showLoading: !0,
            data: {
                op: "memberinfo"
            },
            success: function(t) {
                "1" == (t = t.data).status && (console.log(t.result), e.setData({
                    memberInfo: t.result,
                    balance: t.result.credit2
                }));
            }
        });
    },
    submitOrder0: function(t) {
        var e = this;
        if ("takeout" == e.data.storeType && "0" == e.data.isAddr) return wx.showModal({
            title: "提示",
            content: "请先选择配送地址",
            confirmText: "好的",
            confirmColor: "#ff9c37",
            showCancel: !1
        }), !1;
        if ("1" == e.data.openBalance) e.setData({
            choosePayType: "1"
        }); else {
            var a = t;
            e.submitOrder(a);
        }
    },
    transferPay: function(t) {
        var e = t;
        this.submitOrder(e);
    },
    submitOrderConfirm: function(t) {
        var e = this, a = t;
        wx.showModal({
            title: "提示",
            content: "确认使用余额支付？",
            confirmText: "确认",
            confirmColor: "#ff9c37",
            success: function(t) {
                t.confirm && e.submitOrder(a);
            }
        });
    },
    submitOrder: function(e) {
        var a = this, o = e.currentTarget.dataset.status, r = e.currentTarget.dataset.type;
        if (o >= 1) return !1;
        void 0 == r && (r = "wechat"), console.log(r), a.setData({
            isSubmit: 1
        }), t.util.request({
            url: "entry/wxapp/deampost",
            cachetime: "0",
            showLoading: !0,
            method: "post",
            data: {
                op: "submitorder",
                cart: JSON.stringify(a.data.cart),
                cartCount: a.data.cartCount,
                cartPrice: a.data.payPrice,
                remark: a.data.remarkValue,
                store_id: a.data.store_id,
                desk_id: a.data.desk_id,
                order_type: a.data.storeType,
                pbox_fee: a.data.pboxPrice,
                send_fee: a.data.sendFee,
                address: JSON.stringify(a.data.myAddrInfo),
                use_coupon: a.data.useCoupon,
                coupon_price: a.data.couponPrice,
                enoughdeduct: a.data.enoughdeduct,
                getfood_time: a.data.getFoodTime,
                pay_type: r
            },
            success: function(t) {
                "1" == (t = t.data).status ? "balance" == r ? wx.redirectTo({
                    url: "/deam_food/pages/order/detail?id=" + t.result.order_id
                }) : "wechat" == r && (console.log(123), wx.requestPayment({
                    timeStamp: t.result.timeStamp.toString(),
                    nonceStr: t.result.nonceStr,
                    package: t.result.package,
                    signType: "MD5",
                    paySign: t.result.paySign,
                    success: function(e) {
                        wx.redirectTo({
                            url: "/deam_food/pages/order/detail?id=" + t.result.order_id
                        });
                    },
                    fail: function(t) {
                        a.setData({
                            isSubmit: 0
                        });
                    }
                })) : (wx.showModal({
                    title: "提示",
                    content: t.result.message,
                    confirmText: "好的",
                    confirmColor: "#ff9c37",
                    showCancel: !1
                }), a.setData({
                    isSubmit: 0
                }));
            }
        });
    },
    submitOrder_1: function(e) {
        var a = this, o = e.currentTarget.dataset.status;
        return console.log(o), !(o >= 1) && ("takeout" == a.data.storeType && "0" == a.data.isAddr ? (wx.showModal({
            title: "提示",
            content: "请先选择配送地址",
            confirmText: "好的",
            confirmColor: "#ff9c37",
            showCancel: !1,
            success: function(t) {
                t.confirm;
            }
        }), !1) : (a.setData({
            isSubmit: 1
        }), void t.util.request({
            url: "entry/wxapp/deampost",
            cachetime: "0",
            showLoading: !0,
            method: "post",
            data: {
                op: "submitorder",
                cart: JSON.stringify(a.data.cart),
                cartCount: a.data.cartCount,
                cartPrice: a.data.payPrice,
                remark: a.data.remarkValue,
                store_id: a.data.store_id,
                desk_id: a.data.desk_id,
                order_type: a.data.storeType,
                pbox_fee: a.data.pboxPrice,
                send_fee: a.data.sendFee,
                address: JSON.stringify(a.data.myAddrInfo),
                use_coupon: a.data.useCoupon,
                coupon_price: a.data.couponPrice,
                enoughdeduct: a.data.enoughdeduct,
                getfood_time: a.data.getFoodTime
            },
            success: function(t) {
                "1" == (t = t.data).status ? wx.requestPayment({
                    timeStamp: t.result.timeStamp.toString(),
                    nonceStr: t.result.nonceStr,
                    package: t.result.package,
                    signType: "MD5",
                    paySign: t.result.paySign,
                    success: function(e) {
                        wx.redirectTo({
                            url: "/deam_food/pages/order/detail?id=" + t.result.order_id
                        });
                    },
                    fail: function(t) {
                        a.setData({
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
        })));
    },
    checkCount: function(t) {
        var e = this, a = t.detail.value.length, o = e.data.remarkLength;
        o = 20 - a >= 0 ? 20 - a : "0", e.setData({
            remarkLength: o
        });
    },
    saveRemark: function(t) {
        var e = this, a = t.detail.value, o = a;
        "" == a && (o = e.data.texareaCon), e.setData({
            remarkValue: a,
            textareaInputField: 0,
            texareaCon: o
        });
    },
    changeTwoDecimal_f: function(t) {
        var e = parseFloat(t);
        if (isNaN(e)) return e;
        var a = (e = Math.round(100 * t) / 100).toString(), o = a.indexOf(".");
        for (o < 0 && (o = a.length, a += "."); a.length <= o + 2; ) a += "0";
        return a;
    },
    selectAddr: function() {
        var t = this;
        wx.navigateTo({
            url: "/deam_food/pages/address/selector?store_id=" + t.data.store_id + "&address_id=" + t.data.myAddrInfo.id
        });
    },
    chooseCoupon: function() {
        var t = this;
        wx.navigateTo({
            url: "/deam_food/pages/coupon/choose?store_id=" + t.data.store_id + "&price=" + t.data.cartPrice + "&type=" + t.data.storeType + "&useCoupon=" + t.data.useCoupon
        });
    },
    switchInputField: function() {
        this.setData({
            textareaInputField: 1,
            focus: !0
        });
    },
    bindPickerChange: function(t) {
        var e = this;
        e.setData({
            getFoodTime: e.data.getFoodTimeArr[t.detail.value]
        });
    },
    closeBtn: function(t) {
        this.setData({
            choosePayType: 0
        });
    }
});