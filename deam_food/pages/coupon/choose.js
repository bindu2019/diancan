var app = getApp();

Page({
    data: {
        isChoose: 0
    },
    onLoad: function(t) {
        this.setData({
            store_id: t.store_id,
            price: t.price,
            storeType: t.type,
            isChoose: t.useCoupon
        });
    },
    onReady: function() {},
    onShow: function() {
        var o = this;
        app.util.request({
            url: "entry/wxapp/settings",
            cachetime: "0",
            showLoading: !1,
            success: function(t) {
                "1" == (t = t.data).status && (wx.setNavigationBarColor && wx.setNavigationBarColor({
                    frontColor: t.result.fg_color,
                    backgroundColor: t.result.bg_color
                }), wx.setNavigationBarTitle({
                    title: "选择优惠券"
                }), o.setData({
                    isShow: 1
                }));
            }
        }), app.util.request({
            url: "entry/wxapp/coupon",
            cachetime: "0",
            showLoading: !0,
            data: {
                store_id: o.data.store_id,
                price: o.data.price,
                store_type: o.data.storeType,
                op: "choose"
            },
            success: function(t) {
                0 <= (t = t.data).status && o.setData({
                    couponCount: t.status,
                    couponList: t.result.list
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    chooseCoupon: function(t) {
        var o = this, e = t.currentTarget.dataset.couponid, a = o.data.couponList;
        0 < e ? (a.forEach(function(t, o) {
            t.id == e && (a[o].checked = "checked");
        }), o.setData({
            couponList: a,
            isChoose: e
        })) : o.setData({
            isChoose: e
        });
        var s = getCurrentPages();
        s[s.length - 1];
        s[s.length - 2].setData({
            useCoupon: e
        }), wx.navigateBack();
    }
});