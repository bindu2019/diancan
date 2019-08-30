var o = getApp();

Page({
    data: {
        isShow: 0,
        order_id: 0,
        userId: 0,
        orderNumber: "",
        ticketRemark: "",
        goodsList: [],
        totalPrice: 0,
        orderInfo: {}
    },
    onLoad: function(e) {
        var t = this;
        t.setData({
            order_id: e.id
        }), o.util.request({
            url: "entry/wxapp/settings",
            cachetime: "0",
            showLoading: !1,
            success: function(o) {
                "1" == (o = o.data).status && (wx.setNavigationBarColor && wx.setNavigationBarColor({
                    frontColor: o.result.fg_color,
                    backgroundColor: o.result.bg_color
                }), wx.setNavigationBarTitle({
                    title: "订单详情"
                }));
            }
        }), t.getOrderInfo();
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.getOrderInfo(function() {
            wx.stopPullDownRefresh();
        });
    },
    onReachBottom: function() {},
    getOrderInfo: function(e) {
        var t = this;
        o.util.getUserInfo(function() {
            "" != wx.getStorageSync("userInfo") ? o.util.request({
                url: "entry/wxapp/data",
                cachetime: "0",
                showLoading: !0,
                data: {
                    op: "orderinfo",
                    order_id: t.data.order_id
                },
                success: function(o) {
                    if ("1" == (o = o.data).status) {
                        var r = JSON.parse(o.result.goods_list);
                        t.setData({
                            orderNumber: o.result.order_number,
                            ticketRemark: o.result.ticket_remark,
                            goodsList: r,
                            totalPrice: o.result.pay_price,
                            useCoupon: o.result.use_coupon,
                            couponPrice: o.result.coupon_price,
                            orderInfo: o.result,
                            isShow: 1
                        }), o.result.need_send_coupon > 0 && 0 == o.result.is_send_coupon && wx.showModal({
                            title: "提示",
                            content: "本次订单获得" + o.result.need_send_coupon + "张优惠券，已放入您的卡包！",
                            showCancel: !1,
                            confirmText: "确定",
                            confirmColor: "#ff9c37",
                            success: function(o) {
                                o.confirm;
                            }
                        }), e && e();
                    } else wx.showModal({
                        title: "提示",
                        content: o.result.message,
                        showCancel: !1,
                        success: function(o) {
                            o.confirm && wx.switchTab({
                                url: "/deam_food/pages/index/index"
                            });
                        }
                    });
                }
            }) : wx.navigateTo({
                url: "/deam_food/pages/auth/auth"
            });
        });
    }
});