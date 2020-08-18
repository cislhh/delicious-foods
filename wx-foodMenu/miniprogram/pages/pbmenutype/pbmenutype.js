// pages/pbmenutype/pbmenutype.js
import Config from '../../utils/config.js'
import Db from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addBtn: false, //显示添加
    updateBtn: false, //显示修改
    typeName: "", //分类名称
  },
  //显示添加组件
  _showAdd: function () {
    this.setData({
      addBtn: !this.data.addBtn
    })
  },
  //获取添加分类内容
  _inputAdd: function (e) {
    this.setData({
      typeName: e.detail.value
    })
  },
  //添加分类
  _addType: async function () {
    //判断分类是否为空
    if (this.data.typeName == "") {
      wx.showToast({
        title: '名称不能为空',
        icon: none
      })
      return;
    }
    //判断分类表中有没有相同分类名称

    //最后添加
    let res = await Db.add(Config.tables.type, {
      typeName: this.data.typeName
    });
    //初始化分类名称
    this.setData({
      typeName: ""
    })
    this._showAdd()
    if (res._id) {
      wx.showToast({
        title: '添加分类成功',
      })
    } else {
      wx.showToast({
        title: '添加分类失败',
        icon: none
      })
    }
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