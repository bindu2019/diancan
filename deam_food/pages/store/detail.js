var t = getApp();

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
        cartid: [],
        optionsid: {},
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
    onLoad: function(a) {
        var o = this;
        void 0 != a.type && "" != a.type && o.setData({
            storeType: "takeout"
        }), wx.removeStorageSync("cart"), wx.removeStorageSync("cartCount"), wx.removeStorageSync("cartPrice"), 
        wx.removeStorageSync("remarkValue"), wx.removeStorageSync("pboxPrice"), wx.removeStorageSync("sendFee"), 
        t.util.request({
            url: "entry/wxapp/settings",
            cachetime: "0",
            showLoading: !1,
            success: function(t) {
                "1" == (t = t.data).status && o.setData({
                    shareTitle: t.result.share_title,
                    settings: t.result
                });
            }
        }), t.util.request({
            url: "entry/wxapp/data",
            cachetime: "0",
            showLoading: !0,
            data: {
                op: "storeinfo",
                storeid: a.store_id,
                deskid: a.desk_id,
                storetype: o.data.storeType
            },
            success: function(t) {
                if ("1" == (t = t.data).status) {
                    if (wx.setNavigationBarColor && wx.setNavigationBarColor({
                        frontColor: t.result.storeinfo.fg_color,
                        backgroundColor: t.result.storeinfo.bg_color
                    }), wx.setNavigationBarTitle({
                        title: t.result.storeinfo.name
                    }), t.result.classlist.length > 0) var e = t.result.classlist[0].classname, s = t.result.classlist.length - 1;
                    o.setData({
                        bg_color: t.result.storeinfo.bg_color,
                        classList: t.result.classlist,
                        goodsList: t.result.goodslist,
                        currentClassname: e,
                        storeInfo: t.result.storeinfo,
                        isShow: 1,
                        lastClass: s,
                        storeid: a.store_id,
                        remarkValue: t.result.storeinfo.remark_text
                    }), void 0 != a.desk_id && o.setData({
                        deskid: a.desk_id
                    }), "takeout" == o.data.storeType && (o.setData({
                        sendFee: t.result.storeinfo.send_fee,
                        startPrice: t.result.storeinfo.start_price,
                        sendLimit: t.result.storeinfo.send_limit
                    }), console.log(o.data)), null != t.result.deskinfo && o.setData({
                        deskname: t.result.deskinfo.name
                    });
                    var r = "" == o.data.deskname ? 0 : 28, i = wx.getSystemInfoSync().windowHeight, n = 0;
                    t.result.storeinfo.enoughmoney > 0 && t.result.storeinfo.enoughdeduct > 0 && (n = 35), 
                    o.setData({
                        windowHeight: i - 55 - r - n
                    }), o.reckonGoodsHeight(), "0" == t.result.storeinfo.storeStatus ? o.setData({
                        statusMask: 1
                    }) : "2" == t.result.storeinfo.storeStatus && o.setData({
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
        var e = wx.getSystemInfoSync();
        console.log(e);
        var s = .7 * e.windowHeight, r = .75 * e.windowWidth;
        o.setData({
            goodsMaskHeight: s,
            goodsMaskWidth: r,
            goodsDetailHeight: .4 * s - 66 - 45
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
        for (var a = this, o = t.detail.scrollTop, e = a.data.classHeight, s = a.data.classList, r = 0; r < e.length; r++) if (o <= e[r]) return a.setData({
            currentId: r,
            currentClassname: s[r].classname
        }), !1;
    },
    chooseClass: function(t) {
        var a = this, o = t.currentTarget.dataset.classid;
        a.setData({
            currentId: o,
            currentIdRight: o,
            currentClassname: t.currentTarget.dataset.classname
        });
    },
    reckonGoodsHeight: function() {
        var t = this, a = t.data.goodsList, o = [], e = 0;
        if (a.length <= 0) return !1;
        a.forEach(function(t, a) {
            0 == a ? e = 100 * t.length : e += 100 * t.length + 28, o[a] = e;
        }), t.setData({
            classHeight: o
        });
    },
    chooseSelect: function(t) {
        var a = this, o = t.currentTarget.dataset.goodsid, e = t.currentTarget.dataset.id, s = t.currentTarget.dataset.optionid, r = a.data.goodsDetailList, i = [], n = [], c = 0;
        r[o].specs[s].items.forEach(function(t, a) {
            t.active = "", t.id == e && (t.active = "active");
        }), r[o].specs.forEach(function(t, a) {
            t.items.forEach(function(t, a) {
                "active" == t.active && (i.push(t.id), n.push(t.title));
            });
        }), r[o].options.forEach(function(t, a) {
            var e = t.specs;
            (e = e.split("_").sort().join("_")) == i.sort().join("_") && (r[o].price = t.marketprice, 
            c = t.id);
        }), a.setData({
            goodsDetailList: r,
            optionsChoosedname: n,
            optionsChoosedid: c
        });
    },
    plus: function(a) {
        var o = this, e = (a.currentTarget.dataset, a.currentTarget.dataset.goodsid), s = a.currentTarget.dataset.hasoption, r = a.currentTarget.dataset.goodsname, i = o.data.cart, n = o.data.cartid, c = a.currentTarget.dataset.ispbox, d = a.currentTarget.dataset.pboxprice > 0 ? parseFloat(a.currentTarget.dataset.pboxprice) : 0, u = n.indexOf(e);
        if (-1 == u) n.push(e), u = n.indexOf(e), (l = {}).count = 0, l.options = [], l.hasoption = s, 
        l.goodsid = e, l.name = r, l.is_pbox = c, l.pbox_price = d, i.push(l); else var l = i[u];
        if ("1" == s) {
            o.setData({
                optionsIspbox: c,
                optionsPboxprice: d
            });
            var p = o.data.goodsDetailList, f = [], g = [], h = 0;
            void 0 == p[e] ? t.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "goodsinfo",
                    goodsid: e,
                    storeid: o.data.storeid
                },
                success: function(t) {
                    "1" == (t = t.data).status && (p[e] = {}, p[e].specs = t.result.specs, p[e].options = t.result.options, 
                    p[e].name = r, p[e].specs.forEach(function(t, a) {
                        t.items.forEach(function(t, a) {
                            "0" == a && (t.active = "active", f.push(t.id), g.push(t.title));
                        });
                    }), p[e].options.forEach(function(t, a) {
                        var o = t.specs;
                        (o = o.split("_").sort().join("_")) == f.sort().join("_") && (p[e].price = t.marketprice, 
                        h = t.id);
                    }), o.setData({
                        goodsDetailList: p,
                        optionShow: 1,
                        currentGoodsid: e,
                        optionsChoosedname: g,
                        optionsChoosedid: h
                    }));
                }
            }) : (p[e].specs.forEach(function(t, a) {
                t.items.forEach(function(t, a) {
                    t.active = "", "0" == a && (t.active = "active", f.push(t.id), g.push(t.title));
                });
            }), p[e].options.forEach(function(t, a) {
                var o = t.specs;
                (o = o.split("_").sort().join("_")) == f.sort().join("_") && (p[e].price = t.marketprice, 
                h = t.id);
            }), o.setData({
                goodsDetailList: p,
                optionShow: 1,
                optionsChoosedname: g,
                optionsChoosedid: h,
                currentGoodsid: e
            }));
        } else {
            var m = a.currentTarget.dataset.goodsprice;
            i[u].count += 1;
            var w = o.changeTwoDecimal_f(i[u].count * m);
            i[u].totalprice = w, i[u].marketprice = o.changeTwoDecimal_f(m);
            var v = o.data.goodsList;
            if (v.forEach(function(t, a) {
                t.forEach(function(t, o) {
                    t.id == e && (v[a][o].count = i[u].count);
                });
            }), o.setData({
                cart: i,
                cartid: n,
                goodsList: v
            }), "takeout" == o.data.storeType && "1" == c && d > 0) {
                var x = parseFloat(o.data.pboxPrice);
                x += d, x = o.changeTwoDecimal_f(x), o.setData({
                    pboxPrice: x
                });
            }
            o.reckonCart();
        }
    },
    minus: function(t) {
        var a = this, o = (t.currentTarget.dataset, t.currentTarget.dataset.goodsid), e = t.currentTarget.dataset.hasoption, s = a.data.cart, r = a.data.cartid;
        if ("1" == e) wx.showModal({
            title: "提示",
            content: "多规格商品请到购物车中删减",
            showCancel: !1,
            success: function(t) {
                t.confirm && a.showCart();
            }
        }); else {
            var i = r.indexOf(o);
            s[i].count -= 1;
            var n = t.currentTarget.dataset.goodsprice, c = a.changeTwoDecimal_f(s[i].count * n);
            s[i].totalprice = c, s[i].marketprice = a.changeTwoDecimal_f(n);
            var d = a.data.goodsList;
            if ((d = a.data.goodsList).forEach(function(t, a) {
                t.forEach(function(t, e) {
                    t.id == o && (d[a][e].count = s[i].count);
                });
            }), a.setData({
                cart: s,
                goodsList: d
            }), "takeout" == a.data.storeType) {
                var u = t.currentTarget.dataset.ispbox, l = parseFloat(t.currentTarget.dataset.pboxprice);
                if ("1" == u && l > 0) {
                    var p = parseFloat(a.data.pboxPrice);
                    p -= l, p = a.changeTwoDecimal_f(p), a.setData({
                        pboxPrice: p >= 0 ? p : 0
                    });
                }
            }
            a.reckonCart();
        }
    },
    addCart: function(t) {
        var a = this, o = t.currentTarget.dataset.goodsid, e = a.data.goodsDetailList[o].options, s = a.data.optionsChoosedid, r = a.data.optionsChoosedname, i = a.data.cart, n = a.data.cartid, c = n.indexOf(o);
        if (-1 == c) n.push(o), c = n.indexOf(o), (d = {}).count = 0, d.options = [], d.hasoption = hasoption, 
        d.goodsid = o, d.name = goodsname, d.is_pbox = p, d.pbox_price = f, i.push(d); else var d = i[c];
        var u = {};
        e.forEach(function(t, e) {
            if (s == t.id) {
                void 0 == i[c].options ? (i[c].options = [], i[c].count = 1) : i[c].count += 1, 
                u = a.data.optionsid, console.log(u[o]), void 0 == u[o] && (u[o] = []);
                var n = u[o].indexOf(t.id);
                if (-1 == n) {
                    u[o].push(t.id), n = u[o].indexOf(t.id);
                    var d = {};
                    d.count = 0, d.id = t.id, d.name = r.join("+"), d.marketprice = t.marketprice, i[c].options.push(d);
                }
                console.log(n), i[c].options[n].count += 1;
                var l = i[c].options[n].count, p = i[c].options[n].marketprice, f = a.changeTwoDecimal_f(l * p);
                i[c].options[n].price = f;
            }
        });
        var l = a.data.goodsList;
        if (l.forEach(function(t, a) {
            t.forEach(function(t, e) {
                t.id == o && (l[a][e].count = i[c].count);
            });
        }), "takeout" == a.data.storeType) {
            var p = t.currentTarget.dataset.ispbox, f = parseFloat(t.currentTarget.dataset.pboxprice);
            if ("1" == p && f > 0) {
                var g = parseFloat(a.data.pboxPrice);
                g += f, g = a.changeTwoDecimal_f(g), a.setData({
                    pboxPrice: g
                });
            }
        }
        a.setData({
            cart: i,
            cartid: n,
            optionsid: u,
            goodsList: l
        }), a.reckonCart(), a.hiddenOption();
    },
    optionMinus: function(t) {
        var a = this, o = t.currentTarget.dataset.goodsid, e = t.currentTarget.dataset.goodsprice, s = t.currentTarget.dataset.optionid, r = a.data.cart, i = a.data.cartid, n = i.indexOf(o), c = a.data.optionsid[o].indexOf(s);
        r[n].count -= 1, r[n].options[c].count -= 1, r[n].options[c].price = a.changeTwoDecimal_f(r[n].options[c].count * e);
        var d = a.data.goodsList;
        if (d.forEach(function(t, a) {
            t.forEach(function(t, e) {
                t.id == o && (d[a][e].count = r[n].count);
            });
        }), a.setData({
            cart: r,
            cartid: i,
            goodsList: d
        }), "takeout" == a.data.storeType) {
            var u = t.currentTarget.dataset.ispbox, l = parseFloat(t.currentTarget.dataset.pboxprice);
            if ("1" == u && l > 0) {
                var p = parseFloat(a.data.pboxPrice);
                p -= l, p = a.changeTwoDecimal_f(p), a.setData({
                    pboxPrice: p >= 0 ? p : 0
                });
            }
        }
        a.reckonCart();
    },
    optionPlus: function(t) {
        var a = this, o = t.currentTarget.dataset.goodsid, e = t.currentTarget.dataset.goodsprice, s = t.currentTarget.dataset.optionid, r = a.data.cart, i = a.data.cartid, n = i.indexOf(o), c = a.data.optionsid[o].indexOf(s);
        r[n].count += 1, r[n].options[c].count += 1, r[n].options[c].price = a.changeTwoDecimal_f(r[n].options[c].count * e);
        var d = a.data.goodsList;
        if (d.forEach(function(t, a) {
            t.forEach(function(t, e) {
                t.id == o && (d[a][e].count = r[n].count);
            });
        }), a.setData({
            cart: r,
            cartid: i,
            goodsList: d
        }), "takeout" == a.data.storeType) {
            var u = t.currentTarget.dataset.ispbox, l = parseFloat(t.currentTarget.dataset.pboxprice);
            if ("1" == u && l > 0) {
                var p = parseFloat(a.data.pboxPrice);
                p += l, p = a.changeTwoDecimal_f(p), a.setData({
                    pboxPrice: p
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
        var t = this, a = t.data.cart, o = 0, e = 0;
        for (var s in a) o += a[s].count, e = Math.floor(100 * e) / 100, "0" == a[s].hasoption ? (a[s].totalprice = Math.floor(100 * a[s].totalprice) / 100, 
        e += a[s].totalprice) : a[s].options.forEach(function(t, a) {
            t.price = Math.floor(100 * t.price) / 100, e += t.price;
        }), e = t.changeTwoDecimal_f(e);
        if (o <= 0 && t.hiddenCart(), "takeout" == t.data.storeType) {
            var r = parseFloat(t.data.pboxPrice);
            e = r + parseFloat(e);
            var i = parseFloat(t.data.startPrice) - e;
            i = i >= 0 ? t.changeTwoDecimal_f(i) : 0, t.setData({
                lastPrice: i
            }), e = t.changeTwoDecimal_f(e);
        }
        t.setData({
            cartPrice: e,
            cartRealPrice: parseFloat(e),
            cartCount: o
        });
    },
    showCart: function(t) {
        var a = this;
        a.data.cartCount > 0 && a.setData({
            cartShow: 1
        });
    },
    trashCart: function() {
        var t = this;
        wx.showModal({
            title: "提示",
            content: "确定清空购物车？",
            success: function(a) {
                if (a.confirm) {
                    var o = t.data.goodsList;
                    o.forEach(function(t, a) {
                        t.forEach(function(t, e) {
                            o[a][e].count = 0;
                        });
                    }), t.setData({
                        cart: [],
                        cartid: [],
                        optionsid: {},
                        cartCount: 0,
                        cartPrice: 0,
                        cartRealPrice: 0,
                        cartShow: 0,
                        sendFee: 0,
                        startPrice: 0,
                        sendLimit: 0,
                        pboxPrice: 0,
                        lastPrice: 0,
                        goodsList: o
                    });
                }
            }
        });
    },
    submitCart: function(t) {
        var a = this, o = t.currentTarget.dataset.status;
        return console.log(o), !(o >= 1) && (!(a.data.cartCount <= 0) && (a.setData({
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
        var o = (a = Math.round(100 * t) / 100).toString(), e = o.indexOf(".");
        for (e < 0 && (e = o.length, o += "."); o.length <= e + 2; ) o += "0";
        return o;
    },
    showDetail: function(t) {
        var a = this, o = t.currentTarget.dataset;
        a.setData({
            goodsMask: 1,
            dGoodsImage: o.goodsimg,
            dGoodsDetail: o.goodsintro,
            dGoodsName: o.goodsname,
            dGoodsPrice: o.goodsprice
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
    clickBell: function(a) {
        var o = this;
        wx.showModal({
            title: "提示",
            content: "呼叫服务员？",
            showCancel: !0,
            success: function(a) {
                a.confirm && ("" == o.data.deskname ? wx.showModal({
                    title: "提示",
                    content: "扫描桌号二维码点餐才能呼叫服务员",
                    showCancel: !1
                }) : t.util.request({
                    url: "entry/wxapp/deampost",
                    cachetime: "0",
                    showLoading: !0,
                    data: {
                        op: "call_waiter",
                        desk_id: o.data.deskid,
                        store_id: o.data.storeid
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