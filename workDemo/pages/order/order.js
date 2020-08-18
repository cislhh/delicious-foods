// pages/order/order.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        "list":[{
            "text":"订单查询",
            "iconPath":"/pages/image/icon/ddFull.png",
            "selectedIconPath":"/pages/image/icon/dd.png",
            "badge":""
        },
        {
            "text":"订单查询",
            "iconPath":"/pages/image/icon/sc.png",
            "selectedIconPath":"/pages/image/icon/sc.png",
            "badge":""
        },
        {
            "text":"订单查询",
            "iconPath":"/pages/image/icon/sc.png",
            "selectedIconPath":"/pages/image/icon/sc.png",
            "badge":""
        },{
            "text":"订单查询",
            "iconPath":"/pages/image/icon/sc.png",
            "selectedIconPath":"/pages/image/icon/sc.png",
            "badge":"3"
        }
        ],
        show:false,
        actions: [
            { text: '退款详情', value: 1 },
            { text: '清除历史订单', value: 2 ,type: 'warn'},
            { text: '联系客服',  value: 3 }
        ]
    },
    _goback(){
        wx.navigateBack({
          delta: 1,
        })
    },
    _switchTab:function(e){
        console.log(e)
        if(e.detail.index==1){
            // wx.redirectTo({
            //   url: '',
            // })
        }
    },
    _showAction:function(){
        this.setData({
            "show":true
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})