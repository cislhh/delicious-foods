import Config from '../../utils/config.js'
import Db from '../../utils/api.js'
import Search from '../../utils/searchList.js'
import Gopage from '../../utils/goPage.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:"",//分类，默认只要三条
    hotMenu:[],//热门菜谱
    page:1,//当前页数
    isMore:true,//是否还有更多数据
    keyword:""//关键字
  },
  
  //搜索关键字
  _inputKeyword:function(e){
    this.setData({
      keyword:e.detail.value
    })
  },
  //进入详情页面
  _goDetail:function(e){
    Gopage._goDetail(e)
  },
  _search:function(){
    Search._search(this.data)
  },
  //获取类型
  _getType:async function(){
    let res = await Db.findByPage(Config.tables.type,{},1,3);
    this.setData({
        type:res.data
    })
  },
  //进入分类列表页
  _goTypeList:function(){
    wx.navigateTo({
      url: '../typelist/typelist',
    })
  },
  //进入菜谱列表页
   _goMenuList:function(e){
      let {id,typeName} = e.currentTarget.dataset
      wx.navigateTo({
        url: `../recipelist/recipelist?id=${id}&typeName=${typeName}`,
      })
  },

  //获取热门菜谱
  _getHotMenu:async function(page){
    if(!this.data.isMore){return}
    wx.showLoading({
        title:"加载中"
    })
    let res = await Db.findByPage(Config.tables.menu,{status:1},page,5,{field:"view",sort:"desc"});
    if(res.data.length<5){
        this.data.isMore=false
    }
    if(res.data.length==0){
        wx.hideLoading()
        return;
    }
    let task=[];
    res.data.forEach(item=>{
        let p = Db.find(Config.tables.user,{_openid:item._openid});
        task.push(p);
    })
    let result = await Promise.all(task)
    res.data.forEach((item,index) => {
        item.userInfo=result[index].data[0].userInfo
    });
    wx.hideLoading()
    this.setData({
        hotMenu:this.data.hotMenu.concat(res.data)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取类型
    this._getType();
    
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
    this._getHotMenu();
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
    this.data.page++;
    this._getHotMenu(this.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})