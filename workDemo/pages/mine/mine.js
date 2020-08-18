// pages/home/home.js

let tryUser = require("../../utils/userInfo")
let timer = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxlength: 18,
    username: "",
    password: "",
    usermail: "",
    try: false,
    hidden: true,
    mod: "namemod",
    userInfo: false,
    islogin: false
  },
  autoLogin: function () {
    wx.login({
      success: (res) => {
        wx.request({
          url: 'http://localhost:3000/login',
          data: {
            code: res.code
          },
          success:  (result)=>{
            wx.setStorageSync('token', result.data.token);
            this.setData({
              islogin:true
            })
          }
        })

      }
    })
  },
  _checkLoginStatus: function () {
    wx.checkSession({
      success: (res) => {
        this.setData({
          islogin: true
        })
      },
      fail: (error) => {
        this.autoLogin()
      }
    })
  },
  _getUserInfo:function(e) {
      console.log(e)
      wx.setStorageSync('userInfo', e.detail.userInfo);
      this.setData({
        userInfo:e.detail.userInfo
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._checkLoginStatus();
    wx.getSetting({
      success:(res)=>{
        // console.log(res)
        //判断用户是否授权
        if(res.authSetting["scope.userInfo"]){
          wx.getUserInfo({
            success:(e)=>{
              console.log(e)
              // wx.setStorageSync('userInfo', e.detail.userInfo);
              this.setData({
                userInfo:e.userInfo
              })
            }
          })
        }else{

        }
      }
    })
    console.log(this.data.maxlength)
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

  },
  //定时器，控制弹框一段时间消失
  timeOut: function () {
    timer = setTimeout(() => {
      this.setData({
        hidden: true
      })
    }, 2000)
  },
  //登录提交用户数据
  in_logbtn: function (e) {
    this.data.userInfo.userName = this.data.username;
    this.data.userInfo.passWord = this.data.password;
    this.data.userInfo.userMail = this.data.usermail;
    //验证数据是否匹配
    tryUser.map(item => {
      if (item.userName == this.data.userInfo.userName && item.passWord == this.data.userInfo.passWord || item.userMail == this.data.userInfo.userMail && item.passWord == this.data.userInfo.passWord) {
        console.log("成功登陆")
        this.setData({
          try: true,
          hidden: false
        })
      } else {
        console.log("登录失败，请检查帐号或者密码是否正确")
        this.setData({
          try: false,
          hidden: false
        })
      }
    })
    this.timeOut()
    console.log(this.timeOut())
    clearTimeout(timer)
  },
  //获取用户名
  getName: function (e) {
    let username = e.detail.value
    this.setData({
      username
    })
  },
  //获取用户邮箱
  getMail: function (e) {
    let usermail = e.detail.value
    this.setData({
      usermail
    })
  },
  //请输入密码
  getPass: function (e) {
    let password = e.detail.value
    this.setData({
      password
    })
  },
  //切换当前登录模式,顺便清除填写的内容
  logModel: function (e) {
    let model = e.currentTarget.dataset.mod;
    this.setData({
      mod: model,
      username: "",
      password: "",
      usermail: "",
    })
  }
})