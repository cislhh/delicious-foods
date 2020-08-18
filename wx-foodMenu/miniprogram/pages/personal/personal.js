// pages/personal/personal.js
let app=getApp();
import Config from '../../utils/config.js'
import Db from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    userInfo:""
  },
  //获取用户的授权
  _getUserInfo:function(e){
    //获取用户的详情
    let userInfo=e.detail.userInfo;
    //获取用户的openid作为用户的唯一标示
    wx.login({
      success:async res=>{
       let result= await wx.cloud.callFunction({
          name:"login",
          data:{}
        })
        if(result.result.openid){//获取openid值成功
          //设置全局登录信息
          wx.setStorageSync('userInfo',userInfo);
          wx.setStorageSync('openid', result.result.openid);
          app.globalData.isLogin=true;
          //设置登录页面的数据
          this.setData({
            userInfo:userInfo,
            isLogin:true
          })
          //先查询用户有没有存储过我们的用户信息，
          let res=await Db.find(Config.tables.user,{_openid: result.result.openid})
          if(res.data.length==0){
            //将用户的信息存入到数据库
            res=await Db.add(Config.tables.user,{userInfo:userInfo});
            if(res._id){
              wx.showToast({
                title: '登录成功',
              })
            }else{
              wx.showToast({
                title: '登录失败',
                icon:none
              })
            }
          }
        }
      }
    })
  },
  //进入我们的分类管理页面
  _goAdmin:function(){
    if(Config.admin==wx.getStorageSync('openid')){
        wx.navigateTo({
          url: '../pbmenutype/pbmenutype',
        })
    }
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo:wx.getStorageSync('userInfo')||"",
      isLogin:app.globalData.isLogin
    })
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