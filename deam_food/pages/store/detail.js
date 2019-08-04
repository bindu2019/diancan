var app = getApp();

Page({
    data: {
        windowHeight: 0,
        currentId: 0,
        currentIdRight: 0,
        classList: [],
        storeInfo: [],
        goodsList: {},
        currentClassname: "",
        isShow: 0,
        lastClass: 0,
        classHeight: 0,
        cart: [],
        optionShow: 0,
        goodsDetailList: {},
        currentGoodsid: 0,
        storeid: 0,
        optionsChoosedname: [],
        optionsChoosedid: 0,
        optionsIspbox: 0,
        optionsPboxprice: 0,
        cartCount: 0,
        cartPrice: 0,
        cartRealPrice: 0,
        cartShow: 0,
        statusMask: 0,
        isSubmit: 0,
        remarkValue: "",
        deskid: 0,
        deskname: "",
        storeType: "",
        sendFee: 0,
        startPrice: 0,
        sendLimit: 0,
        pboxPrice: 0,
        lastPrice: 0,
        shareTitle: "",
        bg_color: "#ffffff",
        y: 200,
        canIUseOfficialAccount: wx.canIUse("official-account")
    },
    onLoad: function(i) {
        var n = this;
        null != i.type && "" != i.type && n.setData({
            storeType: "takeout"
        }), wx.removeStorageSync("cart"), wx.removeStorageSync("cartCount"), wx.removeStorageSync("cartPrice"), 
        wx.removeStorageSync("remarkValue"), wx.removeStorageSync("pboxPrice"), wx.removeStorageSync("sendFee"), 
        app.util.request({
            url: "entry/wxapp/settings",
            cachetime: "0",
            showLoading: !1,
            success: function(t) {
                "1" == (t = t.data).status && n.setData({
                    shareTitle: t.result.share_title,
                    settings: t.result
                });
            }
        }), app.util.request({
            url: "entry/wxapp/data",
            cachetime: "0",
            showLoading: !0,
            data: {
                op: "storeinfo",
                storeid: i.store_id,
                deskid: i.desk_id,
                storetype: n.data.storeType
            },
            success: function(t) {
                if ("1" == (t = t.data).status) {
                    if (wx.setNavigationBarColor && wx.setNavigationBarColor({
                        frontColor: t.result.storeinfo.fg_color,
                        backgroundColor: t.result.storeinfo.bg_color
                    }), wx.setNavigationBarTitle({
                        title: t.result.storeinfo.name
                    }), 0 < t.result.classlist.length) var a = t.result.classlist[0].classname, e = t.result.classlist.length - 1;
                    n.setData({
                        bg_color: t.result.storeinfo.bg_color,
                        classList: t.result.classlist,
                        goodsList: t.result.goodslist,
                        currentClassname: a,
                        storeInfo: t.result.storeinfo,
                        isShow: 1,
                        lastClass: e,
                        storeid: i.store_id,
                        deskid: i.desk_id,
                        remarkValue: t.result.storeinfo.remark_text
                    }), "takeout" == n.data.storeType && (n.setData({
                        sendFee: t.result.storeinfo.send_fee,
                        startPrice: t.result.storeinfo.start_price,
                        sendLimit: t.result.storeinfo.send_limit
                    }), console.log(n.data)), null != t.result.deskinfo && n.setData({
                        deskname: t.result.deskinfo.name
                    });
                    var o = "" == n.data.deskname ? 0 : 28, s = wx.getSystemInfoSync().windowHeight, r = 0;
                    0 < t.result.storeinfo.enoughmoney && 0 < t.result.storeinfo.enoughdeduct && (r = 35), 
                    n.setData({
                        windowHeight: s - 55 - o - r
                    }), n.reckonGoodsHeight(), "0" == t.result.storeinfo.storeStatus ? n.setData({
                        statusMask: 1
                    }) : "2" == t.result.storeinfo.storeStatus && n.setData({
                        statusMask: 1
                    });
                } else wx.showModal({
                    title: "提示",
                    content: t.result.message,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.navigateBack();
                    }
                });
            }
        });
        var t = wx.getSystemInfoSync();
        console.log(t);
        var a = .6 * t.windowHeight, e = .84 * t.windowWidth;
        n.setData({
            goodsMaskHeight: a,
            goodsMaskWidth: e,
            goodsDetailHeight: .4 * a - 66 - 45
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return {
            title: this.data.shareTitle,
            path: "",
            success: function(t) {},
            fail: function(t) {}
        };
    },
    scrollGoods: function(t) {
        for (var a = this, e = t.detail.scrollTop, o = a.data.classHeight, s = a.data.classList, r = 0; r < o.length; r++) if (e <= o[r]) return a.setData({
            currentId: r,
            currentClassname: s[r].classname
        }), !1;
    },
    chooseClass: function(t) {
        var a = t.currentTarget.dataset.classid;
        this.setData({
            currentId: a,
            currentIdRight: a,
            currentClassname: t.currentTarget.dataset.classname
        });
    },
    reckonGoodsHeight: function() {
        var t = this.data.goodsList, e = [], o = 0;
        if (t.length <= 0) return !1;
        t.forEach(function(t, a) {
            0 == a ? o = 100 * t.length : o += 100 * t.length + 28, e[a] = o;
        }), this.setData({
            classHeight: e
        });
    },
    chooseSelect: function(t) {
        var o = t.currentTarget.dataset.goodsid, e = t.currentTarget.dataset.id, a = t.currentTarget.dataset.optionid, s = this.data.goodsDetailList, r = [], i = [], n = 0;
        s[o].specs[a].items.forEach(function(t, a) {
            t.active = "", t.id == e && (t.active = "active");
        }), s[o].specs.forEach(function(t, a) {
            t.items.forEach(function(t, a) {
                "active" == t.active && (r.push(t.id), i.push(t.title));
            });
        }), s[o].options.forEach(function(t, a) {
            var e = t.specs;
            (e = e.split("_").sort().join("_")) == r.sort().join("_") && (s[o].price = t.marketprice, 
            n = t.id);
        }), this.setData({
            goodsDetailList: s,
            optionsChoosedname: i,
            optionsChoosedid: n
        });
    },
    plus: function(t) {
        var a = this, o = t.currentTarget.dataset.goodsid, e = t.currentTarget.dataset.hasoption, s = t.currentTarget.dataset.goodsname, r = a.data.cart, i = t.currentTarget.dataset.ispbox, n = 0 < t.currentTarget.dataset.pboxprice ? parseFloat(t.currentTarget.dataset.pboxprice) : 0;
        if (null == r[o] && (r[o] = {}, r[o].count = 0, r[o].options = [], r[o].hasoption = e, 
        r[o].goodsid = o, r[o].name = s, r[o].is_pbox = i, r[o].pbox_price = n), "1" == e) {
            a.setData({
                optionsIspbox: i,
                optionsPboxprice: n
            });
            var c = a.data.goodsDetailList, d = [], u = [], l = 0;
            null == c[o] ? app.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "goodsinfo",
                    goodsid: o,
                    storeid: a.data.storeid
                },
                success: function(t) {
                    "1" == (t = t.data).status && (c[o] = {}, c[o].specs = t.result.specs, c[o].options = t.result.options, 
                    c[o].name = s, c[o].specs.forEach(function(t, a) {
                        t.items.forEach(function(t, a) {
                            "0" == a && (t.active = "active", d.push(t.id), u.push(t.title));
                        });
                    }), c[o].options.forEach(function(t, a) {
                        var e = t.specs;
                        (e = e.split("_").sort().join("_")) == d.sort().join("_") && (c[o].price = t.marketprice, 
                        l = t.id);
                    }), a.setData({
                        goodsDetailList: c,
                        optionShow: 1,
                        currentGoodsid: o,
                        optionsChoosedname: u,
                        optionsChoosedid: l
                    }));
                }
            }) : (c[o].specs.forEach(function(t, a) {
                t.items.forEach(function(t, a) {
                    t.active = "", "0" == a && (t.active = "active", d.push(t.id), u.push(t.title));
                });
            }), c[o].options.forEach(function(t, a) {
                var e = t.specs;
                (e = e.split("_").sort().join("_")) == d.sort().join("_") && (c[o].price = t.marketprice, 
                l = t.id);
            }), a.setData({
                goodsDetailList: c,
                optionShow: 1,
                optionsChoosedname: u,
                optionsChoosedid: l,
                currentGoodsid: o
            }));
        } else {
            var p = t.currentTarget.dataset.goodsprice;
            r[o].count += 1;
            var h = a.changeTwoDecimal_f(r[o].count * p);
            if (r[o].totalprice = h, r[o].marketprice = a.changeTwoDecimal_f(p), a.setData({
                cart: r
            }), "takeout" == a.data.storeType && "1" == i && 0 < n) {
                var g = parseFloat(a.data.pboxPrice);
                g += n, g = a.changeTwoDecimal_f(g), a.setData({
                    pboxPrice: g
                });
            }
            a.reckonCart();
        }
    },
    minus: function(t) {
        var a = this, e = t.currentTarget.dataset.goodsid, o = t.currentTarget.dataset.hasoption, s = a.data.cart;
        if ("1" == o) wx.showModal({
            title: "提示",
            content: "多规格商品请到购物车中删减",
            showCancel: !1,
            success: function(t) {
                t.confirm && a.showCart();
            }
        }); else {
            s[e].count -= 1;
            var r = t.currentTarget.dataset.goodsprice, i = a.changeTwoDecimal_f(s[e].count * r);
            if (s[e].totalprice = i, s[e].marketprice = a.changeTwoDecimal_f(r), a.setData({
                cart: s
            }), "takeout" == a.data.storeType) {
                var n = t.currentTarget.dataset.ispbox, c = parseFloat(t.currentTarget.dataset.pboxprice);
                if ("1" == n && 0 < c) {
                    var d = parseFloat(a.data.pboxPrice);
                    d -= c, d = a.changeTwoDecimal_f(d), a.setData({
                        pboxPrice: 0 <= d ? d : 0
                    });
                }
            }
            a.reckonCart();
        }
    },
    addCart: function(t) {
        var r = this, i = t.currentTarget.dataset.goodsid, a = r.data.goodsDetailList[i].options, n = r.data.optionsChoosedid, c = r.data.optionsChoosedname, d = r.data.cart;
        if (a.forEach(function(t, a) {
            if (n == t.id) {
                d[i].count += 1, null == d[i].options && (d[i].options = []), null == d[i].options[t.id] && (d[i].options[t.id] = {}, 
                d[i].options[t.id].count = 0, d[i].options[t.id].id = t.id, d[i].options[t.id].name = c.join("+"), 
                d[i].options[t.id].marketprice = t.marketprice), d[i].options[t.id].count += 1;
                var e = d[i].options[t.id].count, o = d[i].options[t.id].marketprice, s = r.changeTwoDecimal_f(e * o);
                d[i].options[t.id].price = s;
            }
        }), "takeout" == r.data.storeType) {
            var e = t.currentTarget.dataset.ispbox, o = parseFloat(t.currentTarget.dataset.pboxprice);
            if ("1" == e && 0 < o) {
                var s = parseFloat(r.data.pboxPrice);
                s += o, s = r.changeTwoDecimal_f(s), r.setData({
                    pboxPrice: s
                });
            }
        }
        r.setData({
            cart: d
        }), r.reckonCart(), r.hiddenOption();
    },
    optionMinus: function(t) {
        var a = this, e = t.currentTarget.dataset.goodsid, o = t.currentTarget.dataset.goodsprice, s = t.currentTarget.dataset.optionid, r = a.data.cart;
        if (r[e].count -= 1, r[e].options[s].count -= 1, r[e].options[s].price = a.changeTwoDecimal_f(r[e].options[s].count * o), 
        a.setData({
            cart: r
        }), "takeout" == a.data.storeType) {
            var i = t.currentTarget.dataset.ispbox, n = parseFloat(t.currentTarget.dataset.pboxprice);
            if ("1" == i && 0 < n) {
                var c = parseFloat(a.data.pboxPrice);
                c -= n, c = a.changeTwoDecimal_f(c), a.setData({
                    pboxPrice: 0 <= c ? c : 0
                });
            }
        }
        a.reckonCart();
    },
    optionPlus: function(t) {
        var a = this, e = t.currentTarget.dataset.goodsid, o = t.currentTarget.dataset.goodsprice, s = t.currentTarget.dataset.optionid, r = a.data.cart;
        if (r[e].count += 1, r[e].options[s].count += 1, r[e].options[s].price = a.changeTwoDecimal_f(r[e].options[s].count * o), 
        a.setData({
            cart: r
        }), "takeout" == a.data.storeType) {
            var i = t.currentTarget.dataset.ispbox, n = parseFloat(t.currentTarget.dataset.pboxprice);
            if ("1" == i && 0 < n) {
                var c = parseFloat(a.data.pboxPrice);
                c += n, c = a.changeTwoDecimal_f(c), a.setData({
                    pboxPrice: c
                });
            }
        }
        a.reckonCart();
    },
    hiddenOption: function(t) {
        this.setData({
            optionShow: 0
        });
    },
    hiddenCart: function() {
        this.setData({
            cartShow: 0
        });
    },
    reckonCart: function() {
        var e = this, t = e.data.cart, o = 0, s = 0;
        if (t.forEach(function(t, a) {
            o += t.count, s = Math.floor(100 * s) / 100, "0" == t.hasoption ? (t.totalprice = Math.floor(100 * t.totalprice) / 100, 
            s += t.totalprice) : t.options.forEach(function(t, a) {
                t.price = Math.floor(100 * t.price) / 100, s += t.price;
            }), s = e.changeTwoDecimal_f(s);
        }), o <= 0 && e.hiddenCart(), "takeout" == e.data.storeType) {
            var a = parseFloat(e.data.pboxPrice);
            s = a + parseFloat(s);
            var r = parseFloat(e.data.startPrice) - s;
            r = 0 <= r ? e.changeTwoDecimal_f(r) : 0, e.setData({
                lastPrice: r
            }), s = e.changeTwoDecimal_f(s);
        }
        e.setData({
            cartPrice: s,
            cartRealPrice: parseFloat(s),
            cartCount: o
        });
    },
    showCart: function(t) {
        0 < this.data.cartCount && this.setData({
            cartShow: 1
        });
    },
    trashCart: function() {
        var a = this;
        wx.showModal({
            title: "提示",
            content: "确定清空购物车？",
            success: function(t) {
                t.confirm && a.setData({
                    cart: [],
                    cartCount: 0,
                    cartPrice: 0,
                    cartRealPrice: 0,
                    cartShow: 0
                });
            }
        });
    },
    submitCart: function(t) {
        var a = this, e = t.currentTarget.dataset.status;
        return console.log(e), !(1 <= e) && (!(a.data.cartCount <= 0) && (a.setData({
            isSubmit: 1
        }), wx.setStorageSync("cart", a.data.cart), wx.setStorageSync("cartCount", a.data.cartCount), 
        wx.setStorageSync("cartPrice", a.data.cartPrice), wx.setStorageSync("remarkValue", a.data.remarkValue), 
        wx.setStorageSync("pboxPrice", a.data.pboxPrice), wx.setStorageSync("sendFee", a.data.sendFee), 
        void wx.navigateTo({
            url: "/deam_food/pages/order/confirm?store_id=" + a.data.storeid + "&desk_id=" + a.data.deskid + "&type=" + a.data.storeType
        })));
    },
    changeTwoDecimal_f: function(t) {
        var a = parseFloat(t);
        if (isNaN(a)) return a;
        var e = (a = Math.round(100 * t) / 100).toString(), o = e.indexOf(".");
        for (o < 0 && (o = e.length, e += "."); e.length <= o + 2; ) e += "0";
        return e;
    },
    showDetail: function(t) {
        var a = t.currentTarget.dataset;
        this.setData({
            goodsMask: 1,
            dGoodsImage: a.goodsimg,
            dGoodsDetail: a.goodsintro,
            dGoodsName: a.goodsname,
            dGoodsPrice: a.goodsprice
        });
    },
    hiddenDetail: function() {
        this.setData({
            goodsMask: 0,
            dGoodsImage: "",
            dGoodsDetail: "",
            dGoodsName: "",
            dGoodsPrice: ""
        });
    },
    clickBell: function(t) {
        var a = this;
        wx.showModal({
            title: "提示",
            content: "呼叫服务员？",
            showCancel: !0,
            success: function(t) {
                t.confirm && ("" == a.data.deskname ? wx.showModal({
                    title: "提示",
                    content: "扫描桌号二维码点餐才能呼叫服务员",
                    showCancel: !1
                }) : app.util.request({
                    url: "entry/wxapp/deampost",
                    cachetime: "0",
                    showLoading: !0,
                    data: {
                        op: "call_waiter",
                        desk_id: a.data.deskid,
                        store_id: a.data.storeid
                    },
                    success: function(t) {
                        "1" == (t = t.data).status ? wx.showToast({
                            title: "呼叫成功",
                            icon: "success",
                            duration: 2e3
                        }) : wx.showModal({
                            title: "提示",
                            content: t.result.message,
                            showCancel: !1,
                            success: function() {}
                        });
                    }
                }));
            }
        });
    },
    adLoad: function(t) {
        console.log(t);
    },
    adError: function(t) {
        console.log(t);
    }
});