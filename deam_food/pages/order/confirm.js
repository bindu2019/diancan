var app = getApp();

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
    onLoad: function(t) {
        var o = this, e = wx.getStorageSync("cart"), a = wx.getStorageSync("cartCount"), r = wx.getStorageSync("cartPrice"), s = r, n = wx.getStorageSync("remarkValue"), i = wx.getStorageSync("remarkValue"), d = wx.getStorageSync("pboxPrice"), c = wx.getStorageSync("sendFee"), u = 0;
        c = 0 <= parseFloat(c) ? parseFloat(c) : 0, null != t.type && "" != t.type && (o.setData({
            storeType: "takeout"
        }), r = o.changeTwoDecimal_f(c + parseFloat(r)), s = r, c = o.changeTwoDecimal_f(c)), 
        app.util.request({
            url: "entry/wxapp/settings",
            cachetime: "0",
            showLoading: !1,
            data: {
                op: "storeInfo",
                store_id: t.store_id
            },
            success: function(t) {
                if ("1" == (t = t.data).status) {
                    var e = parseFloat(s);
                    0 < t.result.storeinfo.enoughmoney && 0 < t.result.storeinfo.enoughdeduct && e >= t.result.storeinfo.enoughmoney ? (u = t.result.storeinfo.enoughdeduct, 
                    s = o.changeTwoDecimal_f(e - u), o.setData({
                        payPrice: s,
                        enoughdeduct: u,
                        cartPrice: s
                    }), console.log("有满减")) : (console.log("无满减"), o.setData({
                        payPrice: s,
                        cartPrice: r
                    }));
                }
            }
        }), o.setData({
            cart: e,
            cartCount: a,
            placeholder: n,
            texareaCon: i,
            store_id: t.store_id,
            desk_id: t.desk_id,
            pboxPrice: d,
            sendFee: 0 <= c ? c : 0,
            enoughdeduct: u
        }), "takeout" == o.data.storeType && wx.getLocation({
            type: "wgs84",
            success: function(t) {
                var e = t.latitude, a = t.longitude;
                t.speed, t.accuracy;
                app.util.getUserInfo(function() {
                    "" != wx.getStorageSync("userInfo") ? app.util.request({
                        url: "entry/wxapp/data",
                        cachetime: "0",
                        showLoading: !0,
                        data: {
                            op: "first_addr",
                            latitude: e,
                            longitude: a,
                            store_id: o.data.store_id
                        },
                        success: function(t) {
                            "1" == (t = t.data).status && o.setData({
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
        var a = this;
        app.util.request({
            url: "entry/wxapp/settings",
            cachetime: "0",
            showLoading: !0,
            data: {
                op: "storeInfo",
                store_id: a.data.store_id
            },
            success: function(t) {
                if ("1" == (t = t.data).status) {
                    wx.setNavigationBarColor && wx.setNavigationBarColor({
                        frontColor: t.result.fg_color,
                        backgroundColor: t.result.bg_color
                    }), "takeout" == a.data.storeType ? wx.setNavigationBarTitle({
                        title: "订单配送至"
                    }) : wx.setNavigationBarTitle({
                        title: "确认订单"
                    });
                    var e = "";
                    e = "0" == t.result.storeinfo.deliver_type ? "商家配送" : "1" == t.result.storeinfo.deliver_type && "1" == t.result.deliver_dada_status ? "达达配送" : "商家配送", 
                    a.setData({
                        isShow: 1,
                        deliverText: e,
                        storeinfo: t.result.storeinfo,
                        openBalance: t.result.sets.open_banlance
                    });
                }
            }
        }), "1" == a.data.isAddr && app.util.getUserInfo(function() {
            wx.getStorageSync("userInfo");
            app.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "check_addr",
                    address_id: a.data.myAddrInfo.id
                },
                success: function(t) {
                    "0" == (t = t.data).status && a.setData({
                        myAddrInfo: {},
                        isAddr: 0
                    });
                }
            });
        });
        var o = a.data.useCoupon;
        0 < o ? app.util.request({
            url: "entry/wxapp/coupon",
            cachetime: "0",
            showLoading: !0,
            data: {
                store_id: a.data.store_id,
                price: a.data.cartPrice,
                store_type: a.data.storeType,
                op: "choose"
            },
            success: function(t) {
                0 <= (t = t.data).status && t.result.list.forEach(function(t, e) {
                    console.log(t), t.id == o && a.setData({
                        couponTitle: t.title,
                        couponUse: t.max_use,
                        couponPrice: a.changeTwoDecimal_f(t.total_reduce_cost),
                        payPrice: a.changeTwoDecimal_f(parseFloat(a.data.cartPrice) - parseFloat(t.total_reduce_cost))
                    });
                });
            }
        }) : a.setData({
            couponUse: 0,
            couponPrice: 0,
            payPrice: a.data.cartPrice
        }), a.getUserInfo(), "takeout" != a.data.storeType && app.util.request({
            url: "entry/wxapp/data",
            cachetime: "0",
            showLoading: !0,
            data: {
                store_id: a.data.store_id,
                op: "getfood_time"
            },
            success: function(t) {
                1 == (t = t.data).status && a.setData({
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
        app.util.getUserInfo(function() {
            var t = wx.getStorageSync("userInfo");
            "" != t ? e.setData({
                userInfo: t
            }) : wx.navigateTo({
                url: "/deam_food/pages/auth/auth"
            });
        }), app.util.request({
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
    submitOrder: function(t) {
        var a = this, e = t.currentTarget.dataset.status, o = t.currentTarget.dataset.type;
        if (1 <= e) return !1;
        null == o && (o = "wechat"), console.log(o), a.setData({
            isSubmit: 1
        }), app.util.request({
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
                pay_type: o
            },
            success: function(e) {
                "1" == (e = e.data).status ? "balance" == o ? wx.redirectTo({
                    url: "/deam_food/pages/order/detail?id=" + e.result.order_id
                }) : "wechat" == o && (console.log(123), wx.requestPayment({
                    timeStamp: e.result.timeStamp.toString(),
                    nonceStr: e.result.nonceStr,
                    package: e.result.package,
                    signType: "MD5",
                    paySign: e.result.paySign,
                    success: function(t) {
                        wx.redirectTo({
                            url: "/deam_food/pages/order/detail?id=" + e.result.order_id
                        });
                    },
                    fail: function(t) {
                        a.setData({
                            isSubmit: 0
                        });
                    }
                })) : (wx.showModal({
                    title: "提示",
                    content: e.result.message,
                    confirmText: "好的",
                    confirmColor: "#ff9c37",
                    showCancel: !1
                }), a.setData({
                    isSubmit: 0
                }));
            }
        });
    },
    submitOrder_1: function(t) {
        var a = this, e = t.currentTarget.dataset.status;
        return console.log(e), !(1 <= e) && ("takeout" == a.data.storeType && "0" == a.data.isAddr ? (wx.showModal({
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
        }), void app.util.request({
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
            success: function(e) {
                "1" == (e = e.data).status ? wx.requestPayment({
                    timeStamp: e.result.timeStamp.toString(),
                    nonceStr: e.result.nonceStr,
                    package: e.result.package,
                    signType: "MD5",
                    paySign: e.result.paySign,
                    success: function(t) {
                        wx.redirectTo({
                            url: "/deam_food/pages/order/detail?id=" + e.result.order_id
                        });
                    },
                    fail: function(t) {
                        a.setData({
                            isSubmit: 0
                        });
                    }
                }) : wx.showModal({
                    title: "提示",
                    content: e.result.message,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm;
                    }
                });
            }
        })));
    },
    checkCount: function(t) {
        var e = t.detail.value.length, a = this.data.remarkLength;
        a = 0 <= 20 - e ? 20 - e : "0", this.setData({
            remarkLength: a
        });
    },
    saveRemark: function(t) {
        var e = t.detail.value, a = e;
        "" == e && (a = this.data.texareaCon), this.setData({
            remarkValue: e,
            textareaInputField: 0,
            texareaCon: a
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
        wx.navigateTo({
            url: "/deam_food/pages/address/selector?store_id=" + this.data.store_id + "&address_id=" + this.data.myAddrInfo.id
        });
    },
    chooseCoupon: function() {
        wx.navigateTo({
            url: "/deam_food/pages/coupon/choose?store_id=" + this.data.store_id + "&price=" + this.data.cartPrice + "&type=" + this.data.storeType + "&useCoupon=" + this.data.useCoupon
        });
    },
    switchInputField: function() {
        this.setData({
            textareaInputField: 1,
            focus: !0
        });
    },
    bindPickerChange: function(t) {
        this.setData({
            getFoodTime: this.data.getFoodTimeArr[t.detail.value]
        });
    }
});