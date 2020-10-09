// pages/recipeDetail/recipeDetail.js
let app=getApp();
import Config from '../../utils/config.js'
import Db from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu:{},//菜谱详情,
    userInfo:{},//用户信息，
    isFollow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置导航
    wx.setNavigationBarTitle({
      title:options.menuName
    })
    //获取菜谱的详细信息
    this._getMenuById(options.id);
    //获取用户的关注状态
    this._getIsFollow(options.id);
    //将菜谱的阅读数量+1
    this._setView(options.id)
  },
  //获取菜谱信息
  _getMenuById:async function(id){
    //获取菜谱的详情
    let res=await Db.findById(Config.tables.menu,id);
    console.log(res);
    //获取用户的信息
    let userInfo=await Db.find(Config.tables.user,{_openid:res.data._openid});
    console.log(userInfo)
    this.setData({
      menu:res.data,
      userInfo:userInfo.data[0].userInfo
    })
  },
  //显示是否关注
  _getIsFollow:async function(menu_id){
    //判断用户有没有登录过
    if(app.globalData.isLogin){
      //判断用户有没有关注过
      let _openid=wx.getStorageSync('openid');
      let res=await Db.find(Config.tables.follow,{_openid,menu_id})
      if(res.data.length==0){
        //没有关注过
        this.setData({
          isFollow:false
        })
      }else{
        //用户已经关注
        this.setData({
          isFollow:true
        })
      }
      
    }else{
      //用户没登录
      this.setData({
        isFollow:false
      })
    }
  },
  //设置关注或者取消关注
  _setFollow:async function(){
    //先判断有无登录
    if(app.globalData.isLogin){
      //判断用户有没有关注过
      let _openid=wx.getStorageSync('openid');
      let menu_id=this.data.menu._id;
      if(this.data.isFollow){//取消关注
        //1现将我们关注表的记录删除
        let res=await Db.removeByWhere(Config.tables.follow,{_openid,menu_id})
        if(res.stats.removed){//删除成功
            this.setData({
              isFollow:false
            })
           //将当前菜谱的关注量-1
           Db.update(Config.tables.menu,menu_id,{
             follow:Db._.inc(-1)
           })
        }
      }else{
        //去完成关注，往follow表中插入一条数据
        let res = await Db.add(Config.tables.follow,{menu_id});
        if(res._id){//插入成功
          this.setData({
            isFollow:true
          })
          //关注量+1
          Db.update(Config.tables.menu,menu_id,{
            follow:Db._.inc(1)
          })
        }  
      }
    }else{
      wx.showModal({
        title:'提示信息',
        content:"请先登录",
        success:res=>{
          if(res.confirm){
            wx.switchTab({
              url: '../personal/personal',
            })
          }
        }
      })
    }
  },
  //设置阅读数
  _setView:function(id){
    Db.update(Config.tables.menu,id,{
      view:Db._.inc(1)
    })
  },
  /**
   * 生命周期函数--监听页面l初次渲染完成
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