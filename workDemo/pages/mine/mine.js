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
    try: false,
    hidden: true,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
    //验证数据是否匹配
    tryUser.map(item => {
      if (item.userName == this.data.userInfo.userName && item.passWord == this.data.userInfo.passWord) {
        console.log("成功登陆")
        this.setData({
          try: true,
          hidden: false
        })
        // this.timeOut()
        // console.log(this.timeOut())
        // clearTimeout(timer)
      } else {
        console.log("登录失败，请检查帐号或者密码是否正确")
        this.setData({
          try: false,
          hidden: false
        })
        // this.timeOut()
        // console.log(this.timeOut())
        // clearTimeout(timer)
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
  //请输入密码
  getPass: function (e) {
    let password = e.detail.value
    this.setData({
      password
    })
  }
})