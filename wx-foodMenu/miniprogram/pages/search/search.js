import Config from '../../utils/config.js'
import Db from '../../utils/api.js'
import Search from '../../utils/searchList.js'
import Gopage from '../../utils/goPage.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotSearch:[],
    lastSearch:[],
    keyword:""//关键字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //搜索关键字
  _inputKeyword:function(e){
    this.setData({
      keyword:e.detail.value
    })
  },
  _search:function(){
    Search._search(this.data)
  },
  //热门搜索
  _getHotSearch:async function(){
    let res = await Db.findByPage(Config.tables.menu,{status:1},1,6,{field:"view",sort:"desc"})
    if(res.data.length!=0){
      this.setData({
        hotSearch:res.data
      })
    }
  },
  //进入详情页面
  _goDetail:function(e){
    Gopage._goDetail(e)
  },
  _getLastSearch:function(){
    this.setData({
      lastSearch:wx.getStorageSync('keywords')||[]
    })
  },
  _goMenuList:function(e){
    Gopage._goMenuList(e)
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
    this._getHotSearch();
    this._getLastSearch();
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