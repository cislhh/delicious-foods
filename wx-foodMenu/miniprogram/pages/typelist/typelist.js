// pages/typelist/typelist.js
import Config from '../../utils/config.js'
import Db from '../../utils/api.js'
import Search from '../../utils/searchList.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:[],//所有分类
    keyword:""//关键字
  },
   // //搜索关键字
   _inputKeyword:function(e){
    this.setData({
      keyword:e.detail.value
    })
  },
  _search:function(){
    Search._search(this.data)
  },
  //所有分类
  _getType:async function(){
    wx.showLoading({
      title: '加载中',
    })
    let res = await Db.findAll(Config.tables.type)
    if(res.data){
      this.setData({
        type:res.data
      })
    }
    wx.hideLoading()
  },
  //进入菜谱列表页
  _goMenuList:function(e){
    let {id,typeName} = e.currentTarget.dataset
    wx.navigateTo({
      url: `../recipelist/recipelist?id=${id}&typeName=${typeName}`,
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getType()
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